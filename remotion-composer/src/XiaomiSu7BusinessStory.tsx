import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const fps = 30;
const W = 1080;
const H = 1920;

const scenes = [
  { id: "hook", start: 0, end: 9 },
  { id: "migration", start: 9, end: 20 },
  { id: "trust", start: 20, end: 33 },
  { id: "ecosystem", start: 33, end: 45 },
  { id: "launch", start: 45, end: 58 },
  { id: "proof", start: 58, end: 76 },
  { id: "timeline", start: 76, end: 87 },
  { id: "landing", start: 87, end: 96 },
];

const captions = [
  { s: 0.2, e: 3.0, t: "一个手机公司" },
  { s: 3.0, e: 6.2, t: "第一次造车" },
  { s: 6.2, e: 9.0, t: "为何让车企紧张？" },
  { s: 9.3, e: 13.5, t: "表面是在造车" },
  { s: 13.5, e: 18.8, t: "本质是能力迁移" },
  { s: 20.0, e: 24.5, t: "新品牌先解释自己" },
  { s: 24.5, e: 30.5, t: "小米先有信任" },
  { s: 33.3, e: 38.2, t: "车不是孤立产品" },
  { s: 38.2, e: 44.0, t: "它进入同一生态" },
  { s: 45.4, e: 50.8, t: "像卖手机一样发布" },
  { s: 50.8, e: 57.0, t: "价格、参数、社群同场" },
  { s: 58.2, e: 64.0, t: "热度要变成交付" },
  { s: 64.0, e: 72.5, t: "也要变成收入" },
  { s: 76.5, e: 82.8, t: "三年完成入局到放量" },
  { s: 87.5, e: 95.0, t: "跨界不是从零开始" },
];

const factSources = [
  "Sources: Xiaomi disclosures; Business Insider / Reuters; WSJ",
  "Pre-orders are not deliveries. Revenue/margin refers to smart EV and other innovation business.",
];

const palette = {
  bg: "#080B10",
  panel: "#111827",
  panel2: "#172033",
  text: "#F8FAFC",
  muted: "#9CA3AF",
  cyan: "#22D3EE",
  green: "#34D399",
  amber: "#FBBF24",
  red: "#FB7185",
  blue: "#60A5FA",
  line: "rgba(148, 163, 184, 0.28)",
};

