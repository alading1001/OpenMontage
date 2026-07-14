import React, {useEffect, useMemo, useState} from 'react';
import {
  AbsoluteFill,
  Audio,
  Sequence,
  continueRender,
  delayRender,
  interpolate,
  staticFile,
  useCurrentFrame,
} from 'remotion';

type Segment = {
  id: string;
  subtitle: string;
  file: string;
  start: number;
  duration: number;
  end: number;
};

type Timeline = {
  fps: number;
  duration: number;
  segments: Segment[];
};

type Point = {
  x: number;
  y: number;
};

const FPS = 30;
const MOUSE_COUNT = 6;
const WIDTH = 1080;
const HEIGHT = 1920;

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const smooth = (value: number) => {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
};
const mix = (from: number, to: number, amount: number) => from + (to - from) * amount;
const lerpPoint = (from: Point, to: Point, amount: number): Point => ({
  x: mix(from.x, to.x, amount),
  y: mix(from.y, to.y, amount),
});

const center: Point[] = [
  {x: 330, y: 1080},
  {x: 540, y: 1080},
  {x: 750, y: 1080},
  {x: 330, y: 1260},
  {x: 540, y: 1260},
  {x: 750, y: 1260},
];

const leftThree: Point[] = [
  {x: 230, y: 900},
  {x: 340, y: 1020},
  {x: 220, y: 1140},
];

const rightThree: Point[] = [
  {x: 850, y: 900},
  {x: 740, y: 1020},
  {x: 860, y: 1140},
];

const leftTwo: Point[] = [
  {x: 230, y: 960},
  {x: 330, y: 1110},
];

const rightFour: Point[] = [
  {x: 850, y: 870},
  {x: 740, y: 1010},
  {x: 860, y: 1150},
  {x: 750, y: 1290},
];

const firstTargets: Record<number, Point> = {
  0: leftThree[0],
  1: rightThree[0],
  2: leftThree[1],
  3: rightThree[1],
  4: leftThree[2],
  5: rightThree[2],
};

const altTargets: Record<number, Point> = {
  0: leftTwo[0],
  1: leftTwo[1],
  2: rightFour[0],
  3: rightFour[1],
  4: rightFour[2],
  5: rightFour[3],
};

const moveByMouse: Record<number, string> = {
  0: 'move_1_left',
  1: 'move_2_right',
  2: 'move_3_left',
  3: 'move_4_right',
  4: 'move_5_left',
  5: 'move_6_right',
};

const altMoveByMouse: Record<number, string> = {
  0: 'alt_left_1',
  1: 'alt_left_2',
  2: 'alt_right_1',
  3: 'alt_right_2',
  4: 'alt_right_3',
  5: 'alt_right_4',
};

const colors = ['#c79a72', '#d1a27c', '#bf8f68', '#d8ad85', '#c5956d', '#d4a982'];

const useTimeline = () => {
  const [handle] = useState(() => delayRender('Loading mouse fruit timeline'));
  const [timeline, setTimeline] = useState<Timeline | null>(null);

  useEffect(() => {
    fetch(staticFile('mouse-fruit-split/timeline.json'))
      .then((res) => res.json())
      .then((data: Timeline) => {
        setTimeline(data);
        continueRender(handle);
      });
  }, [handle]);

  return timeline;
};

const segMap = (timeline: Timeline | null) => {
  const map = new Map<string, Segment>();
  timeline?.segments.forEach((segment) => map.set(segment.id, segment));
  return map;
};

const byId = (map: Map<string, Segment>, id: string) => map.get(id);

const progressFor = (map: Map<string, Segment>, id: string, time: number, maxMoveSeconds = 1.65) => {
  const segment = byId(map, id);
  if (!segment) return 0;
  const duration = Math.min(maxMoveSeconds, Math.max(0.9, segment.duration));
  return smooth((time - segment.start) / duration);
};

const currentSegment = (timeline: Timeline | null, time: number) => {
  if (!timeline) return null;
  let current = timeline.segments[0];
  for (const segment of timeline.segments) {
    if (time >= segment.start) current = segment;
  }
  return current;
};

