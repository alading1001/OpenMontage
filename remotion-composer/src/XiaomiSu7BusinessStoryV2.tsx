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

const FPS = 30;
const DURATION = 206;

const palette = {
  bg: "#070A0F",
  panel: "#111827",
  panel2: "#172033",
  text: "#F8FAFC",
  muted: "#A7B0C0",
  dim: "rgba(248,250,252,0.58)",
  line: "rgba(148,163,184,0.24)",
  cyan: "#22D3EE",
  amber: "#FBBF24",
  green: "#34D399",
  blue: "#60A5FA",
  rose: "#FB7185",
};

const audioSegments = [
  { id: "01_hook", start: 0, duration: 10.82 },
  { id: "02_judgment", start: 11.52, duration: 16.82 },
  { id: "03_timeline", start: 29.04, duration: 35.04 },
  { id: "04_trust", start: 64.78, duration: 27.07 },
  { id: "05_ecosystem", start: 92.55, duration: 21.6 },
  { id: "06_launch", start: 114.85, duration: 24.43 },
  { id: "07_business_result", start: 139.98, duration: 29.86 },
  { id: "08_model_end", start: 170.54, duration: 33.1 },
];

const scenes = [
  { id: "hook", start: 0, end: 11.52 },
  { id: "judgment", start: 11.52, end: 29.04 },
  { id: "timeline", start: 29.04, end: 64.78 },
  { id: "trust", start: 64.78, end: 92.55 },
  { id: "ecosystem", start: 92.55, end: 114.85 },
  { id: "launch", start: 114.85, end: 139.98 },
  { id: "business", start: 139.98, end: 170.54 },
  { id: "model", start: 170.54, end: DURATION },
];

const captions = [
  [0.2, 3.6, "小米第一次造车"],
  [3.6, 7.2, "为什么不是从零开始？"],
  [7.2, 11.0, "因为它带来整套打法"],
  [12.0, 16.5, "如果只看车"],
  [16.5, 21.8, "它像突然闯入的新手"],
  [21.8, 28.5, "镜头拉远：它不是空手进场"],
  [30.0, 35.5, "先看三年时间线"],
  [35.5, 42.0, "2021：宣布入局"],
  [42.0, 49.0, "2024：SU7 正式上市"],
  [49.0, 56.0, "24小时 88,898 台预订"],
  [56.0, 64.3, "注意：预订不是交付"],
  [65.2, 70.5, "第一层：用户信任"],
  [70.5, 77.2, "新品牌先回答：你是谁？"],
  [77.2, 84.8, "小米少走了一段路"],
  [84.8, 91.8, "预订说明注意力动员"],
  [93.0, 98.8, "第二层：生态入口"],
  [98.8, 105.5, "车进入已有设备网络"],
  [105.5, 114.0, "降低理解成本和迁移成本"],
  [115.2, 121.2, "第三层：发布会打法"],
  [121.2, 130.0, "像卖手机一样卖车"],
  [130.0, 139.2, "21.59 万元也是传播事件"],
  [140.5, 146.0, "热度不等于成功"],
  [146.0, 154.5, "要看交付和收入"],
  [154.5, 162.2, "321 亿元收入，18.5% 毛利率"],
  [162.2, 169.8, "关注度转成经营数据"],
  [171.0, 178.0, "跨界不只看新产品"],
  [178.0, 187.0, "还要看旧资产能否迁移"],
  [187.0, 198.5, "旧能力，搬到更大的市场"],
  [198.5, 204.0, "跨界不是从零开始"],
] as const;

const facts = [
  "Sources: Business Insider / Reuters; WSJ; Xiaomi disclosures; Xiaomi SU7 reference summary.",
  "Pre-orders are not deliveries. EV revenue/margin refers to smart EV and other innovation business.",
];

const sec = (frame: number) => frame / FPS;