const inScene = (frame: number, start: number, end: number) => {
  const t = frame / fps;
  if (t < start || t >= end) return 0;
  return interpolate(t, [start, start + 0.6, end - 0.5, end], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

const localProgress = (frame: number, start: number, end: number) =>
  interpolate(frame / fps, [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const ease = (v: number) => Easing.out(Easing.cubic)(v);

const Pill: React.FC<{ children: React.ReactNode; color?: string }> = ({
  children,
  color = palette.cyan,
}) => (
  <div
    style={{
      border: `2px solid ${color}`,
      color,
      borderRadius: 999,
      padding: "10px 18px",
      fontSize: 26,
      fontWeight: 700,
      background: "rgba(8, 11, 16, 0.78)",
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </div>
);

const PhoneIcon: React.FC<{ x: number; y: number; label: string; color?: string }> = ({
  x,
  y,
  label,
  color = palette.cyan,
}) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-42} y={-70} width={84} height={140} rx={18} fill="none" stroke={color} strokeWidth={6} />
    <circle cx={0} cy={50} r={5} fill={color} />
    <text y={115} textAnchor="middle" fill={palette.text} fontSize={24} fontWeight={700}>
      {label}
    </text>
  </g>
);

const HomeIcon: React.FC<{ x: number; y: number; label: string; color?: string }> = ({
  x,
  y,
  label,
  color = palette.green,
}) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M -62 6 L 0 -52 L 62 6" fill="none" stroke={color} strokeWidth={7} strokeLinecap="round" />
    <rect x={-46} y={6} width={92} height={72} rx={10} fill="none" stroke={color} strokeWidth={6} />
    <text y={122} textAnchor="middle" fill={palette.text} fontSize={24} fontWeight={700}>
      {label}
    </text>
  </g>
);

const CarOutline: React.FC<{ x?: number; y?: number; scale?: number; color?: string }> = ({
  x = 0,
  y = 0,
  scale = 1,
  color = palette.cyan,
}) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <path
      d="M80 92 C140 20 210 0 340 0 L535 0 C650 3 725 42 798 100 L900 122 C940 130 962 160 962 202 L962 230 L42 230 L42 190 C42 146 54 112 80 92 Z"
      fill="rgba(34, 211, 238, 0.05)"
      stroke={color}
      strokeWidth={8}
      strokeLinejoin="round"
    />
    <path d="M238 20 L198 92 L630 92 L552 20 Z" fill="none" stroke={color} strokeWidth={6} />
    <circle cx={250} cy={232} r={54} fill={palette.bg} stroke={color} strokeWidth={8} />
    <circle cx={750} cy={232} r={54} fill={palette.bg} stroke={color} strokeWidth={8} />
    <path d="M95 142 L170 142" stroke={color} strokeWidth={7} strokeLinecap="round" />
    <path d="M810 142 L900 142" stroke={color} strokeWidth={7} strokeLinecap="round" />
  </g>
);

const BigTitle: React.FC<{ kicker?: string; title: string; sub?: string }> = ({ kicker, title, sub }) => (
  <div style={{ position: "absolute", left: 76, right: 76, top: 118 }}>
    {kicker ? (
      <div style={{ color: palette.cyan, fontSize: 28, fontWeight: 800, marginBottom: 20 }}>
        {kicker}
      </div>
    ) : null}
    <div style={{ color: palette.text, fontSize: 66, lineHeight: 1.12, fontWeight: 900 }}>
      {title}
    </div>
    {sub ? (
      <div style={{ color: palette.muted, fontSize: 31, lineHeight: 1.35, marginTop: 22, fontWeight: 650 }}>
        {sub}
      </div>
    ) : null}
  </div>
);

const StatCard: React.FC<{ label: string; value: string; note?: string; color?: string }> = ({
  label,
  value,
  note,
  color = palette.cyan,
}) => (
  <div
    style={{
      background: `linear-gradient(145deg, rgba(17,24,39,0.94), rgba(23,32,51,0.88))`,
      border: `2px solid ${color}`,
      borderRadius: 22,
      padding: 28,
      boxShadow: `0 0 42px ${color}22`,
    }}
  >
    <div style={{ color: palette.muted, fontSize: 25, fontWeight: 750 }}>{label}</div>
    <div style={{ color, fontSize: 60, lineHeight: 1.05, fontWeight: 950, marginTop: 10 }}>{value}</div>
    {note ? <div style={{ color: palette.muted, fontSize: 23, lineHeight: 1.3, marginTop: 12 }}>{note}</div> : null}
  </div>
);

const HookScene: React.FC<{ frame: number }> = ({ frame }) => {
  const p = ease(localProgress(frame, 0, 9));
  return (
    <AbsoluteFill style={{ opacity: inScene(frame, 0, 9) }}>
      <BigTitle title="一个手机公司，第一次造车，为什么能让传统车企紧张？" />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <g opacity={0.9} transform={`translate(${interpolate(p, [0, 1], [-80, 0])} 0)`}>
          <PhoneIcon x={210} y={725} label="手机用户" />
          <HomeIcon x={215} y={970} label="IoT生态" />
          <path d="M210 835 L215 885" stroke={palette.line} strokeWidth={5} />
        </g>
        <g transform={`translate(${interpolate(p, [0, 1], [100, 0])} 0)`}>
          <CarOutline x={520} y={760} scale={0.44} />
          <text x={740} y={1060} textAnchor="middle" fill={palette.text} fontSize={28} fontWeight={800}>
            极简 SU7 轮廓
          </text>
        </g>
        <path
          d="M410 905 C475 845 548 845 620 905"
          stroke={palette.amber}
          strokeWidth={8}
          strokeLinecap="round"
          fill="none"
          strokeDasharray="18 16"
          opacity={p}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          left: 150,
          right: 150,
          top: 1240,
          border: `2px solid ${palette.amber}`,
          borderRadius: 26,
          padding: "28px 34px",
          textAlign: "center",
          color: palette.text,
          fontSize: 43,
          fontWeight: 900,
          background: "rgba(8, 11, 16, 0.88)",
          transform: `scale(${interpolate(p, [0, 1], [0.96, 1])})`,
        }}
      >
        小米卖的，
        <br />
        真的只是车吗？
      </div>
    </AbsoluteFill>
  );
};