const countHighlight = (id?: string) => {
  const match = id?.match(/^count_(\d)$/);
  return match ? Number(match[1]) - 1 : -1;
};

const firstMovedCount = (map: Map<string, Segment>, time: number) => {
  return Object.values(moveByMouse).filter((id) => {
    const segment = byId(map, id);
    return segment && time >= segment.start + 0.85;
  }).length;
};

const altMovedCount = (map: Map<string, Segment>, time: number) => {
  return Object.values(altMoveByMouse).filter((id) => {
    const segment = byId(map, id);
    return segment && time >= segment.start + 0.85;
  }).length;
};

const mousePosition = (index: number, map: Map<string, Segment>, time: number): Point => {
  const reset = byId(map, 'reset');
  const resetStart = reset?.start ?? Number.POSITIVE_INFINITY;

  if (time < resetStart) {
    const moveId = moveByMouse[index];
    const move = byId(map, moveId);
    if (!move || time < move.start) return center[index];
    return lerpPoint(center[index], firstTargets[index], progressFor(map, moveId, time));
  }

  const resetProgress = reset ? progressFor(map, 'reset', time, 1.35) : 1;
  const afterResetCenter = lerpPoint(firstTargets[index], center[index], resetProgress);
  const altMoveId = altMoveByMouse[index];
  const altMove = byId(map, altMoveId);
  if (!altMove || time < altMove.start) return afterResetCenter;
  return lerpPoint(center[index], altTargets[index], progressFor(map, altMoveId, time));
};

const activeMouse = (segmentId?: string) => {
  const first = Object.entries(moveByMouse).find(([, id]) => id === segmentId);
  if (first) return Number(first[0]);
  const alt = Object.entries(altMoveByMouse).find(([, id]) => id === segmentId);
  if (alt) return Number(alt[0]);
  return countHighlight(segmentId);
};

const Mouse: React.FC<{point: Point; index: number; active: boolean}> = ({point, index, active}) => {
  const frame = useCurrentFrame();
  const bob = Math.sin(frame / 12 + index) * 3;
  const scale = active ? 1.08 : 1;
  return (
    <div
      style={{
        position: 'absolute',
        left: point.x - 50,
        top: point.y - 55 + bob,
        width: 100,
        height: 112,
        transform: `scale(${scale})`,
        transition: 'none',
        zIndex: Math.round(point.y),
      }}
    >
      {active && (
        <div
          style={{
            position: 'absolute',
            inset: -12,
            borderRadius: 999,
            background: 'rgba(255, 209, 102, 0.42)',
            boxShadow: '0 0 0 8px rgba(255, 209, 102, 0.18)',
          }}
        />
      )}
      <div
        style={{
          position: 'absolute',
          left: 8,
          top: 5,
          width: 34,
          height: 34,
          borderRadius: '50%',
          background: colors[index],
          border: '5px solid #7f6657',
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: 8,
          top: 5,
          width: 34,
          height: 34,
          borderRadius: '50%',
          background: colors[index],
          border: '5px solid #7f6657',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 14,
          top: 23,
          width: 72,
          height: 66,
          borderRadius: '46% 46% 44% 44%',
          background: colors[index],
          border: '5px solid #7f6657',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 32,
          top: 43,
          width: 8,
          height: 8,
          borderRadius: 999,
          background: '#2c2c2c',
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: 32,
          top: 43,
          width: 8,
          height: 8,
          borderRadius: 999,
          background: '#2c2c2c',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 46,
          top: 57,
          width: 10,
          height: 8,
          borderRadius: 999,
          background: '#5f4034',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 36,
          top: 77,
          width: 30,
          height: 8,
          borderRadius: 999,
          background: '#fff8eb',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 17,
          top: 91,
          width: 66,
          height: 16,
          borderRadius: 999,
          background: '#7cb79b',
          border: '4px solid #5f917a',
        }}
      />
    </div>
  );
};

