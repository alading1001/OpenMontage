import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {parentMathTimeline} from './ParentMathTimeline';

const C={wood:'#d6a36f', cream:'#fff8eb', green:'#85b87a', orange:'#e9853d', ink:'#3f332b', soft:'#f2e5d0', teal:'#79b6a7', red:'#e87462'};
const fps=30;
const find=(id:string)=>parentMathTimeline.segments.find((x)=>x.id===id)!;
const at=(frame:number)=>parentMathTimeline.segments.find((x)=>frame/fps>=x.start&&frame/fps<=x.end+x.after_gap)??parentMathTimeline.segments[parentMathTimeline.segments.length-1];
const captionFor=(id:string,text:string)=>({
  hook:'孩子会数数，不等于会比较多少。',problem:'会数数，不等于会比较多少。',concept:'孩子还在建立“数量比较”。',wrong:'不要只看队伍长短。',method:'摆整齐，再一个一个数。',count_left:'左边：1、2，共2块。',count_right:'右边：1、2、3、4，共4块。',ask:'数完，再问：哪边更多？',repair:'先数两边各有几个。',answer:'右边更多，左边更少。',change:'换个摆法，再数一次。',recount:'排得开或紧，数量不会改变。',equal:'左边3个，右边3个。一样多。',offline:'关掉视频，拿家里的东西玩一次。',practice:'先数，再比较。换一种物品。',conclusion:'在真实生活里发现数量关系。'
} as Record<string,string>)[id]??text;

