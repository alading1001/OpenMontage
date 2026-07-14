import React, {useEffect, useMemo, useState} from 'react';
import {
  AbsoluteFill,
  Audio,
  Sequence,
  continueRender,
  delayRender,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

type Segment = {
  id: string;
  subtitle: string;
  file: string;
  start: number;
  duration: number;
  end: number;
  pause_after: number;
};

type Timeline = {
  fps: number;
  duration: number;
  segments: Segment[];
};

const FPS = 30;
const PROJECT_ID = 'kids-english-apple-banana-cat';
const W = 1080;
const H = 1920;

const words = {
  apple: {en: 'apple', zh: '苹果'},
  banana: {en: 'banana', zh: '香蕉'},
  cat: {en: 'cat', zh: '小猫'},
} as const;

type WordKey = keyof typeof words;

const useTimeline = () => {
  const [handle] = useState(() => delayRender('Loading kids english timeline'));
  const [timeline, setTimeline] = useState<Timeline | null>(null);

  useEffect(() => {
    fetch(staticFile(`${PROJECT_ID}/timeline.json`))
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
const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const inSeg = (segment: Segment | undefined, time: number) =>
  Boolean(segment && time >= segment.start && time <= segment.end + 0.18);

const currentSegment = (timeline: Timeline | null, time: number) => {
  if (!timeline) return null;
  let current = timeline.segments[0];
  for (const segment of timeline.segments) {
    if (time >= segment.start) current = segment;
  }
  return current;
};

const sceneForTime = (time: number, map: Map<string, Segment>) => {
  const banana = byId(map, 'banana_1');
  const cat = byId(map, 'cat_1');
  const quiz = byId(map, 'quiz_apple_q');
  const ending = byId(map, 'ending');
  if (ending && time >= ending.start) return 'ending';
  if (quiz && time >= quiz.start) return 'quiz';
  if (cat && time >= cat.start) return 'cat';
  if (banana && time >= banana.start) return 'banana';
  const apple = byId(map, 'apple_1');
  if (apple && time >= apple.start) return 'apple';
  return 'intro';
};

const activeWord = (id?: string): WordKey | null => {
  if (!id) return null;
  if (id.includes('apple')) return 'apple';
  if (id.includes('banana')) return 'banana';
  if (id.includes('cat')) return 'cat';
  return null;
};

const answerWord = (id?: string): WordKey | null => {
  if (id === 'quiz_apple_a') return 'apple';
  if (id === 'quiz_banana_a') return 'banana';
  if (id === 'quiz_cat_a') return 'cat';
  return null;
};

const pulseFor = (ids: string[], map: Map<string, Segment>, time: number) => {
  const match = ids.map((id) => byId(map, id)).find((segment) => inSeg(segment, time));
  if (!match) return 0;
  const local = (time - match.start) / Math.max(0.2, match.duration);
  return Math.sin(clamp(local) * Math.PI);
};

const Background: React.FC = () => (
  <AbsoluteFill
    style={{
      background: 'linear-gradient(180deg, #fff6e6 0%, #f7e8cc 55%, #f3dfbb 100%)',
      fontFamily: '"Arial Rounded MT Bold", "Microsoft YaHei", "Arial", sans-serif',
      overflow: 'hidden',
    }}
  >
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background:
          'radial-gradient(circle at 20% 15%, rgba(255,255,255,0.9) 0 10%, transparent 11%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.58) 0 8%, transparent 9%), radial-gradient(circle at 54% 78%, rgba(255,255,255,0.42) 0 12%, transparent 13%)',
      }}
    />
  </AbsoluteFill>
);

const AppleIcon: React.FC<{scale?: number; dim?: boolean}> = ({scale = 1, dim = false}) => (
  <div style={{transform: `scale(${scale})`, opacity: dim ? 0.42 : 1}}>
    <svg width="520" height="520" viewBox="0 0 520 520">
      <ellipse cx="255" cy="285" rx="150" ry="165" fill="#ec4b47" />
      <ellipse cx="315" cy="286" rx="145" ry="160" fill="#f45f52" />
      <ellipse cx="208" cy="238" rx="38" ry="58" fill="#ff8a7a" opacity="0.45" />
      <path d="M263 150 C246 102 275 72 318 55" stroke="#7d5231" strokeWidth="24" strokeLinecap="round" fill="none" />
      <path d="M310 75 C365 60 397 83 410 130 C356 144 320 121 310 75Z" fill="#72b65b" />
      <ellipse cx="255" cy="438" rx="86" ry="22" fill="rgba(98,73,38,0.15)" />
    </svg>
  </div>
);

const BananaIcon: React.FC<{scale?: number; dim?: boolean}> = ({scale = 1, dim = false}) => (
  <div style={{transform: `scale(${scale})`, opacity: dim ? 0.42 : 1}}>
    <svg width="560" height="520" viewBox="0 0 560 520">
      <path
        d="M112 178 C182 356 355 420 491 260 C449 406 238 461 88 254 C63 220 69 183 112 178Z"
        fill="#f6c948"
        stroke="#d89f28"
        strokeWidth="18"
        strokeLinejoin="round"
      />
      <path d="M107 181 C86 163 72 142 68 121" stroke="#80522e" strokeWidth="22" strokeLinecap="round" />
      <path d="M487 260 C514 247 526 226 527 204" stroke="#80522e" strokeWidth="18" strokeLinecap="round" />
      <path d="M150 240 C226 348 350 382 455 296" stroke="#ffe48a" strokeWidth="24" strokeLinecap="round" opacity="0.75" />
      <ellipse cx="285" cy="438" rx="145" ry="24" fill="rgba(98,73,38,0.14)" />
    </svg>
  </div>
);

const CatIcon: React.FC<{scale?: number; dim?: boolean}> = ({scale = 1, dim = false}) => {
  const frame = useCurrentFrame();
  const nod = Math.sin(frame / 18) * 2;
  return (
    <div style={{transform: `scale(${scale}) translateY(${nod}px)`, opacity: dim ? 0.42 : 1}}>
      <svg width="540" height="540" viewBox="0 0 540 540">
        <path d="M140 174 L168 82 L232 151 Z" fill="#f2b36f" stroke="#8a634a" strokeWidth="12" />
        <path d="M400 174 L372 82 L308 151 Z" fill="#f2b36f" stroke="#8a634a" strokeWidth="12" />
        <circle cx="270" cy="270" r="165" fill="#f6c184" stroke="#8a634a" strokeWidth="12" />
        <circle cx="212" cy="250" r="16" fill="#3b332f" />
        <circle cx="328" cy="250" r="16" fill="#3b332f" />
        <path d="M270 280 L252 310 L288 310 Z" fill="#c8716d" />
        <path d="M270 310 C248 338 221 338 202 319" stroke="#5f463a" strokeWidth="9" strokeLinecap="round" fill="none" />
        <path d="M270 310 C292 338 319 338 338 319" stroke="#5f463a" strokeWidth="9" strokeLinecap="round" fill="none" />
        <path d="M158 288 L72 268 M160 320 L72 326 M382 288 L468 268 M380 320 L468 326" stroke="#8a634a" strokeWidth="9" strokeLinecap="round" />
        <ellipse cx="270" cy="448" rx="120" ry="22" fill="rgba(98,73,38,0.14)" />
      </svg>
    </div>
  );
};

const Icon: React.FC<{word: WordKey; scale?: number; dim?: boolean}> = ({word, scale, dim}) => {
  if (word === 'apple') return <AppleIcon scale={scale} dim={dim} />;
  if (word === 'banana') return <BananaIcon scale={scale} dim={dim} />;
  return <CatIcon scale={scale} dim={dim} />;
};

const WordLabel: React.FC<{word: WordKey; active: boolean; small?: boolean}> = ({word, active, small = false}) => (
  <div style={{textAlign: 'center'}}>
    <div
      style={{
        display: 'inline-block',
        padding: small ? '10px 22px' : '16px 38px',
        borderRadius: small ? 24 : 32,
        background: active ? '#ffe27a' : 'rgba(255,255,255,0.78)',
        boxShadow: active ? '0 0 0 9px rgba(255, 213, 78, 0.22)' : '0 12px 26px rgba(98, 73, 38, 0.10)',
        color: '#47372d',
        fontSize: small ? 42 : 86,
        lineHeight: 1,
        fontWeight: 900,
      }}
    >
      {words[word].en}
    </div>
    <div style={{marginTop: small ? 10 : 18, fontSize: small ? 28 : 38, color: '#7a6655', fontWeight: 800}}>
      {words[word].zh}
    </div>
  </div>
);

const Subtitle: React.FC<{text: string}> = ({text}) => (
  <div
    style={{
      position: 'absolute',
      left: 76,
      right: 76,
      bottom: 72,
      minHeight: 108,
      borderRadius: 30,
      background: 'rgba(73, 86, 76, 0.92)',
      color: '#fffaf1',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '18px 34px',
      fontSize: 42,
      lineHeight: 1.2,
      fontWeight: 900,
      boxShadow: '0 14px 34px rgba(62, 48, 30, 0.18)',
    }}
  >
    {text}
  </div>
);

const IntroScene: React.FC<{time: number}> = ({time}) => {
  const items: WordKey[] = ['apple', 'banana', 'cat'];
  return (
    <>
      <div style={{position: 'absolute', top: 190, left: 90, right: 90, textAlign: 'center', fontSize: 68, fontWeight: 900, color: '#49372d'}}>
        听一听，跟着说
      </div>
      {items.map((word, index) => {
        const enter = spring({frame: Math.max(0, (time - 0.7 - index * 0.75) * FPS), fps: FPS, config: {damping: 16, stiffness: 110}});
        return (
          <div
            key={word}
            style={{
              position: 'absolute',
              top: 455 + index * 330,
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'center',
              opacity: enter,
              transform: `translateY(${(1 - enter) * 38}px)`,
            }}
          >
            <Icon word={word} scale={0.58} />
          </div>
        );
      })}
    </>
  );
};

const TeachScene: React.FC<{word: WordKey; map: Map<string, Segment>; time: number}> = ({word, map, time}) => {
  const pulse = pulseFor([`${word}_1`, `${word}_2`, `${word}_cn`, `${word}_repeat`], map, time);
  const scale = 1 + pulse * 0.055;
  const active = pulse > 0.03;
  return (
    <>
      <div style={{position: 'absolute', left: 0, right: 0, top: 230, display: 'flex', justifyContent: 'center'}}>
        <Icon word={word} scale={scale} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 970}}>
        <WordLabel word={word} active={active} />
      </div>
    </>
  );
};

