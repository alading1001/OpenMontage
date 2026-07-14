import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

type Segment = {
  start: number;
  end: number;
  text: string;
};

const segments: Segment[] = [
  { start: 0, end: 4.2, text: "经典题：鸡兔同笼" },
  { start: 4.2, end: 10.5, text: "8只动物，26只脚，问鸡和兔各几只？" },
  { start: 10.5, end: 16.5, text: "方法一：先假设8只全都是鸡" },
  { start: 16.5, end: 22.5, text: "全是鸡：8 x 2 = 16只脚" },
  { start: 22.5, end: 28.5, text: "实际有26只脚，多了10只脚" },
  { start: 28.5, end: 35.0, text: "鸡换成兔，每换一只就多2只脚" },
  { start: 35.0, end: 41.5, text: "10 ÷ 2 = 5，所以兔有5只" },
  { start: 41.5, end: 49.0, text: "8 - 5 = 3，鸡有3只；检验正好26只脚" },
  { start: 49.0, end: 54.0, text: "方法二：抬腿法" },
  { start: 54.0, end: 60.0, text: "所有动物都抬起2只脚" },
  { start: 60.0, end: 66.5, text: "鸡抬完没有脚落地，兔还剩2只脚" },
  { start: 66.5, end: 73.5, text: "一共抬起：8 x 2 = 16只脚" },
  { start: 73.5, end: 80.5, text: "地上还剩：26 - 16 = 10只脚" },
  { start: 80.5, end: 87.0, text: "10 ÷ 2 = 5，兔5只，鸡3只" },
  { start: 87.0, end: 101.0, text: "本质：兔比鸡多2只脚" },
];

const animals = Array.from({ length: 8 }, (_, index) => index);

const palette = {
  bg: "#F7F1E5",
  ink: "#243036",
  muted: "#697179",
  blue: "#2F80ED",
  green: "#24A148",
  orange: "#F2994A",
  red: "#D64545",
  card: "#FFFDF7",
};

const sec = (value: number, fps: number) => Math.round(value * fps);

const Animal: React.FC<{
  index: number;
  kind: "chicken" | "rabbit" | "unknown";
  lifted?: boolean;
}> = ({ index, kind, lifted = false }) => {
  const row = Math.floor(index / 4);
  const col = index % 4;
  const x = 102 + col * 218;
  const y = 354 + row * 190;
  const color =
    kind === "rabbit" ? palette.green : kind === "chicken" ? palette.orange : "#AEB7BF";
  const label = kind === "rabbit" ? "兔" : kind === "chicken" ? "鸡" : "?";
  const feet = kind === "rabbit" ? 4 : 2;
  const visibleFeet = lifted ? Math.max(0, feet - 2) : feet;

  return (
    <div style={{ position: "absolute", left: x, top: y, width: 150, height: 142 }}>
      <div
        style={{
          width: 128,
          height: 92,
          borderRadius: 28,
          background: color,
          boxShadow: "0 14px 26px rgba(36,48,54,0.14)",
          display: "grid",
          placeItems: "center",
          color: "white",
          fontSize: 54,
          fontWeight: 800,
          border: "5px solid rgba(255,255,255,0.75)",
        }}
      >
        {label}
      </div>
      <div style={{ display: "flex", gap: 9, marginTop: 12, marginLeft: 12 }}>
        {Array.from({ length: visibleFeet }, (_, foot) => (
          <div
            key={foot}
            style={{
              width: 17,
              height: 34,
              borderRadius: 11,
              background: palette.ink,
              opacity: 0.8,
            }}
          />
        ))}
      </div>
    </div>
  );
};

const Caption: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const current = segments.find((s) => t >= s.start && t < s.end) ?? segments[segments.length - 1];

  return (
    <div
      style={{
        position: "absolute",
        left: 72,
        right: 72,
        bottom: 82,
        minHeight: 122,
        borderRadius: 30,
        background: "rgba(36,48,54,0.88)",
        color: "white",
        fontSize: 42,
        lineHeight: 1.28,
        fontWeight: 700,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "22px 34px",
        boxShadow: "0 18px 38px rgba(36,48,54,0.24)",
      }}
    >
      {current.text}
    </div>
  );
};

const Header: React.FC<{ title: string; subtitle: string }> = ({ title, subtitle }) => (
  <div style={{ position: "absolute", left: 64, right: 64, top: 74 }}>
    <div style={{ fontSize: 64, fontWeight: 900, color: palette.ink }}>{title}</div>
    <div style={{ marginTop: 12, fontSize: 31, color: palette.muted, fontWeight: 600 }}>
      {subtitle}
    </div>
  </div>
);

const Board: React.FC<React.PropsWithChildren<{ y?: number }>> = ({ children, y = 224 }) => (
  <div
    style={{
      position: "absolute",
      left: 56,
      right: 56,
      top: y,
      bottom: 242,
      borderRadius: 44,
      background: palette.card,
      border: "4px solid rgba(36,48,54,0.10)",
      boxShadow: "0 28px 70px rgba(36,48,54,0.12)",
      overflow: "hidden",
    }}
  >
    {children}
  </div>
);

const Pill: React.FC<{ children: React.ReactNode; color?: string; x: number; y: number }> = ({
  children,
  color = palette.blue,
  x,
  y,
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      borderRadius: 999,
      background: color,
      color: "white",
      padding: "16px 26px",
      fontSize: 33,
      fontWeight: 850,
      boxShadow: "0 14px 28px rgba(36,48,54,0.18)",
    }}
  >
    {children}
  </div>
);

