import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {miceFruitMoreLessTimeline} from './MiceFruitMoreLessTimeline';

type Point = {x: number; y: number};
type SegmentId = (typeof miceFruitMoreLessTimeline.segments)[number]['id'];

const W = 1080;
const H = 1920;
const appleLeft: Point[] = [{x: 285, y: 1010}, {x: 285, y: 1190}];
const appleRight: Point[] = [{x: 760, y: 940}, {x: 760, y: 1080}, {x: 760, y: 1220}, {x: 760, y: 1360}];
const pairingLeft: Point[] = [{x: 410, y: 900}, {x: 410, y: 1120}];
const pairingRight: Point[] = [{x: 665, y: 900}, {x: 665, y: 1120}, {x: 845, y: 1010}, {x: 845, y: 1280}];
const spreadLeft: Point[] = [{x: 190, y: 950}, {x: 500, y: 1270}];
const compactRight: Point[] = [{x: 755, y: 1040}, {x: 845, y: 1040}, {x: 790, y: 1140}, {x: 880, y: 1140}];
const bananaLeft: Point[] = [{x: 300, y: 940}, {x: 300, y: 1120}, {x: 300, y: 1300}];
const bananaRight: Point[] = [{x: 760, y: 940}, {x: 690, y: 1150}, {x: 830, y: 1150}];

const clamp = (n: number) => Math.max(0, Math.min(1, n));
const smooth = (n: number) => {
  const t = clamp(n);
  return t * t * (3 - 2 * t);
};
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const pointMix = (a: Point, b: Point, t: number): Point => ({x: mix(a.x, b.x, t), y: mix(a.y, b.y, t)});

const byId = (id: SegmentId) => miceFruitMoreLessTimeline.segments.find((segment) => segment.id === id)!;
const progress = (id: SegmentId, time: number, activeSeconds = 1.25) => {
  const segment = byId(id);
  return smooth((time - segment.start) / Math.min(activeSeconds, segment.duration));
};
const completed = (id: SegmentId, time: number) => time >= byId(id).end;
const active = (id: SegmentId, time: number) => time >= byId(id).start && time <= byId(id).end;
const current = (time: number) => {
  let result = miceFruitMoreLessTimeline.segments[0];
  for (const segment of miceFruitMoreLessTimeline.segments) if (time >= segment.start) result = segment;
  return result;
};

const Apple: React.FC<{point: Point; opacity?: number; glow?: boolean; scale?: number; z?: number}> = ({point, opacity = 1, glow = false, scale = 1, z = 40}) => (
  <div style={{position: 'absolute', left: point.x - 58, top: point.y - 58, width: 116, height: 116, opacity, transform: `scale(${scale})`, zIndex: z}}>
    {glow && <div style={{position: 'absolute', inset: -18, borderRadius: 80, background: 'rgba(255,214,82,.42)', boxShadow: '0 0 25px 12px rgba(255,214,82,.35)'}} />}
    <div style={{position: 'absolute', left: 20, top: 22, width: 72, height: 75, borderRadius: '48% 48% 52% 52%', background: '#ee5c4e', border: '5px solid #9c3c36', boxShadow: 'inset 12px 10px 0 rgba(255,255,255,.26), 0 8px 0 rgba(107,57,41,.15)'}} />
    <div style={{position: 'absolute', left: 55, top: 2, width: 8, height: 29, background: '#754632', borderRadius: 9, transform: 'rotate(15deg)'}} />
    <div style={{position: 'absolute', left: 65, top: 8, width: 30, height: 17, borderRadius: '100% 0 100% 0', background: '#58a85a', transform: 'rotate(-16deg)', border: '3px solid #347642'}} />
  </div>
);

const Banana: React.FC<{point: Point; opacity?: number; glow?: boolean; scale?: number}> = ({point, opacity = 1, glow = false, scale = 1}) => (
  <div style={{position: 'absolute', left: point.x - 73, top: point.y - 44, width: 146, height: 88, opacity, transform: `scale(${scale})`, zIndex: 42}}>
    {glow && <div style={{position: 'absolute', inset: -18, borderRadius: 70, background: 'rgba(255,224,96,.4)', boxShadow: '0 0 23px 11px rgba(255,224,96,.35)'}} />}
    <div style={{position: 'absolute', left: 11, top: 14, width: 112, height: 50, borderBottom: '24px solid #ffd75d', borderRadius: '0 0 70px 70px', transform: 'rotate(-12deg)', filter: 'drop-shadow(0 5px 0 #b78b36)'}} />
    <div style={{position: 'absolute', left: 14, top: 11, width: 13, height: 18, borderRadius: 8, background: '#825235', transform: 'rotate(-12deg)'}} />
    <div style={{position: 'absolute', left: 116, top: 45, width: 13, height: 18, borderRadius: 8, background: '#825235', transform: 'rotate(-12deg)'}} />
  </div>
);