const Basket: React.FC<{side: 'left' | 'right'}> = ({side}) => {
  const x = side === 'left' ? 165 : 695;
  return (
    <div style={{position: 'absolute', left: x, top: 615, width: 220, height: 170}}>
      <div
        style={{
          position: 'absolute',
          left: 26,
          top: 8,
          width: 48,
          height: 48,
          borderRadius: 999,
          background: '#ee6b54',
          boxShadow: '58px 8px 0 #f2b84b, 110px 0 0 #ef8d4e',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 34,
          top: 46,
          width: 152,
          height: 42,
          border: '14px solid #b97545',
          borderBottom: 'none',
          borderRadius: '80px 80px 0 0',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 18,
          top: 78,
          width: 184,
          height: 86,
          borderRadius: '20px 20px 34px 34px',
          background: 'linear-gradient(180deg, #d89053, #b86f3c)',
          border: '7px solid #8d5739',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 36,
          top: 105,
          width: 148,
          height: 9,
          background: '#f0bc79',
          boxShadow: '0 24px 0 #f0bc79',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 175,
          width: 220,
          textAlign: 'center',
          fontSize: 34,
          lineHeight: 1.1,
          fontWeight: 900,
          color: '#594436',
        }}
      >
        {side === 'left' ? '左边水果筐' : '右边水果筐'}
      </div>
    </div>
  );
};

const Subtitle: React.FC<{text: string}> = ({text}) => (
  <div
    style={{
      position: 'absolute',
      left: 80,
      right: 80,
      bottom: 92,
      minHeight: 112,
      borderRadius: 34,
      background: 'rgba(54, 68, 65, 0.92)',
      color: '#fffaf1',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '20px 36px',
      fontSize: 42,
      lineHeight: 1.25,
      fontWeight: 900,
      boxShadow: '0 18px 42px rgba(43, 38, 30, 0.22)',
    }}
  >
    {text}
  </div>
);

const CountBadge: React.FC<{text: string; x: number; y: number}> = ({text, x, y}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      minWidth: 178,
      padding: '14px 22px',
      borderRadius: 24,
      background: '#fff8e8',
      border: '5px solid #e4c58f',
      color: '#4c4037',
      fontSize: 34,
      fontWeight: 900,
      textAlign: 'center',
      boxShadow: '0 12px 24px rgba(98, 74, 42, 0.12)',
    }}
  >
    {text}
  </div>
);

const SummaryCard: React.FC<{variant: 'three' | 'two'; x: number}> = ({variant, x}) => {
  const isThree = variant === 'three';
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: 1185,
        width: 425,
        height: 245,
        borderRadius: 34,
        background: '#fffaf0',
        border: '6px solid #e6c48a',
        boxShadow: '0 18px 40px rgba(74, 62, 45, 0.14)',
        padding: 22,
      }}
    >
      <div style={{fontSize: 36, fontWeight: 900, color: '#594436', marginBottom: 18}}>
        {isThree ? '一种分法' : '另一种分法'}
      </div>
      <div style={{display: 'flex', justifyContent: 'space-between', padding: '0 8px'}}>
        <div style={{fontSize: 58, fontWeight: 900, color: '#f28c43'}}>左 {isThree ? 3 : 2} 只</div>
        <div style={{fontSize: 58, fontWeight: 900, color: '#5c9f82'}}>右 {isThree ? 3 : 4} 只</div>
      </div>
      <div style={{fontSize: 28, color: '#7a6655', marginTop: 18, fontWeight: 800}}>
        两筐水果都有小老鼠帮忙
      </div>
    </div>
  );
};