const fadeScene = (frame: number, start: number, end: number) => {
  const t = sec(frame);
  if (t < start || t > end) return 0;
  return interpolate(t, [start, start + 0.7, end - 0.55, end], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

const progress = (frame: number, start: number, end: number) =>
  interpolate(sec(frame), [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const ease = (v: number) => Easing.out(Easing.cubic)(v);

const Title: React.FC<{ kicker?: string; title: string; sub?: string }> = ({
  kicker,
  title,
  sub,
}) => (
  <div style={{ position: "absolute", left: 76, right: 76, top: 105 }}>
    {kicker ? (
      <div style={{ color: palette.cyan, fontSize: 29, fontWeight: 900, marginBottom: 18 }}>
        {kicker}
      </div>
    ) : null}
    <div style={{ color: palette.text, fontSize: 66, lineHeight: 1.12, fontWeight: 950 }}>
      {title}
    </div>
    {sub ? (
      <div style={{ color: palette.muted, fontSize: 30, lineHeight: 1.38, marginTop: 22, fontWeight: 700 }}>
        {sub}
      </div>
    ) : null}
  </div>
);

const Card: React.FC<{
  label: string;
  value: string;
  note?: string;
  color?: string;
}> = ({ label, value, note, color = palette.cyan }) => (
  <div
    style={{
      border: `2px solid ${color}`,
      borderRadius: 22,
      background: "linear-gradient(145deg, rgba(17,24,39,0.96), rgba(23,32,51,0.9))",
      boxShadow: `0 0 34px ${color}20`,
      padding: 28,
    }}
  >
    <div style={{ color: palette.muted, fontSize: 25, fontWeight: 850 }}>{label}</div>
    <div style={{ color, fontSize: 56, lineHeight: 1.08, fontWeight: 950, marginTop: 10 }}>{value}</div>
    {note ? <div style={{ color: palette.muted, fontSize: 23, lineHeight: 1.35, marginTop: 12 }}>{note}</div> : null}
  </div>
);

const Tag: React.FC<{ text: string; color?: string }> = ({ text, color = palette.cyan }) => (
  <div
    style={{
      color,
      border: `2px solid ${color}`,
      borderRadius: 999,
      padding: "10px 16px",
      fontSize: 25,
      fontWeight: 850,
      background: "rgba(8, 11, 16, 0.78)",
      whiteSpace: "nowrap",
    }}
  >
    {text}
  </div>
);

const Car: React.FC<{ x: number; y: number; scale?: number; color?: string }> = ({
  x,
  y,
  scale = 1,
  color = palette.cyan,
}) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <path
      d="M70 86 C135 20 215 0 340 0 L535 0 C660 0 740 44 810 105 L900 126 C936 135 960 162 960 202 L960 230 L42 230 L42 188 C42 142 52 110 70 86 Z"
      fill="rgba(34, 211, 238, 0.05)"
      stroke={color}
      strokeWidth={8}
      strokeLinejoin="round"
    />
    <path d="M238 22 L196 94 L632 94 L552 22 Z" fill="none" stroke={color} strokeWidth={6} />
    <circle cx={250} cy={232} r={54} fill={palette.bg} stroke={color} strokeWidth={8} />
    <circle cx={750} cy={232} r={54} fill={palette.bg} stroke={color} strokeWidth={8} />
    <path d="M92 144 L168 144" stroke={color} strokeWidth={7} strokeLinecap="round" />
    <path d="M814 144 L900 144" stroke={color} strokeWidth={7} strokeLinecap="round" />
  </g>
);

const DeviceNode: React.FC<{ x: number; y: number; text: string; color: string }> = ({ x, y, text, color }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={58} fill={palette.panel} stroke={color} strokeWidth={6} />
    <text y={9} fill={palette.text} fontSize={25} fontWeight={900} textAnchor="middle">
      {text}
    </text>
  </g>
);

const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = spring({ frame, fps: FPS, config: { damping: 140, stiffness: 18, mass: 2 } });
  return (
    <AbsoluteFill style={{ background: palette.bg, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 13%, rgba(34,211,238,0.16), transparent 36%), linear-gradient(180deg, #090D14, #05070C 70%, #090D14)",
        }}
      />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: 0.34, transform: `translateY(${drift * 18}px)` }}>
        {Array.from({ length: 18 }).map((_, i) => (
          <path key={i} d={`M${-100 + i * 76} 0 L${-420 + i * 76} 1920`} stroke="rgba(148,163,184,0.14)" strokeWidth={2} />
        ))}
        {Array.from({ length: 17 }).map((_, i) => (
          <path key={`h${i}`} d={`M0 ${225 + i * 92} L1080 ${225 + i * 92}`} stroke="rgba(148,163,184,0.10)" strokeWidth={1} />
        ))}
      </svg>
    </AbsoluteFill>
  );
};

