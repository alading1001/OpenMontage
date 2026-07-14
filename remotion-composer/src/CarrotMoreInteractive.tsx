import React from 'react';
import { AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame } from 'remotion';
import { carrotMoreTimeline } from './CarrotMoreTimeline';

const W = 1080;
const fps = 30;
const C = { ink: '#4b3428', cream: '#fff8e8', sky: '#9ddcf4', blue: '#77c6ea', green: '#75b86b', darkGreen: '#4c8b4d', orange: '#ef8b36', carrot: '#ef8738', brown: '#8d5a34', yellow: '#ffd35c', pink: '#f3a6a2', teal: '#6eb4a5' };

type Scene = 'opening' | 'left' | 'right' | 'ask' | 'answer' | 'rearrange' | 'equal' | 'closing';
const sceneAt = (t: number): { scene: Scene; caption: string; start: number } => {
  const found = carrotMoreTimeline.segments.find((s) => t >= s.start && t < s.start + s.duration);
  return found ? { scene: found.scene as Scene, caption: found.caption, start: found.start } : { scene: 'closing', caption: '看一小段，线下玩一次', start: 47 };
};

const Cloud: React.FC<{ x: number; y: number; scale?: number }> = ({ x, y, scale = 1 }) => <div style={{ position: 'absolute', left: x, top: y, transform: `scale(${scale})`, transformOrigin: 'left top', opacity: .9 }}><div style={{ width: 190, height: 55, borderRadius: 50, background: '#fff', position: 'relative' }}><i style={{ position: 'absolute', left: 28, top: -35, width: 82, height: 82, borderRadius: '50%', background: '#fff' }} /><i style={{ position: 'absolute', left: 92, top: -23, width: 70, height: 70, borderRadius: '50%', background: '#fff' }} /></div></div>;
const Balloon: React.FC<{ x: number; y: number; color: string }> = ({ x, y, color }) => <div style={{ position: 'absolute', left: x, top: y, width: 74, height: 96, borderRadius: '50% 50% 48% 48%', background: color, border: '5px solid rgba(110,65,42,.32)', boxShadow: 'inset 12px 12px 0 rgba(255,255,255,.25)' }}><div style={{ position: 'absolute', left: 35, top: 92, width: 3, height: 160, background: '#8d6d59', transform: 'rotate(-5deg)' }} /></div>;
const Fence: React.FC = () => <div style={{ position: 'absolute', left: 0, right: 0, top: 1030, height: 150, background: '#d6a36d', borderTop: '10px solid #9b653d', boxShadow: '0 -8px 0 rgba(95,63,38,.12)' }}>{[40, 210, 380, 550, 720, 890, 1040].map((x) => <div key={x} style={{ position: 'absolute', left: x, top: -32, width: 34, height: 210, background: '#c88954', border: '5px solid #8b5735', borderRadius: '14px 14px 4px 4px' }} />)}</div>;
const Sign: React.FC = () => <div style={{ position: 'absolute', left: 370, top: 300, width: 340, height: 110, background: '#c88750', border: '8px solid #84522f', borderRadius: 20, color: '#fff6df', fontSize: 50, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(-2deg)', boxShadow: '0 8px 0 rgba(80,50,30,.18)' }}>小菜园</div>;
const Garden: React.FC<{ x: number; y: number; width?: number }> = ({ x, y, width = 360 }) => <div style={{ position: 'absolute', left: x, top: y, width, height: 225, borderRadius: '50%', background: '#8c5e3e', border: '8px solid #6f482f', boxShadow: 'inset 0 16px 0 rgba(255,255,255,.14)' }}><div style={{ position: 'absolute', left: 25, right: 25, top: 42, height: 18, borderRadius: 20, background: '#6e9f4d', opacity: .65 }} /><div style={{ position: 'absolute', left: 25, right: 25, top: 112, height: 18, borderRadius: 20, background: '#6e9f4d', opacity: .65 }} /></div>;

const Carrot: React.FC<{ x: number; y: number; active?: boolean; hidden?: boolean; rotate?: number; scale?: number }> = ({ x, y, active = false, hidden = false, rotate = 0, scale = 1 }) => <div style={{ position: 'absolute', left: x, top: y, width: 72, height: 158, transform: `translateY(${hidden ? 58 : 0}px) rotate(${rotate}deg) scale(${scale})`, transformOrigin: 'bottom center', opacity: hidden ? 0 : 1, transition: 'none', filter: active ? 'drop-shadow(0 0 18px #ffe36b)' : 'none', zIndex: 4 }}><div style={{ position: 'absolute', left: 9, top: 26, width: 55, height: 122, background: C.carrot, border: `6px solid ${active ? '#ffd759' : '#a8532e'}`, borderRadius: '48% 48% 65% 65%', boxShadow: 'inset 12px 0 0 rgba(255,255,255,.2)' }} /><div style={{ position: 'absolute', left: 4, top: 0, width: 65, height: 42 }}><i style={{ position: 'absolute', left: 22, top: 0, width: 13, height: 50, borderRadius: 20, background: '#559650', transform: 'rotate(-26deg)' }} /><i style={{ position: 'absolute', left: 37, top: 1, width: 13, height: 50, borderRadius: 20, background: '#6bac58', transform: 'rotate(22deg)' }} /><i style={{ position: 'absolute', left: 13, top: 7, width: 13, height: 43, borderRadius: 20, background: '#77b85e', transform: 'rotate(-47deg)' }} /></div></div>;

const Rabbit: React.FC<{ x: number; y: number; color: string; scale?: number; walk?: number; point?: 'left' | 'right' | null; happy?: boolean }> = ({ x, y, color, scale = 1, walk = 0, point = null, happy = false }) => <div style={{ position: 'absolute', left: x + walk, top: y + (happy ? Math.sin(walk / 8) * -8 : 0), width: 180 * scale, height: 300 * scale, transform: `scale(${scale})`, transformOrigin: 'left top', zIndex: 9 }}>
  <div style={{ position: 'absolute', left: 52, top: 118, width: 84, height: 125, borderRadius: '48% 48% 38% 38%', background: color, border: '6px solid #84533e', boxShadow: '0 8px 0 rgba(92,56,37,.16)' }} />
  <div style={{ position: 'absolute', left: 26, top: 44, width: 136, height: 120, borderRadius: '50%', background: color, border: '6px solid #84533e' }} />
  <div style={{ position: 'absolute', left: 45, top: -34, width: 45, height: 115, borderRadius: '70% 70% 20% 20%', background: color, border: '6px solid #84533e', transform: 'rotate(-12deg)' }} /><div style={{ position: 'absolute', left: 98, top: -35, width: 45, height: 115, borderRadius: '70% 70% 20% 20%', background: color, border: '6px solid #84533e', transform: 'rotate(12deg)' }} />
  <div style={{ position: 'absolute', left: 57, top: 91, width: 15, height: 20, borderRadius: '50%', background: '#49322b' }} /><div style={{ position: 'absolute', left: 111, top: 91, width: 15, height: 20, borderRadius: '50%', background: '#49322b' }} /><div style={{ position: 'absolute', left: 87, top: 111, width: 12, height: 9, borderRadius: '50%', background: '#d97878' }} />
  <div style={{ position: 'absolute', left: point === 'left' ? 4 : 137, top: 150, width: 75, height: 24, borderRadius: 24, background: color, border: '6px solid #84533e', transform: `rotate(${point === 'left' ? 18 : -18}deg)`, transformOrigin: point === 'left' ? 'right center' : 'left center' }} />
  <div style={{ position: 'absolute', left: 56, top: 233, width: 28, height: 57, borderRadius: 18, background: color, border: '6px solid #84533e', transform: 'rotate(8deg)' }} /><div style={{ position: 'absolute', left: 104, top: 233, width: 28, height: 57, borderRadius: 18, background: color, border: '6px solid #84533e', transform: 'rotate(-8deg)' }} />
  {happy && <div style={{ position: 'absolute', left: 66, top: 137, fontSize: 38, color: '#d77b50', fontWeight: 900 }}>⌣</div>}
</div>;

const Sticker: React.FC<{ text: string; x: number; y: number; color: string }> = ({ text, x, y, color }) => <div style={{ position: 'absolute', left: x, top: y, background: color, color: '#fffaf0', border: '5px solid #74452e', borderRadius: 26, padding: '12px 22px', fontWeight: 900, fontSize: 34, transform: 'rotate(-2deg)', zIndex: 20, boxShadow: '0 6px 0 rgba(89,53,34,.15)' }}>{text}</div>;
const Caption: React.FC<{ text: string }> = ({ text }) => <div style={{ position: 'absolute', left: 60, right: 60, bottom: 72, minHeight: 120, borderRadius: 30, padding: '18px 30px', background: 'rgba(255,249,232,.96)', border: `6px solid ${C.orange}`, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: C.ink, fontSize: 44, lineHeight: 1.22, fontWeight: 900, zIndex: 30 }}><span>{text}</span></div>;

export const CarrotMoreInteractive: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / fps;
  const { scene, caption, start } = sceneAt(t);
  const local = Math.max(0, t - start);
  const pop = spring({ frame: Math.max(0, frame - Math.round(start * fps)), fps, config: { damping: 12, stiffness: 160 } });
  const carrots = (side: 'left' | 'right', count: number, layout: 'rows' | 'spread' | 'equal' = 'rows') => {
    const left = side === 'left';
    const base = left ? 154 : 656;
    const positions = layout === 'spread' && left ? [[50, 790], [280, 790]] : layout === 'spread' ? [[0, 820], [82, 820], [164, 820], [246, 820]] : layout === 'equal' ? [[0, 820], [120, 790], [240, 820]] : count === 2 ? [[80, 790], [220, 790]] : [[0, 790], [92, 790], [184, 790], [276, 790]];
    return positions.slice(0, count).map(([dx, y], i) => {
      const reveal = scene === 'left' && left ? Math.max(0, Math.min(1, (local - 1.1 - i * .85) / .35)) : scene === 'right' && !left ? Math.max(0, Math.min(1, (local - 1.0 - i * .72) / .35)) : scene === 'rearrange' ? Math.max(0, Math.min(1, (local - 1.0 - i * .28) / .5)) : 1;
      const active = (scene === 'left' && left && local > 1.1 + i * .85 && local < 2.5 + i * .85) || (scene === 'right' && !left && local > 1 + i * .72 && local < 2.6 + i * .72);
      return <Carrot key={`${side}-${i}`} x={base + dx} y={y} hidden={reveal < .1} active={active} rotate={left ? -5 + i * 5 : 5 - i * 3} />;
    });
  };
  const openingWalk = scene === 'opening' ? Math.min(170, local * 42) : 0;
  const gardenLayout = scene === 'rearrange' ? 'spread' : scene === 'equal' ? 'equal' : 'rows';
  return <AbsoluteFill style={{ background: C.sky, fontFamily: 'Microsoft YaHei, PingFang SC, sans-serif', color: C.ink, overflow: 'hidden' }}>
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(#91d5f0 0%, #b8e6f4 47%, #82bf69 48%, #5fa454 100%)' }} />
    <Cloud x={46} y={130} scale={.88} /><Cloud x={760} y={175} scale={.72} /><Balloon x={78} y={350} color={C.pink} /><Balloon x={920} y={310} color={C.yellow} />
    <Sign /><Garden x={90} y={575} /><Garden x={630} y={575} /><Fence />
    {[['🥕', 54, 530], ['🌼', 910, 580], ['🌿', 35, 860], ['🌱', 930, 820]].map(([emoji, x, y]) => <div key={`${x}`} style={{ position: 'absolute', left: x as number, top: y as number, fontSize: 74, zIndex: 5 }}>{emoji}</div>)}
    <div style={{ position: 'absolute', left: 56, right: 56, top: 35, minHeight: 145, borderRadius: 34, background: 'rgba(255,249,232,.97)', border: '7px solid #d98b3b', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontSize: scene === 'opening' ? 50 : 46, lineHeight: 1.16, fontWeight: 900, color: '#d66f2d', zIndex: 40, padding: '10px 24px' }}>{scene === 'opening' ? '孩子会数数，还不会比多少？' : scene === 'rearrange' ? '换一种摆法，再看一次' : scene === 'equal' ? '两边一样多' : scene === 'closing' ? '家里也能这样玩' : '先数清楚，再比较'}</div>

    {scene === 'opening' && <><div style={{ position: 'absolute', left: 450, top: 470, width: 180, height: 70, border: '12px solid #8b5b36', borderBottom: 0, borderRadius: '100px 100px 0 0', zIndex: 8 }} /><Sticker text="故事开始" x={735} y={490} color={C.teal} />{carrots('left', 2)}{carrots('right', 4)}</>}
    {scene !== 'opening' && scene !== 'closing' && <>{carrots('left', scene === 'equal' ? 3 : 2, gardenLayout as any)}{carrots('right', scene === 'equal' ? 3 : 4, gardenLayout as any)}</>}
    {scene === 'answer' && <><div style={{ position: 'absolute', left: 360, top: 800, width: 360, height: 6, background: '#ffcc54', zIndex: 12 }} /><Sticker text="右边更多" x={680} y={580} color={C.teal} /><Sticker text="左边更少" x={110} y={580} color="#df7a69" /></>}
    {scene === 'ask' && <div style={{ position: 'absolute', left: 442, top: 650, width: 180, height: 150, borderRadius: '50%', background: '#fff5c9', border: '8px solid #a96b37', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 100, fontWeight: 900, zIndex: 25, transform: `scale(${.9 + pop * .12})` }}>?</div>}
    {scene === 'closing' && <><div style={{ position: 'absolute', left: 110, top: 600, fontSize: 100 }}>🥕</div><div style={{ position: 'absolute', left: 310, top: 620, fontSize: 95 }}>🧱</div><div style={{ position: 'absolute', left: 510, top: 615, fontSize: 95 }}>🧸</div><div style={{ position: 'absolute', left: 720, top: 610, fontSize: 95 }}>🍎</div><div style={{ position: 'absolute', left: 120, top: 760, width: 840, padding: '22px 28px', borderRadius: 28, background: '#e5f2d8', border: '6px solid #6ca15a', textAlign: 'center', fontSize: 42, fontWeight: 900 }}>胡萝卜、积木、玩具和水果都可以</div></>}
    <Rabbit x={140} y={900} color="#fff4df" walk={openingWalk} point={scene === 'answer' || scene === 'ask' ? 'left' : null} happy={scene === 'equal' || scene === 'answer'} /><Rabbit x={445} y={875} color="#f3c1a7" walk={openingWalk * .72} point={scene === 'answer' || scene === 'ask' ? 'right' : null} happy={scene === 'equal' || scene === 'answer'} /><Rabbit x={760} y={900} color="#d9eef3" walk={openingWalk * .52} point={scene === 'answer' ? 'right' : null} happy={scene === 'equal' || scene === 'answer'} />
    <Caption text={caption} />
    {carrotMoreTimeline.segments.filter((s) => s.id !== 'wait').map((s) => <Sequence key={s.id} from={Math.round(s.start * fps)}><Audio src={staticFile(`carrot-more-lesson/${s.id}.mp3`)} volume={1} /></Sequence>)}
  </AbsoluteFill>;
};