const Block:React.FC<{x:number;y:number;n:number;color:string;glow?:boolean}>=({x,y,n,color,glow})=><div style={{position:'absolute',left:x,top:y,width:118,height:118,borderRadius:18,background:color,border:`6px solid ${glow?'#ffca4b':'#74472e'}`,boxShadow:glow?'0 0 0 16px rgba(255,203,75,.35)':'0 8px 0 rgba(92,55,33,.18)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:38,fontWeight:800,color:'#fff7e9'}}>{n}</div>;
const Fruit:React.FC<{x:number;y:number;color:string;glow?:boolean}>=({x,y,color,glow})=><div style={{position:'absolute',left:x,top:y,width:108,height:108,borderRadius:'50%',background:color,border:`6px solid ${glow?'#ffca4b':'#80412f'}`,boxShadow:glow?'0 0 0 15px rgba(255,203,75,.35)':'0 7px 0 rgba(92,55,33,.14)'}}><div style={{position:'absolute',top:-19,left:54,width:10,height:30,background:'#65452d',borderRadius:8}}/><div style={{position:'absolute',top:-23,left:66,width:30,height:18,background:'#73ad61',border:'3px solid #48783e',borderRadius:'80% 10%'}}/></div>;
const Hand:React.FC<{side:'left'|'right'}>=({side})=><div style={{position:'absolute',top:1050,left:side==='left'?42:780,width:250,height:370,transform:`rotate(${side==='left'?-16:16}deg)`,opacity:.92}}><div style={{position:'absolute',bottom:0,left:65,width:135,height:250,borderRadius:'75px 75px 42px 42px',background:'#f0bb94',border:'5px solid #a96f54'}}/><div style={{position:'absolute',bottom:190,left:45,width:170,height:150,borderRadius:'90px 90px 35px 35px',background:'#f5c4a0',border:'5px solid #a96f54'}}/><div style={{position:'absolute',bottom:298,left:66,width:30,height:106,borderRadius:20,background:'#f5c4a0',border:'5px solid #a96f54'}}/><div style={{position:'absolute',bottom:310,left:108,width:30,height:118,borderRadius:20,background:'#f5c4a0',border:'5px solid #a96f54'}}/><div style={{position:'absolute',bottom:302,left:150,width:30,height:105,borderRadius:20,background:'#f5c4a0',border:'5px solid #a96f54'}}/></div>;

const Caption:React.FC<{text:string}>=({text})=><div style={{position:'absolute',left:64,right:64,bottom:115,minHeight:145,background:'rgba(255,250,239,.95)',border:`4px solid ${C.orange}`,borderRadius:28,display:'flex',alignItems:'center',justifyContent:'center',padding:'20px 40px',fontSize:43,fontWeight:700,lineHeight:1.35,textAlign:'center',color:C.ink}}>{text}</div>;
const Badge:React.FC<{text:string;left:number;color?:string}>=({text,left,color=C.orange})=><div style={{position:'absolute',left,top:370,background:color,color:'#fffaf0',borderRadius:24,padding:'13px 24px',fontSize:38,fontWeight:800,border:'4px solid #70432e'}}>{text}</div>;

const Blocks:React.FC<{mode:string;frame:number}>=({mode,frame})=>{
 const t=frame/fps, leftCount=find('count_left'), rightCount=find('count_right');
 const lActive=mode==='aligned'&&t>=leftCount.start&&t<=leftCount.end?Math.min(1,Math.floor((t-leftCount.start)/leftCount.duration*2)): -1;
 const rActive=mode==='aligned'&&t>=rightCount.start&&t<=rightCount.end?Math.min(3,Math.floor((t-rightCount.start)/rightCount.duration*4)): -1;
 const spread=mode==='spread_vs_tight'||mode==='rearranged'; const aligned=mode==='aligned'||mode==='labels';
 const left=spread?[[145,700],[375,1120]]:aligned?[[165,905],[315,905]]:[[175,820],[325,1040]];
 const right=spread?[[660,895],[785,895],[910,895],[785,1020]]:mode==='rearranged'?[[650,890],[775,890],[900,890],[775,1015]]:[[635,820],[790,820],[635,1010],[790,1010]];
 return <>{left.map((p,i)=><Block key={'l'+i} x={p[0]} y={p[1]} n={i+1} color="#e99157" glow={lActive===i}/>)}{right.map((p,i)=><Block key={'r'+i} x={p[0]} y={p[1]} n={i+1} color="#78b5a5" glow={rActive===i}/>)}</>;
};

export const ParentMathQuantity:React.FC=()=>{
 const frame=useCurrentFrame(); const s=at(frame); const mode=s.scene; const sec=frame/fps;
 const heading=mode==='hook'?'孩子会数数，为什么还不会比较多少？':mode==='offline'?'把方法带回家练':mode==='equal'?'最后：一样多':mode==='rearranged'?'换个摆法，再数一遍':'数量比较，关键是这样教';
 const fade=interpolate(frame%18,[0,17],[.88,1]);
 return <AbsoluteFill style={{fontFamily:'Microsoft YaHei, sans-serif',background:C.cream,color:C.ink,overflow:'hidden'}}>
   <div style={{position:'absolute',inset:0,background:`linear-gradient(180deg, #fff9eb 0%, #f5e7cf 34%, ${C.wood} 34%, #c9905b 100%)`}}/>
   <div style={{position:'absolute',top:310,left:0,right:0,height:20,background:'#b77e4c',opacity:.45}}/>
   <div style={{position:'absolute',left:50,right:50,top:62,height:178,background:'rgba(255,252,244,.94)',borderRadius:30,border:'4px solid #dbb07c',display:'flex',alignItems:'center',justifyContent:'center',padding:'0 34px',textAlign:'center',fontWeight:900,fontSize:mode==='hook'?58:50,lineHeight:1.22,zIndex:5}}>{heading}</div>
   {mode!=='offline'&&mode!=='equal'&&<><Badge text="左边" left={150} color="#c86f5e"/><Badge text="右边" left={700} color="#4d9d8c"/><Blocks mode={mode} frame={frame}/></>}
   {mode==='spread_vs_tight'&&<div style={{position:'absolute',right:58,top:510,width:240,padding:'16px',background:'#fff6d7',border:'4px solid #d38a3f',borderRadius:22,fontWeight:800,fontSize:30,lineHeight:1.35}}>不要只看队伍长短</div>}
   {mode==='labels'&&<><Badge text="2 块" left={155} color="#c86f5e"/><Badge text="4 块" left={705} color="#4d9d8c"/><div style={{position:'absolute',top:520,left:142,width:300,textAlign:'center',fontSize:50,fontWeight:900,color:'#a44f42'}}>更少</div><div style={{position:'absolute',top:520,left:690,width:300,textAlign:'center',fontSize:50,fontWeight:900,color:'#33796e'}}>更多</div></>}
   {mode==='equal'&&<><Badge text="左边 3 个" left={120} color="#c86f5e"/><Badge text="右边 3 个" left={650} color="#4d9d8c"/>{[[150,815],[300,1010],[450,815]].map((p,i)=><Fruit key={i} x={p[0]} y={p[1]} color="#ee795e" glow={false}/>)}{[[635,820],[790,1015],[925,820]].map((p,i)=><Fruit key={'r'+i} x={p[0]} y={p[1]} color="#f0b84c" glow={false}/>)}<div style={{position:'absolute',top:520,left:280,width:520,textAlign:'center',fontSize:56,fontWeight:900,color:'#4c8c56'}}>两边一样多</div></>}
   {mode==='offline'&&<><Hand side="left"/><Hand side="right"/><div style={{position:'absolute',left:260,top:620,fontSize:42,fontWeight:900,color:'#78462e'}}>关掉视频，拿家里的东西玩一次</div><Blocks mode="aligned" frame={frame}/><div style={{position:'absolute',top:520,left:140,right:140,background:'#e8f2dc',border:'4px solid #6d9d61',borderRadius:26,padding:'16px 25px',fontSize:37,fontWeight:800,textAlign:'center'}}>积木 · 玩具 · 水果，都可以</div></>}
   {s.id==='hook'&&<div style={{position:'absolute',top:510,left:155,right:155,textAlign:'center',fontSize:40,fontWeight:800,color:'#9b5a32'}}>桌面演示：2 块，对比 4 块</div>}
   <Caption text={captionFor(s.id,s.text)}/>
   {parentMathTimeline.segments.map(x=><Sequence key={x.id} from={Math.round(x.start*fps)}><Audio src={staticFile(`parent-math/${x.id}.mp3`)}/></Sequence>)}
 </AbsoluteFill>;
};