const QuizCard: React.FC<{word: WordKey; x: number; y: number; active: boolean; reveal: boolean}> = ({word, x, y, active, reveal}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: 305,
      height: 405,
      borderRadius: 34,
      background: active ? '#fff8d2' : 'rgba(255,255,255,0.68)',
      border: active ? '8px solid #ffd64a' : '5px solid rgba(214, 183, 132, 0.7)',
      boxShadow: active ? '0 20px 46px rgba(211, 152, 35, 0.22)' : '0 12px 28px rgba(95, 68, 35, 0.12)',
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
      justifyContent: 'center',
      gap: 8,
    }}
  >
    <Icon word={word} scale={0.48} dim={false} />
    <div style={{fontSize: 32, color: '#7a6655', fontWeight: 900}}>{words[word].zh}</div>
    <div style={{height: 52, fontSize: 38, color: '#47372d', fontWeight: 900}}>{reveal ? words[word].en : ''}</div>
  </div>
);

const QuizScene: React.FC<{currentId?: string}> = ({currentId}) => {
  const answer = answerWord(currentId);
  return (
    <>
      <div style={{position: 'absolute', top: 150, left: 70, right: 70, textAlign: 'center', fontSize: 62, fontWeight: 900, color: '#49372d'}}>
        听音选图
      </div>
      <QuizCard word="apple" x={66} y={520} active={answer === 'apple'} reveal={answer === 'apple'} />
      <QuizCard word="banana" x={388} y={520} active={answer === 'banana'} reveal={answer === 'banana'} />
      <QuizCard word="cat" x={710} y={520} active={answer === 'cat'} reveal={answer === 'cat'} />
    </>
  );
};