const MigrationScene: React.FC<{ frame: number }> = ({ frame }) => {
  const p = ease(localProgress(frame, 9, 20));
  const nodes = [
    ["手机用户", 135, 760, palette.cyan],
    ["品牌信任", 345, 760, palette.blue],
    ["发布会流量", 555, 760, palette.amber],
    ["IoT生态", 765, 760, palette.green],
    ["渠道门店", 510, 1045, palette.red],
  ] as const;
  return (
    <AbsoluteFill style={{ opacity: inScene(frame, 9, 20) }}>
      <BigTitle kicker="01 / 能力迁移" title="不是从零开始卖车" sub="小米把手机时代练出来的能力，搬进汽车行业。" />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <path d="M135 760 L345 760 L555 760 L765 760 L755 970 L595 1050" stroke={palette.line} strokeWidth={5} fill="none" />
        <path
          d="M150 1240 C320 1190 510 1190 740 1240"
          stroke={palette.amber}
          strokeWidth={8}
          fill="none"
          strokeDasharray={`${p * 650} 650`}
        />
        {nodes.map(([label, x, y, color], i) => (
          <g key={label} opacity={interpolate(p, [i * 0.12, i * 0.12 + 0.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
            <circle cx={x} cy={y} r={54} fill={palette.panel} stroke={color} strokeWidth={6} />
            <text x={x} y={y + 96} fill={palette.text} fontSize={25} textAnchor="middle" fontWeight={800}>
              {label}
            </text>
          </g>
        ))}
        <CarOutline x={220} y={1230} scale={0.58} color={palette.amber} />
      </svg>
      <div style={{ position: "absolute", left: 116, right: 116, bottom: 278, display: "flex", gap: 16, flexWrap: "wrap" }}>
        <Pill>旧资产</Pill>
        <Pill color={palette.amber}>新战场</Pill>
        <Pill color={palette.green}>迁移效率</Pill>
      </div>
    </AbsoluteFill>
  );
};

const TrustScene: React.FC<{ frame: number }> = ({ frame }) => {
  const p = ease(localProgress(frame, 20, 33));
  return (
    <AbsoluteFill style={{ opacity: inScene(frame, 20, 33) }}>
      <BigTitle kicker="02 / 流量和信任" title="新品牌要先解释自己，小米不用从零解释" />
      <div style={{ position: "absolute", left: 72, right: 72, top: 560, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 26 }}>
        <div style={{ background: palette.panel, borderRadius: 22, padding: 26, border: `2px solid ${palette.line}` }}>
          <div style={{ color: palette.muted, fontSize: 26, fontWeight: 800 }}>普通新品牌</div>
          <div style={{ color: palette.text, fontSize: 42, fontWeight: 900, marginTop: 22 }}>你是谁？</div>
          <div style={{ color: palette.muted, fontSize: 26, lineHeight: 1.35, marginTop: 18 }}>认知、信任、渠道都要重新建立</div>
        </div>
        <div style={{ background: palette.panel, borderRadius: 22, padding: 26, border: `2px solid ${palette.cyan}` }}>
          <div style={{ color: palette.cyan, fontSize: 26, fontWeight: 800 }}>小米入场</div>
          <div style={{ color: palette.text, fontSize: 42, fontWeight: 900, marginTop: 22 }}>先有观众</div>
          <div style={{ color: palette.muted, fontSize: 26, lineHeight: 1.35, marginTop: 18 }}>手机用户、米粉社群、雷军个人 IP</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 110, right: 110, top: 1060, transform: `scale(${interpolate(p, [0.38, 0.75], [0.94, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})` }}>
        <StatCard label="上市后 24 小时" value="88,898 台预订" note="这是预订量，不是最终交付量" color={palette.amber} />
      </div>
      <div style={{ position: "absolute", left: 120, right: 120, bottom: 290, color: palette.muted, fontSize: 25, lineHeight: 1.4 }}>
        预订数字说明早期需求和传播强度，但不能直接等同于产能和交付。
      </div>
    </AbsoluteFill>
  );
};

const EcosystemScene: React.FC<{ frame: number }> = ({ frame }) => {
  const p = ease(localProgress(frame, 33, 45));
  const nodes = [
    ["手机", 540, 720, palette.cyan],
    ["车机", 540, 1010, palette.amber],
    ["平板", 280, 875, palette.blue],
    ["家电", 800, 875, palette.green],
    ["智能家居", 540, 1290, palette.red],
  ] as const;
  return (
    <AbsoluteFill style={{ opacity: inScene(frame, 33, 45) }}>
      <BigTitle kicker="03 / 生态入口" title="车不是孤立产品" sub="它降低的是理解成本和迁移成本。" />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {nodes.slice(1).map(([_, x, y], i) => (
          <path key={i} d={`M540 1010 L${x} ${y}`} stroke={palette.line} strokeWidth={5 + p * 3} />
        ))}
        {nodes.map(([label, x, y, color], i) => (
          <g key={label} opacity={interpolate(p, [i * 0.1, i * 0.1 + 0.22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
            <circle cx={x} cy={y} r={70} fill={palette.panel} stroke={color} strokeWidth={7} />
            <text x={x} y={y + 9} fill={palette.text} fontSize={28} textAnchor="middle" fontWeight={900}>
              {label}
            </text>
          </g>
        ))}
      </svg>
      <div style={{ position: "absolute", left: 240, right: 240, top: 1455, textAlign: "center", padding: 28, borderRadius: 24, background: "rgba(17,24,39,0.92)", border: `2px solid ${palette.green}` }}>
        <div style={{ color: palette.green, fontSize: 44, fontWeight: 950 }}>人车家生态</div>
      </div>
    </AbsoluteFill>
  );
};

const LaunchScene: React.FC<{ frame: number }> = ({ frame }) => {
  const p = ease(localProgress(frame, 45, 58));
  const countdown = Math.max(0, 3 - Math.floor(p * 4));
  return (
    <AbsoluteFill style={{ opacity: inScene(frame, 45, 58) }}>
      <BigTitle kicker="04 / 消费电子打法" title="像卖手机一样卖车" sub="参数、价格、情绪和社群传播，被放进同一场发布会。" />
      <div style={{ position: "absolute", left: 105, right: 105, top: 580, height: 310, borderRadius: 32, background: "linear-gradient(145deg, #101827, #0B1019)", border: `2px solid ${palette.line}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: palette.cyan, fontSize: 112, fontWeight: 950, fontVariantNumeric: "tabular-nums" }}>
          {countdown === 0 ? "发布" : `0${countdown}`}
        </div>
      </div>
      <div style={{ position: "absolute", left: 105, right: 105, top: 990 }}>
        <StatCard label="2024-03-28 正式上市" value="21.59 万元起" color={palette.green} />
      </div>
      <div style={{ position: "absolute", left: 122, right: 122, top: 1320, display: "flex", justifyContent: "space-between", gap: 16 }}>
        <Pill color={palette.cyan}>高性能</Pill>
        <Pill color={palette.amber}>智能座舱</Pill>
        <Pill color={palette.green}>生态联动</Pill>
      </div>
    </AbsoluteFill>
  );
};

const ProofScene: React.FC<{ frame: number }> = ({ frame }) => {
  const p = ease(localProgress(frame, 58, 76));
  const bar = (v: number, max: number) => Math.max(18, (v / max) * 560 * p);
  return (
    <AbsoluteFill style={{ opacity: inScene(frame, 58, 76) }}>
      <BigTitle kicker="05 / 数据证明" title="关键不是热，而是热度有没有变成交付和收入" />
      <div style={{ position: "absolute", left: 85, right: 85, top: 500, display: "grid", gap: 24 }}>
        <StatCard label="2024 智能电动汽车等创新业务收入" value="约 321 亿元" note="毛利率约 18.5%" color={palette.cyan} />
        <StatCard label="汽车平均售价" value="约 234,479 元" note="不是单车净利润" color={palette.amber} />
      </div>
      <div style={{ position: "absolute", left: 110, right: 110, top: 1130, padding: 30, borderRadius: 24, background: palette.panel, border: `2px solid ${palette.line}` }}>
        <div style={{ color: palette.muted, fontSize: 25, fontWeight: 800, marginBottom: 22 }}>从热度到履约</div>
        <div style={{ display: "grid", gap: 24 }}>
          <div>
            <div style={{ color: palette.text, fontSize: 28, fontWeight: 800, marginBottom: 10 }}>2024-10 单月交付超过 20,000 台</div>
            <div style={{ height: 28, background: "#263244", borderRadius: 999 }}>
              <div style={{ height: 28, width: bar(20000, 200000), background: palette.green, borderRadius: 999 }} />
            </div>
          </div>
          <div>
            <div style={{ color: palette.text, fontSize: 28, fontWeight: 800, marginBottom: 10 }}>2025-03-18 第 200,000 辆整车交付</div>
            <div style={{ height: 28, background: "#263244", borderRadius: 999 }}>
              <div style={{ height: 28, width: bar(200000, 200000), background: palette.cyan, borderRadius: 999 }} />
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const TimelineScene: React.FC<{ frame: number }> = ({ frame }) => {
  const p = ease(localProgress(frame, 76, 87));
  const items = [
    ["2021", "宣布进入智能电动汽车行业", "10 年投入 100 亿美元"],
    ["2024-03-28", "SU7 正式上市", "21.59 万元起"],
    ["2025-03-18", "第 200,000 辆整车交付", "首次交付不到一年"],
  ] as const;
  return (
    <AbsoluteFill style={{ opacity: inScene(frame, 76, 87) }}>
      <BigTitle kicker="时间线" title="这不是突然爆红" sub="它是一套能力迁移后的连续动作。" />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <path d="M170 650 L170 1350" stroke={palette.line} strokeWidth={8} />
        <path d="M170 650 L170 1350" stroke={palette.cyan} strokeWidth={8} strokeDasharray={`${p * 700} 700`} />
      </svg>
      <div style={{ position: "absolute", left: 120, right: 80, top: 610, display: "grid", gap: 70 }}>
        {items.map(([year, title, note], i) => (
          <div key={year} style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 28, opacity: interpolate(p, [i * 0.22, i * 0.22 + 0.25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
            <div style={{ width: 102, height: 102, borderRadius: 999, background: palette.panel, border: `6px solid ${i === 1 ? palette.amber : palette.cyan}`, color: palette.text, display: "flex", alignItems: "center", justifyContent: "center", fontSize: year.length > 4 ? 20 : 29, fontWeight: 950, textAlign: "center" }}>
              {year}
            </div>
            <div>
              <div style={{ color: palette.text, fontSize: 34, fontWeight: 900, lineHeight: 1.2 }}>{title}</div>
              <div style={{ color: palette.muted, fontSize: 25, marginTop: 10 }}>{note}</div>
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const LandingScene: React.FC<{ frame: number }> = ({ frame }) => {
  const p = ease(localProgress(frame, 87, 96));
  return (
    <AbsoluteFill style={{ opacity: inScene(frame, 87, 96) }}>
      <BigTitle kicker="结论" title="小米 SU7 的故事，不只是车卖得好" sub="它更像一个商业问题：旧业务里哪些资产可以迁移？" />
      <div style={{ position: "absolute", left: 82, right: 82, top: 660, borderRadius: 30, padding: 34, border: `2px solid ${palette.cyan}`, background: "rgba(17,24,39,0.9)" }}>
        <div style={{ color: palette.muted, fontSize: 30, fontWeight: 800, marginBottom: 22 }}>可迁移资产 =</div>
        <div style={{ display: "flex", gap: 15, flexWrap: "wrap" }}>
          {["用户信任", "品牌心智", "渠道触点", "生态入口", "发布会传播"].map((x, i) => (
            <div key={x} style={{ opacity: interpolate(p, [i * 0.11, i * 0.11 + 0.18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
              <Pill color={[palette.cyan, palette.amber, palette.green, palette.blue, palette.red][i]}>{x}</Pill>
            </div>
          ))}
        </div>
      </div>
      <div style={{ position: "absolute", left: 86, right: 86, top: 1130, color: palette.text, fontSize: 52, lineHeight: 1.28, fontWeight: 950 }}>
        跨界不是从零开始。
        <br />
        真正值钱的是：
        <br />
        把过去的能力，
        <br />
        搬到更大的市场。
      </div>
    </AbsoluteFill>
  );
};

const CaptionLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / fps;
  const cap = captions.find((c) => t >= c.s && t < c.e);
  if (!cap) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 80,
        right: 80,
        bottom: 108,
        minHeight: 86,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        color: palette.text,
        fontSize: 42,
        fontWeight: 900,
        borderRadius: 18,
        background: "rgba(8, 11, 16, 0.72)",
        border: "1px solid rgba(248,250,252,0.18)",
      }}
    >
      {cap.t}
    </div>
  );
};

const SourceFooter: React.FC = () => (
  <div style={{ position: "absolute", left: 50, right: 50, bottom: 28, color: "rgba(248,250,252,0.5)", fontSize: 18, lineHeight: 1.35, textAlign: "center" }}>
    {factSources[0]}
    <br />
    {factSources[1]}
  </div>
);

const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = spring({ frame, fps, config: { damping: 120, stiffness: 25, mass: 2 } });
  return (
    <AbsoluteFill style={{ background: palette.bg, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 15%, rgba(34,211,238,0.16), transparent 38%), linear-gradient(180deg, #090D14, #06080D 65%, #090D14)" }} />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity: 0.32, transform: `translateY(${drift * 18}px)` }}>
        {Array.from({ length: 18 }).map((_, i) => (
          <path key={i} d={`M${-100 + i * 75} 0 L${-420 + i * 75} 1920`} stroke="rgba(148,163,184,0.16)" strokeWidth={2} />
        ))}
        {Array.from({ length: 16 }).map((_, i) => (
          <path key={`h${i}`} d={`M0 ${240 + i * 90} L1080 ${240 + i * 90}`} stroke="rgba(148,163,184,0.10)" strokeWidth={1} />
        ))}
      </svg>
    </AbsoluteFill>
  );
};

export const XiaomiSu7BusinessStory: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps: realFps } = useVideoConfig();
  const titleOpacity = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ fontFamily: "Inter, Microsoft YaHei, Arial, sans-serif" }}>
      <Background />
      <Sequence from={0}>
        <Audio src={staticFile("xiaomi-su7-business-story/narration.mp3")} volume={1} />
      </Sequence>
      <div style={{ opacity: titleOpacity }}>
        <HookScene frame={frame} />
        <MigrationScene frame={frame} />
        <TrustScene frame={frame} />
        <EcosystemScene frame={frame} />
        <LaunchScene frame={frame} />
        <ProofScene frame={frame} />
        <TimelineScene frame={frame} />
        <LandingScene frame={frame} />
      </div>
      <CaptionLayer />
      <SourceFooter />
      <div style={{ position: "absolute", right: 42, top: 38, color: "rgba(248,250,252,0.55)", fontSize: 20, fontWeight: 800 }}>
        {Math.min(96, Math.floor(frame / realFps))}s / 96s
      </div>
    </AbsoluteFill>
  );
};