const SceneShell: React.FC<React.PropsWithChildren<{ title: string; subtitle: string }>> = ({
  title,
  subtitle,
  children,
}) => (
  <AbsoluteFill style={{ background: palette.bg, fontFamily: '"Microsoft YaHei", "Noto Sans SC", sans-serif' }}>
    <Header title={title} subtitle={subtitle} />
    <Board>{children}</Board>
    <Caption />
  </AbsoluteFill>
);

const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 16, stiffness: 100 } });

  return (
    <SceneShell title="鸡兔同笼" subtitle="同一道题，两种想法">
      <div
        style={{
          position: "absolute",
          left: 78,
          top: 78,
          fontSize: 43,
          fontWeight: 800,
          color: palette.ink,
        }}
      >
        笼子里：
      </div>
      <Pill x={78} y={154} color={palette.blue}>
        共 8 只
      </Pill>
      <Pill x={314} y={154} color={palette.red}>
        共 26 只脚
      </Pill>
      <div style={{ transform: `scale(${0.92 + pop * 0.08})` }}>
        {animals.map((i) => (
          <Animal key={i} index={i} kind="unknown" />
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          left: 86,
          right: 86,
          bottom: 72,
          fontSize: 43,
          color: palette.ink,
          fontWeight: 800,
          textAlign: "center",
        }}
      >
        目标：求鸡几只，兔几只
      </div>
    </SceneShell>
  );
};

const HypothesisScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const reveal = interpolate(t, [1, 3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rabbits = t < 21.5 ? 0 : Math.min(5, Math.floor((t - 21.5) / 1.0) + 1);

  return (
    <SceneShell title="方法一：假设法" subtitle="先把复杂问题变简单">
      <Pill x={74} y={54} color={palette.orange}>
        假设全是鸡
      </Pill>
      {animals.map((i) => (
        <Animal key={i} index={i} kind={i < rabbits ? "rabbit" : "chicken"} />
      ))}
      <div
        style={{
          position: "absolute",
          left: 74,
          right: 74,
          bottom: 120,
          display: "grid",
          gap: 18,
          fontWeight: 850,
          color: palette.ink,
          fontSize: 39,
        }}
      >
        <div style={{ opacity: reveal }}>全是鸡：8 x 2 = 16 只脚</div>
        <div style={{ opacity: t > 9 ? 1 : 0 }}>实际：26 只脚，多出 10 只脚</div>
        <div style={{ opacity: t > 15 ? 1 : 0 }}>一只兔比一只鸡多 2 只脚</div>
        <div style={{ opacity: t > 23 ? 1 : 0, color: palette.red }}>
          10 ÷ 2 = 5 只兔，8 - 5 = 3 只鸡
        </div>
      </div>
    </SceneShell>
  );
};

const LiftLegScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const lifted = t > 6;

  return (
    <SceneShell title="方法二：抬腿法" subtitle="把脚数变成一眼能看懂的图">
      <Pill x={76} y={54} color={palette.blue}>
        每只动物抬起 2 只脚
      </Pill>
      {animals.map((i) => (
        <Animal key={i} index={i} kind={i < 5 ? "rabbit" : "chicken"} lifted={lifted} />
      ))}
      <div
        style={{
          position: "absolute",
          left: 74,
          right: 74,
          bottom: 114,
          display: "grid",
          gap: 18,
          fontWeight: 850,
          color: palette.ink,
          fontSize: 39,
        }}
      >
        <div>原来：26 只脚</div>
        <div style={{ opacity: t > 8 ? 1 : 0 }}>抬起：8 x 2 = 16 只脚</div>
        <div style={{ opacity: t > 14 ? 1 : 0 }}>地上还剩：26 - 16 = 10 只脚</div>
        <div style={{ opacity: t > 20 ? 1 : 0, color: palette.red }}>
          剩下的脚都属于兔：10 ÷ 2 = 5 只兔
        </div>
      </div>
    </SceneShell>
  );
};

const SummaryScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const scale = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  return (
    <SceneShell title="最后记住" subtitle="两种方法，本质相同">
      <div
        style={{
          position: "absolute",
          inset: 70,
          display: "grid",
          gridTemplateRows: "1fr 1fr 1fr",
          gap: 34,
        }}
      >
        <div
          style={{
            borderRadius: 34,
            background: "#EAF3FF",
            padding: 36,
            fontSize: 43,
            fontWeight: 850,
            color: palette.ink,
          }}
        >
          假设法：算“多出来的脚”
        </div>
        <div
          style={{
            borderRadius: 34,
            background: "#E9F7EF",
            padding: 36,
            fontSize: 43,
            fontWeight: 850,
            color: palette.ink,
            opacity: t > 2 ? 1 : 0,
          }}
        >
          抬腿法：算“剩下的脚”
        </div>
        <div
          style={{
            borderRadius: 34,
            background: "#FFF1DC",
            padding: 36,
            fontSize: 46,
            fontWeight: 950,
            color: palette.red,
            textAlign: "center",
            transform: `scale(${0.95 + scale * 0.05})`,
            opacity: t > 4 ? 1 : 0,
          }}
        >
          答案：鸡 3 只，兔 5 只
        </div>
      </div>
    </SceneShell>
  );
};

export const ChickenRabbit: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: palette.bg }}>
      <Audio src={staticFile("chicken-rabbit-local/narration.mp3")} />
      <Sequence from={sec(0, fps)} durationInFrames={sec(10.5, fps)}>
        <IntroScene />
      </Sequence>
      <Sequence from={sec(10.5, fps)} durationInFrames={sec(38.5, fps)}>
        <HypothesisScene />
      </Sequence>
      <Sequence from={sec(49, fps)} durationInFrames={sec(38, fps)}>
        <LiftLegScene />
      </Sequence>
      <Sequence from={sec(87, fps)} durationInFrames={sec(14, fps)}>
        <SummaryScene />
      </Sequence>
    </AbsoluteFill>
  );
};