const Basket: React.FC<{x: number; y: number; label: string; count: number; visible?: boolean}> = ({x, y, label, count, visible = true}) => (
  <div style={{position: 'absolute', left: x, top: y, width: 210, height: 165, opacity: visible ? 1 : 0, zIndex: 20}}>
    <div style={{position: 'absolute', left: 42, top: 0, width: 126, height: 85, border: '15px solid #a76631', borderBottom: 'none', borderRadius: '90px 90px 0 0'}} />
    <div style={{position: 'absolute', left: 0, top: 65, width: 210, height: 92, borderRadius: '16px 16px 70px 70px', background: 'repeating-linear-gradient(0deg,#d59655 0 13px,#b9733a 13px 20px)', border: '5px solid #8d552f', boxShadow: '0 12px 0 rgba(105,65,35,.16)'}} />
    <div style={{position: 'absolute', left: 37, top: 90, width: 136, textAlign: 'center', fontFamily: 'Microsoft YaHei, sans-serif', color: '#fff7e6', fontWeight: 800, fontSize: 27, textShadow: '0 2px 0 #74431f'}}>{label} {count} 个</div>
  </div>
);

const Mouse: React.FC<{point: Point; mood: 'happy' | 'think' | 'point'; shade: string; flip?: boolean; scale?: number}> = ({point, mood, shade, flip = false, scale = 1}) => {
  const frame = useCurrentFrame();
  const bob = Math.sin(frame / 11 + point.x) * 4;
  const eye = mood === 'think' ? '•  •' : '●  ●';
  return <div style={{position: 'absolute', left: point.x - 68, top: point.y - 94 + bob, width: 136, height: 172, transform: `scale(${flip ? -scale : scale}, ${scale})`, zIndex: 65}}>
    <div style={{position: 'absolute', left: 16, top: 5, width: 38, height: 48, borderRadius: '50% 50% 28% 28%', background: shade, border: '5px solid #776050', transform: 'rotate(-17deg)'}}><div style={{position:'absolute', inset:10, borderRadius:30, background:'#f4b6b3'}}/></div>
    <div style={{position: 'absolute', right: 16, top: 5, width: 38, height: 48, borderRadius: '50% 50% 28% 28%', background: shade, border: '5px solid #776050', transform: 'rotate(17deg)'}}><div style={{position:'absolute', inset:10, borderRadius:30, background:'#f4b6b3'}}/></div>
    <div style={{position: 'absolute', left: 13, top: 32, width: 110, height: 86, borderRadius: '52% 52% 48% 48%', background: shade, border: '5px solid #776050', boxShadow: 'inset 12px 9px 0 rgba(255,255,255,.22)'}} />
    <div style={{position: 'absolute', left: 28, top: 62, width: 80, fontSize: 23, letterSpacing: 8, color: '#443530', fontWeight: 900}}>{eye}</div>
    <div style={{position: 'absolute', left: 60, top: 78, width: 17, height: 13, borderRadius: '50% 50% 58% 58%', background: '#d88586'}} />
    <div style={{position: 'absolute', left: 35, top: 96, width: 65, height: 16, borderBottom: mood === 'think' ? '0' : '4px solid #5c453d', borderRadius: 35}} />
    <div style={{position: 'absolute', left: 27, top: 112, width: 84, height: 65, borderRadius: '48% 48% 18% 18%', background: '#83a9d3', border: '5px solid #596f94'}} />
    {mood === 'point' && <div style={{position: 'absolute', right: -39, top: 119, width: 65, height: 13, borderRadius: 16, background: shade, border: '4px solid #776050', transform: 'rotate(-20deg)'}} />}
    {mood === 'think' && <div style={{position: 'absolute', left: 105, top: -15, fontSize: 42, color: '#79584a', fontWeight: 900}}>?</div>}
    <div style={{position: 'absolute', left: -49, top: 127, width: 65, height: 35, borderLeft: '8px solid #a47f71', borderBottom: '8px solid #a47f71', borderRadius: '0 0 0 45px', transform: 'rotate(-12deg)'}} />
  </div>;
};

const Caption: React.FC<{text: string}> = ({text}) => <div style={{position: 'absolute', left: 92, right: 92, bottom: 126, textAlign: 'center', zIndex: 150}}><span style={{display: 'inline-block', maxWidth: 840, padding: '18px 32px', borderRadius: 28, background: 'rgba(74,53,39,.91)', border: '3px solid rgba(255,244,206,.5)', color: '#fff8e8', fontSize: 39, fontWeight: 900, fontFamily: 'Microsoft YaHei, sans-serif', boxShadow: '0 8px 0 rgba(70,42,28,.18)'}}>{text}</span></div>;