export const MouseFruitSplit: React.FC = () => {
  const frame = useCurrentFrame();
  const timeline = useTimeline();
  const time = frame / FPS;
  const map = useMemo(() => segMap(timeline), [timeline]);
  const current = currentSegment(timeline, time);
  const active = activeMouse(current?.id);
  const reset = byId(map, 'reset');
  const ending = byId(map, 'ending');
  const twoFour = byId(map, 'two_four');
  const threeThree = byId(map, 'three_three');

  const inEnding = ending ? time >= ending.start : false;
  const afterReset = reset ? time >= reset.start : false;
  const firstMoved = firstMovedCount(map, time);
  const altMoved = altMovedCount(map, time);
  const leftCount = !afterReset ? [0, 2, 4].filter((i) => firstMoved > i).length : [0, 1].filter((i) => altMoved > i).length;
  const rightCount = !afterReset ? [1, 3, 5].filter((i) => firstMoved > i).length : [2, 3, 4, 5].filter((i) => altMoved > i).length;
  const countIndex = countHighlight(current?.id);
  const hideCountLabels = current?.id === 'question_counts';

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(180deg, #fff4df 0%, #f5dfbf 100%)',
        fontFamily: '"Microsoft YaHei", "SimHei", sans-serif',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 18% 18%, rgba(255,255,255,0.82) 0 11%, transparent 12%), radial-gradient(circle at 82% 28%, rgba(255,255,255,0.5) 0 8%, transparent 9%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 68,
          top: 70,
          color: '#554034',
          fontSize: 62,
          fontWeight: 900,
          lineHeight: 1.08,
        }}
      >
        6 只小老鼠
        <div style={{fontSize: 34, color: '#8b6d58', marginTop: 12}}>两筐水果，都来帮忙</div>
      </div>

      {countIndex >= 0 && (
        <div
          style={{
            position: 'absolute',
            top: 245,
            left: 180,
            right: 180,
            padding: '22px 30px',
            borderRadius: 32,
            background: '#fffaf0',
            border: '6px solid #f1c36f',
            textAlign: 'center',
            fontSize: 50,
            fontWeight: 900,
            color: '#4c4037',
          }}
        >
          现在数到 {countIndex + 1} 只
        </div>
      )}

      {!inEnding && (
        <>
          <Basket side="left" />
          <Basket side="right" />
        </>
      )}

      {!inEnding &&
        Array.from({length: MOUSE_COUNT}).map((_, index) => (
          <Mouse key={index} point={mousePosition(index, map, time)} index={index} active={active === index} />
        ))}

      {!inEnding && firstMoved > 0 && !afterReset && !hideCountLabels && (
        <>
          <CountBadge text={`左边 ${leftCount} 只`} x={112} y={1380} />
          <CountBadge text={`右边 ${rightCount} 只`} x={790} y={1380} />
        </>
      )}

      {!inEnding && afterReset && altMoved > 0 && (
        <>
          <CountBadge text={`左边 ${leftCount} 只`} x={112} y={1380} />
          <CountBadge text={`右边 ${rightCount} 只`} x={790} y={1380} />
        </>
      )}

      {threeThree && time >= threeThree.start && time < (reset?.start ?? Number.POSITIVE_INFINITY) && (
        <div
          style={{
            position: 'absolute',
            left: 240,
            top: 1498,
            padding: '16px 34px',
            borderRadius: 28,
            background: '#fffaf0',
            border: '5px solid #f1c36f',
            color: '#4c4037',
            fontSize: 40,
            fontWeight: 900,
          }}
        >
          这是一种分法：左边 3 只，右边 3 只
        </div>
      )}

      {twoFour && time >= twoFour.start && !inEnding && (
        <div
          style={{
            position: 'absolute',
            left: 225,
            top: 1498,
            padding: '16px 34px',
            borderRadius: 28,
            background: '#fffaf0',
            border: '5px solid #f1c36f',
            color: '#4c4037',
            fontSize: 40,
            fontWeight: 900,
          }}
        >
          2 只和 4 只，也是一种分法
        </div>
      )}

      {inEnding && (
        <>
          <SummaryCard variant="three" x={75} />
          <SummaryCard variant="two" x={580} />
          <div
            style={{
              position: 'absolute',
              left: 120,
              right: 120,
              top: 780,
              textAlign: 'center',
              color: '#4c4037',
              fontSize: 58,
              fontWeight: 900,
              lineHeight: 1.25,
            }}
          >
            可以分成两边
            <div style={{fontSize: 38, color: '#7a6655', marginTop: 22}}>
              不一定每次都一样
            </div>
          </div>
        </>
      )}

      <Subtitle text={current?.subtitle ?? ''} />

      {timeline?.segments.map((segment) => (
        <Sequence
          key={segment.id}
          from={Math.round(segment.start * FPS)}
          durationInFrames={Math.ceil(segment.duration * FPS) + 2}
        >
          <Audio src={staticFile(segment.file)} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export const MOUSE_FRUIT_DURATION_FRAMES = 2753;