const EndingScene: React.FC = () => (
  <>
    <div style={{position: 'absolute', top: 160, left: 70, right: 70, textAlign: 'center', fontSize: 58, fontWeight: 900, color: '#49372d'}}>
      今天认识 3 个英文词
    </div>
    <div style={{position: 'absolute', top: 500, left: 50, right: 50, display: 'flex', justifyContent: 'space-between'}}>
      {(['apple', 'banana', 'cat'] as WordKey[]).map((word) => (
        <div key={word} style={{width: 315, textAlign: 'center'}}>
          <Icon word={word} scale={0.48} />
          <WordLabel word={word} active={false} small />
        </div>
      ))}
    </div>
  </>
);

export const KidsEnglishWords: React.FC = () => {
  const frame = useCurrentFrame();
  const timeline = useTimeline();
  const map = useMemo(() => segMap(timeline), [timeline]);
  const time = frame / FPS;
  const current = currentSegment(timeline, time);
  const scene = sceneForTime(time, map);
  const word = activeWord(current?.id);

  return (
    <AbsoluteFill style={{width: W, height: H}}>
      <Background />
      {scene === 'intro' && <IntroScene time={time} />}
      {(scene === 'apple' || scene === 'banana' || scene === 'cat') && <TeachScene word={scene} map={map} time={time} />}
      {scene === 'quiz' && <QuizScene currentId={current?.id} />}
      {scene === 'ending' && <EndingScene />}
      <Subtitle text={current?.subtitle ?? ''} />
      {word && scene !== 'quiz' && (
        <div
          style={{
            position: 'absolute',
            top: 60,
            right: 56,
            padding: '14px 24px',
            borderRadius: 22,
            background: 'rgba(255,255,255,0.62)',
            color: '#80634e',
            fontSize: 28,
            fontWeight: 900,
          }}
        >
          {words[word].zh}
        </div>
      )}
      {timeline?.segments.filter((segment) => Boolean(segment.file)).map((segment) => (
        <Sequence key={segment.id} from={Math.round(segment.start * FPS)} durationInFrames={Math.ceil(segment.duration * FPS) + 2}>
          <Audio src={staticFile(segment.file)} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export const useKidsEnglishDurationFrames = () => {
  const {fps} = useVideoConfig();
  return Math.round(78 * fps);
};

export const KIDS_ENGLISH_DURATION_FRAMES = 85 * FPS;