const Hook: React.FC<{ frame: number }> = ({ frame }) => {
  const p = ease(progress(frame, 0, 11.52));
  return (
    <AbsoluteFill style={{ opacity: fadeScene(frame, 0, 11.52) }}>
      <Title title="小米第一次造车，为什么不是从零开始？" sub="它带进汽车行业的，不只有钱和工程师。" />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {[
          ["手机", 155, 650, palette.cyan],
          ["米家", 155, 850, palette.green],
          ["发布会", 155, 1050, palette.amber],
          ["社群", 155, 1250, palette.blue],
        ].map(([text, x, y, color], i) => (
          <g key={text} opacity={interpolate(p, [i * 0.08, i * 0.08 + 0.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
            <DeviceNode x={x as number} y={y as number} text={text as string} color={color as string} />
          </g>
        ))}
        <path d="M305 950 C440 890 552 890 675 950" stroke={palette.amber} strokeWidth={8} strokeLinecap="round" fill="none" strokeDasharray="18 16" />
        <Car x={610} y={825} scale={0.36} />
      </svg>
      <div style={{ position: "absolute", left: 265, right: 245, top: 1160, display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
        <Tag text="旧能力" color={palette.amber} />
        <div style={{ color: palette.text, fontSize: 46, fontWeight: 950 }}>{"->"}</div>
        <Tag text="新战场" color={palette.cyan} />
      </div>
    </AbsoluteFill>
  );
};

const Judgment: React.FC<{ frame: number }> = ({ frame }) => {
  const p = ease(progress(frame, 11.52, 29.04));
  const tags = ["用户", "品牌", "生态", "渠道", "发布会"];
  return (
    <AbsoluteFill style={{ opacity: fadeScene(frame, 11.52, 29.04) }}>
      <Title kicker="先立判断" title="SU7 不是一个孤立爆款" sub="它更像一次消费电子能力，迁移到重资产行业。" />
      <div style={{ position: "absolute", left: 82, right: 82, top: 620, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
        <Card label="只看车" value="突然入场" note="像一个汽车新人" color={palette.muted} />
        <Card label="拉远看" value="带资产入场" note="手机时代能力迁移" color={palette.cyan} />
      </div>
      <div style={{ position: "absolute", left: 95, right: 95, top: 1050, border: `2px solid ${palette.line}`, borderRadius: 26, padding: 28, background: "rgba(17,24,39,0.88)" }}>
        <div style={{ color: palette.muted, fontSize: 28, fontWeight: 850, marginBottom: 22 }}>能力迁移图</div>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {tags.map((t, i) => (
            <div key={t} style={{ opacity: interpolate(p, [i * 0.12, i * 0.12 + 0.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
              <Tag text={t} color={[palette.cyan, palette.amber, palette.green, palette.blue, palette.rose][i]} />
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Timeline: React.FC<{ frame: number }> = ({ frame }) => {
  const p = ease(progress(frame, 29.04, 64.78));
  const items = [
    ["2021", "宣布入局", "10 年投入 100 亿美元"],
    ["2024-03-28", "SU7 上市", "21.59 万元起"],
    ["24 小时", "88,898 台预订", "预订不是交付"],
    ["2024-10", "单月交付超 20,000 台", "交付口径"],
    ["2025-03-18", "第 200,000 辆交付", "整车交付"],
  ];
  return (
    <AbsoluteFill style={{ opacity: fadeScene(frame, 29.04, 64.78) }}>
      <Title kicker="时间线" title="三年铺垫，不是一夜爆红" sub="造车投入在前，传播和用户动员接在后面。" />
      <div style={{ position: "absolute", left: 62, right: 62, top: 560, display: "grid", gap: 18 }}>
        {items.map(([date, title, note], i) => (
          <div
            key={date}
            style={{
              opacity: interpolate(p, [i * 0.12, i * 0.12 + 0.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
              display: "grid",
              gridTemplateColumns: "190px 1fr",
              gap: 20,
              alignItems: "center",
              background: "rgba(17,24,39,0.84)",
              border: `2px solid ${i === 2 ? palette.amber : palette.line}`,
              borderRadius: 18,
              padding: "22px 24px",
            }}
          >
            <div style={{ color: i === 2 ? palette.amber : palette.cyan, fontSize: date.length > 7 ? 25 : 34, fontWeight: 950 }}>{date}</div>
            <div>
              <div style={{ color: palette.text, fontSize: 32, fontWeight: 920 }}>{title}</div>
              <div style={{ color: palette.muted, fontSize: 23, marginTop: 6 }}>{note}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 90, right: 90, bottom: 250, color: palette.muted, fontSize: 28, lineHeight: 1.38, textAlign: "center" }}>
        这个时间线说明：热度不是凭空来的，它接上了已有的传播和用户动员能力。
      </div>
    </AbsoluteFill>
  );
};

const Trust: React.FC<{ frame: number }> = ({ frame }) => {
  const p = ease(progress(frame, 64.78, 92.55));
  return (
    <AbsoluteFill style={{ opacity: fadeScene(frame, 64.78, 92.55) }}>
      <Title kicker="第一层能力" title="用户信任，让第一次尝试更容易发生" />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <path d="M170 850 C330 780 470 780 630 850 C710 885 785 935 860 1010" stroke={palette.line} strokeWidth={7} fill="none" />
        <DeviceNode x={170} y={850} text="手机用户" color={palette.cyan} />
        <DeviceNode x={405} y={820} text="米粉社群" color={palette.blue} />
        <DeviceNode x={635} y={860} text="创始人IP" color={palette.amber} />
        <Car x={580} y={1040} scale={0.34} color={palette.green} />
        <path d="M170 850 C370 860 565 920 760 1080" stroke={palette.green} strokeWidth={8} fill="none" strokeDasharray={`${p * 760} 760`} />
      </svg>
      <div style={{ position: "absolute", left: 100, right: 100, top: 1240 }}>
        <Card label="上市后 24 小时" value="88,898 台预订" note="预订不等于最终交付" color={palette.amber} />
      </div>
      <div style={{ position: "absolute", left: 105, right: 105, bottom: 260, color: palette.muted, fontSize: 27, lineHeight: 1.4 }}>
        这个数字说明早期注意力动员很强，但不能直接替代产能和交付。
      </div>
    </AbsoluteFill>
  );
};

const Ecosystem: React.FC<{ frame: number }> = ({ frame }) => {
  const p = ease(progress(frame, 92.55, 114.85));
  const nodes = [
    ["手机", 540, 675, palette.cyan],
    ["平板", 280, 880, palette.blue],
    ["车机", 540, 980, palette.amber],
    ["家电", 800, 880, palette.green],
    ["家庭场景", 540, 1270, palette.rose],
  ] as const;
  return (
    <AbsoluteFill style={{ opacity: fadeScene(frame, 92.55, 114.85) }}>
      <Title kicker="第二层能力" title="生态不是口号，它降低理解成本" />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {nodes.slice(0, 2).map((n, i) => (
          <path key={i} d={`M540 980 L${n[1]} ${n[2]}`} stroke={palette.line} strokeWidth={6} />
        ))}
        {nodes.slice(3).map((n, i) => (
          <path key={i + 3} d={`M540 980 L${n[1]} ${n[2]}`} stroke={palette.line} strokeWidth={6} />
        ))}
        {nodes.map(([text, x, y, color], i) => (
          <g key={text} opacity={interpolate(p, [i * 0.1, i * 0.1 + 0.22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
            <DeviceNode x={x} y={y} text={text} color={color} />
          </g>
        ))}
      </svg>
      <div style={{ position: "absolute", left: 100, right: 100, top: 1435, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <Card label="用户感受" value="我知道怎么用" color={palette.cyan} />
        <Card label="迁移路径" value="能连已有设备" color={palette.green} />
      </div>
    </AbsoluteFill>
  );
};

const Launch: React.FC<{ frame: number }> = ({ frame }) => {
  const p = ease(progress(frame, 114.85, 139.98));
  return (
    <AbsoluteFill style={{ opacity: fadeScene(frame, 114.85, 139.98) }}>
      <Title kicker="第三层能力" title="消费电子式发布，让价格变成传播事件" />
      <div style={{ position: "absolute", left: 98, right: 98, top: 570, height: 280, borderRadius: 32, border: `2px solid ${palette.line}`, background: "linear-gradient(145deg,#101827,#080C13)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: palette.cyan, fontSize: 78, fontWeight: 950 }}>发布会舞台</div>
      </div>
      <div style={{ position: "absolute", left: 110, right: 110, top: 930, transform: `scale(${interpolate(p, [0.2, 0.45], [0.95, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})` }}>
        <Card label="2024-03-28 正式上市" value="21.59 万元起" note="价格本身成为可讨论的传播点" color={palette.green} />
      </div>
      <div style={{ position: "absolute", left: 110, right: 110, top: 1285, display: "flex", gap: 16, flexWrap: "wrap" }}>
        <Tag text="参数可传播" color={palette.cyan} />
        <Tag text="价格可讨论" color={palette.amber} />
        <Tag text="社群可扩散" color={palette.green} />
      </div>
    </AbsoluteFill>
  );
};

const Business: React.FC<{ frame: number }> = ({ frame }) => {
  const p = ease(progress(frame, 139.98, 170.54));
  return (
    <AbsoluteFill style={{ opacity: fadeScene(frame, 139.98, 170.54) }}>
      <Title kicker="数据验证" title="热度有没有变成经营结果？" sub="真正要看交付、收入和业务闭环。" />
      <div style={{ position: "absolute", left: 82, right: 82, top: 530, display: "grid", gap: 22 }}>
        <Card label="2024 EV相关创新业务收入" value="约 321 亿元" note="不是单独写成 SU7 单车业务" color={palette.cyan} />
        <Card label="相关业务毛利率" value="约 18.5%" note="毛利率，不是净利润" color={palette.amber} />
        <Card label="2025-03-18" value="第 20 万辆整车交付" note="交付口径，与预订口径分开" color={palette.green} />
      </div>
      <div style={{ position: "absolute", left: 105, right: 105, bottom: 245, color: palette.muted, fontSize: 27, lineHeight: 1.4 }}>
        这些数据说明：至少第一阶段，关注度已经转成履约、收入和业务闭环。
      </div>
      <div style={{ position: "absolute", left: 86, right: 86, top: 1458, height: 20, borderRadius: 999, background: "#263244" }}>
        <div style={{ width: `${p * 100}%`, height: "100%", borderRadius: 999, background: palette.cyan }} />
      </div>
    </AbsoluteFill>
  );
};

const ModelEnd: React.FC<{ frame: number }> = ({ frame }) => {
  const p = ease(progress(frame, 170.54, DURATION));
  const tags = ["用户信任", "品牌心智", "渠道触点", "生态入口", "发布会传播"];
  const finalOnly = sec(frame) > 198.5;
  return (
    <AbsoluteFill style={{ opacity: fadeScene(frame, 170.54, DURATION) }}>
      {!finalOnly ? (
        <>
          <Title kicker="可迁移模型" title="跨界不只看新产品" sub="还要看旧业务里的资产，能不能带到新战场。" />
          <div style={{ position: "absolute", left: 82, right: 82, top: 610, border: `2px solid ${palette.cyan}`, borderRadius: 28, background: "rgba(17,24,39,0.9)", padding: 34 }}>
            <div style={{ color: palette.text, fontSize: 44, fontWeight: 950, textAlign: "center" }}>跨界成功 = 新产品能力 x 旧资产迁移</div>
          </div>
          <div style={{ position: "absolute", left: 82, right: 82, top: 865, display: "flex", gap: 14, flexWrap: "wrap" }}>
            {tags.map((t, i) => (
              <div key={t} style={{ opacity: interpolate(p, [i * 0.09, i * 0.09 + 0.18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
                <Tag text={t} color={[palette.cyan, palette.amber, palette.green, palette.blue, palette.rose][i]} />
              </div>
            ))}
          </div>
          <div style={{ position: "absolute", left: 86, right: 86, top: 1190, color: palette.text, fontSize: 46, lineHeight: 1.3, fontWeight: 950 }}>
            这些资产不能替代造车能力。
            <br />
            但能让新车更快被看见、
            <br />
            被讨论、被尝试。
          </div>
        </>
      ) : (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: 90, textAlign: "center" }}>
          <div style={{ color: palette.text, fontSize: 72, lineHeight: 1.2, fontWeight: 950 }}>
            跨界不是
            <br />
            从零开始。
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

const CaptionLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const t = sec(frame);
  const cap = captions.find(([s, e]) => t >= s && t < e);
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
        fontWeight: 950,
        borderRadius: 18,
        background: "rgba(8, 11, 16, 0.72)",
        border: "1px solid rgba(248,250,252,0.18)",
      }}
    >
      {cap[2]}
    </div>
  );
};

const Footer: React.FC = () => (
  <div style={{ position: "absolute", left: 50, right: 50, bottom: 28, color: "rgba(248,250,252,0.48)", fontSize: 17, lineHeight: 1.35, textAlign: "center" }}>
    {facts[0]}
    <br />
    {facts[1]}
  </div>
);

export const XiaomiSu7BusinessStoryV2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ fontFamily: "Inter, Microsoft YaHei, Arial, sans-serif" }}>
      <Background />
      {audioSegments.map((a) => (
        <Sequence key={a.id} from={Math.round(a.start * FPS)}>
          <Audio src={staticFile(`xiaomi-su7-business-story-v2/${a.id}.mp3`)} volume={1} />
        </Sequence>
      ))}
      <Hook frame={frame} />
      <Judgment frame={frame} />
      <Timeline frame={frame} />
      <Trust frame={frame} />
      <Ecosystem frame={frame} />
      <Launch frame={frame} />
      <Business frame={frame} />
      <ModelEnd frame={frame} />
      <CaptionLayer />
      <Footer />
      <div style={{ position: "absolute", right: 42, top: 38, color: "rgba(248,250,252,0.55)", fontSize: 20, fontWeight: 850 }}>
        {Math.min(DURATION, Math.floor(frame / fps))}s / {DURATION}s
      </div>
    </AbsoluteFill>
  );
};