const PairLine: React.FC<{a: Point; b: Point; show: boolean}> = ({a, b, show}) => show ? <svg style={{position:'absolute', inset:0, zIndex:33, pointerEvents:'none'}} width={W} height={H}><path d={`M ${a.x + 62} ${a.y} C ${a.x + 122} ${a.y}, ${b.x - 122} ${b.y}, ${b.x - 62} ${b.y}`} stroke="#d48754" strokeWidth="7" fill="none" strokeLinecap="round" strokeDasharray="16 15" /></svg> : null;

export const MiceFruitMoreLess: React.FC = () => {
  const frame = useCurrentFrame();
  const time = frame / 30;
  const segment = current(time);
  const isBanana = time >= byId('banana_intro').start;
  const isFamily = time >= byId('offline_props').start;
  const afterCount = time >= byId('compare').start;
  const rearrangeT = progress('rearrange', time, 2.5);
  const recountT = progress('misjudge', time, 2.0);
  const pan = interpolate(time, [0, 20, 38, 62, 87], [1, 1.018, 1.04, 1.025, 1.01], {extrapolateRight:'clamp'});

  const applePoints = [0, 1, 2, 3, 4, 5].map((index) => {
    const initial: Point = index < 2 ? {x: 185 + index * 52, y: 750 + index * 8} : {x: 815 + (index - 2) * 38, y: 750 + (index - 2) * 14};
    const moveId = (['left_one','left_two','right_one','right_two','right_three','right_four'] as SegmentId[])[index];
    const target = index < 2 ? appleLeft[index] : appleRight[index - 2];
    let point = pointMix(initial, target, progress(moveId, time));
    if (afterCount) point = index < 2 ? pairingLeft[index] : pairingRight[index - 2];
    if (time >= byId('rearrange').start) point = pointMix(index < 2 ? pairingLeft[index] : pairingRight[index - 2], index < 2 ? spreadLeft[index] : compactRight[index - 2], rearrangeT);
    if (time >= byId('misjudge').start) point = pointMix(index < 2 ? spreadLeft[index] : compactRight[index - 2], index < 2 ? pairingLeft[index] : pairingRight[index - 2], recountT);
    return point;
  });

  const bananaOpacity = isBanana ? clamp((time - byId('banana_intro').start) / 0.75) : 0;
  const appleOpacity = isBanana ? clamp(1 - (time - byId('banana_intro').start) / 0.8) : 1;
  const countHighlight = active('left_one',time) ? 0 : active('left_two',time) ? 1 : active('right_one',time) ? 2 : active('right_two',time) ? 3 : active('right_three',time) ? 4 : active('right_four',time) ? 5 : -1;
  const recountHighlight = active('recount_left',time) ? (Math.floor((time - byId('recount_left').start) * 1.5) % 2) : active('recount_right',time) ? 2 + Math.min(3, Math.floor((time - byId('recount_right').start) * 0.85)) : -1;

  return <AbsoluteFill style={{background:'#f8e8c5', overflow:'hidden', fontFamily:'Microsoft YaHei, sans-serif'}}>
    {miceFruitMoreLessTimeline.segments.map((item) => <Sequence key={item.id} from={Math.round(item.start * 30)}><Audio src={staticFile(`mice-fruit-more-less/${item.file}`)} /></Sequence>)}
    <div style={{position:'absolute', inset:-30, transform:`scale(${pan})`, transformOrigin:'50% 55%'}}>
      <div style={{position:'absolute', inset:0, background:'linear-gradient(180deg,#b9e3ed 0 27%,#f7edcf 27% 52%,#d1a16e 52% 100%)'}} />
      <div style={{position:'absolute', left:83, top:115, width:300, height:255, borderRadius:24, background:'#9ed9e4', border:'14px solid #f5f1de', boxShadow:'0 9px 0 rgba(87,116,119,.18)'}}><div style={{position:'absolute', left:'48%', top:0, bottom:0, borderLeft:'8px solid #f5f1de'}}/><div style={{position:'absolute', top:'48%', left:0, right:0, borderTop:'8px solid #f5f1de'}}><div style={{position:'absolute', left:42, top:25, fontSize:60}}>☁</div></div></div>
      <div style={{position:'absolute', right:105, top:110, width:125, height:210, borderRadius:'65px 65px 15px 15px', background:'#f6f2df', border:'6px solid #d5b98b'}}><div style={{position:'absolute', left:35, top:-68, width:56, height:100, borderRadius:'55% 45% 55% 45%', background:'#61ad6b', transform:'rotate(16deg)'}}/><div style={{position:'absolute', left:9, top:-36, width:72, height:95, borderRadius:'55% 45% 55% 45%', background:'#75bf73', transform:'rotate(-20deg)'}}/></div>
      <div style={{position:'absolute', left:0, right:0, top:600, height:930, borderRadius:'50% 50% 0 0 / 4% 4% 0 0', background:'repeating-linear-gradient(0deg,#e9c89a 0 38px,#d8ad79 38px 46px)', borderTop:'12px solid #a66f43', boxShadow:'0 -10px 0 rgba(120,75,41,.08)'}} />
      <div style={{position:'absolute', left:0, right:0, top:645, height:845, background:'linear-gradient(90deg,rgba(255,255,255,.16) 1px,transparent 1px)', backgroundSize:'88px 88px', opacity:.42}} />
      {!isBanana && <><Basket x={75} y={685} label="左边" count={2} visible={time < byId('compare').start} /><Basket x={795} y={685} label="右边" count={4} visible={time < byId('compare').start} /></>}
      {applePoints.map((point,index) => <Apple key={index} point={point} opacity={appleOpacity} glow={countHighlight===index || recountHighlight===index || (index>=4 && active('extra',time))} scale={index>=4 && active('extra',time) ? 1.13 : 1} />)}
      <PairLine a={applePoints[0]} b={applePoints[2]} show={afterCount && !isBanana && (time < byId('rearrange').start || time >= byId('misjudge').start)} />
      <PairLine a={applePoints[1]} b={applePoints[3]} show={afterCount && !isBanana && (time < byId('rearrange').start || time >= byId('misjudge').start)} />
      {isBanana && bananaLeft.map((point,index) => <Banana key={`l${index}`} point={point} opacity={bananaOpacity} glow={active('banana_equal',time)} />)}
      {isBanana && bananaRight.map((point,index) => <Banana key={`r${index}`} point={point} opacity={bananaOpacity} glow={active('banana_equal',time)} />)}
      {isBanana && bananaLeft.map((point,index) => <PairLine key={`p${index}`} a={point} b={bananaRight[index]} show={time >= byId('banana_equal').start && !isFamily} />)}
      <Mouse point={{x:190,y:540}} mood={time >= byId('rearrange').start && time < byId('misjudge').end ? 'think' : 'happy'} shade="#c8b2a2" scale={1.02} />
      <Mouse point={{x:520,y:520}} mood={time >= byId('compare').start ? 'point' : 'happy'} shade="#bda08f" />
      <Mouse point={{x:880,y:540}} mood="happy" shade="#d2b5a6" flip />
      {isFamily && <><div style={{position:'absolute', right:42, top:420, width:145, height:250, zIndex:70}}><div style={{position:'absolute', left:35, top:0, width:80, height:85, borderRadius:'50%', background:'#f2bf91', border:'5px solid #945e45'}}/><div style={{position:'absolute', left:10, top:85, width:130, height:145, borderRadius:'48% 48% 15% 15%', background:'#5a88a7', border:'5px solid #3d647d'}}/><div style={{position:'absolute', left:-36, top:120, width:70, height:16, borderRadius:12, background:'#f2bf91', transform:'rotate(24deg)'}}/></div><div style={{position:'absolute', left:110, top:1400, width:112, height:98, borderRadius:12, background:'#e77355', border:'5px solid #984634', zIndex:43}}><div style={{position:'absolute', left:28, top:23, width:52, height:50, borderRadius:7, background:'#f6cb52'}}/></div><div style={{position:'absolute', left:245, top:1400, width:112, height:98, borderRadius:12, background:'#6da0cb', border:'5px solid #3e6797', zIndex:43}}><div style={{position:'absolute', left:28, top:23, width:52, height:50, borderRadius:7, background:'#a9d96f'}}/></div></>}
      {active('extra',time) && <div style={{position:'absolute', right:85, top:1450, color:'#b95142', fontWeight:900, fontSize:42, zIndex:100}}>多出来的 2 个</div>}
      {active('extra',time) || active('still_more',time) ? <div style={{position:'absolute', left:105, top:705, color:'#8a5435', fontWeight:900, fontSize:38, zIndex:100}}>右边更多</div> : null}
      {active('banana_equal',time) && <div style={{position:'absolute', left:300, top:720, padding:'15px 28px', borderRadius:22, background:'#ecf3d7', color:'#4f7b45', fontSize:42, fontWeight:900, border:'4px solid #89b66d', zIndex:100}}>两边一样多</div>}
    </div>
    <Caption text={segment.subtitle} />
  </AbsoluteFill>;
};
