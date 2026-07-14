import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
} from "remotion";

const FPS = 30;
const DURATION = 177;

const palette = {
  bg: "#080A0E",
  paper: "#F4F0E6",
  ink: "#F7FAFC",
  muted: "#AAB3C2",
  line: "rgba(247,250,252,0.18)",
  panel: "rgba(16, 22, 32, 0.78)",
  cyan: "#2DD4BF",
  blue: "#5BA7FF",
  amber: "#F4B24D",
  red: "#F87171",
  green: "#6EE7B7",
  violet: "#A78BFA",
};

const audioSegments = [
  { id: "01_hook", start: 0, duration: 11.928 },
  { id: "02_judgment", start: 12.5, duration: 12.888 },
  { id: "03_timeline", start: 26.0, duration: 28.992 },
  { id: "04_trust", start: 55.7, duration: 15.024 },
  { id: "05_ecosystem", start: 71.4, duration: 19.008 },
  { id: "06_launch", start: 91.1, duration: 19.032 },
  { id: "07_data", start: 110.8, duration: 26.4 },
  { id: "08_model", start: 137.9, duration: 21.84 },
  { id: "09_end", start: 160.5, duration: 14.736 },
];

const scenes = [
  { id: "hook", start: 0, end: 12.5 },
  { id: "judgment", start: 12.5, end: 26.0 },
  { id: "timeline", start: 26.0, end: 55.7 },
  { id: "trust", start: 55.7, end: 71.4 },
  { id: "ecosystem", start: 71.4, end: 91.1 },
  { id: "launch", start: 91.1, end: 110.8 },
  { id: "data", start: 110.8, end: 137.9 },
  { id: "model", start: 137.9, end: 160.5 },
  { id: "end", start: 160.5, end: DURATION },
];

const captions = [
  [0.2, 3.2, "小米第一次造车"],
  [3.2, 6.2, "为什么不是从零开始？"],
  [6.2, 11.6, "带来手机时代的打法"],
  [12.8, 16.2, "SU7 不是单点爆款"],
  [16.2, 20.8, "它更像能力迁移"],
  [20.8, 25.4, "旧能力进入新战场"],
  [26.4, 30.0, "先看时间线"],
  [30.0, 34.6, "2021：宣布造车"],
  [34.6, 39.4, "2024：21.59 万元起"],
  [39.4, 44.5, "24小时 88,898 台预订"],
  [44.5, 48.5, "预订不是交付"],
  [48.5, 55.0, "热度接上交付"],
  [56.0, 59.5, "第一层：用户信任"],
  [59.5, 64.6, "新品牌先回答：你是谁"],
  [64.6, 70.7, "信任降低尝试门槛"],
  [72.0, 75.6, "第二层：生态入口"],
  [75.6, 82.5, "车进入已有设备网络"],
  [82.5, 90.5, "降低理解成本和迁移成本"],
  [91.6, 95.4, "第三层：发布会打法"],
  [95.4, 101.5, "像卖手机一样卖车"],
  [101.5, 110.0, "价格也成为传播事件"],
  [111.2, 115.5, "热度不等于成功"],
  [115.5, 122.5, "要看交付和收入"],
  [122.5, 130.2, "321 亿元，18.5%"],
  [130.2, 137.0, "声量变成业务闭环"],
  [138.4, 143.0, "跨界不只看新产品"],
  [143.0, 150.0, "还要看旧资产能否迁移"],
  [150.0, 159.8, "被看见，被讨论，被尝试"],
  [161.0, 166.5, "跨界不是从零开始"],
  [166.5, 174.7, "能力搬到更大的市场"],
] as const;

const sec = (frame: number) => frame / FPS;
const ease = (v: number) => Easing.out(Easing.cubic)(v);

const progress = (frame: number, start: number, end: number) =>
  interpolate(sec(frame), [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const fadeScene = (frame: number, start: number, end: number) => {
  const t = sec(frame);
  if (t < start || t > end) return 0;
  return interpolate(t, [start, start + 0.55, end - 0.45, end], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

const Title: React.FC<{ kicker?: string; title: string; sub?: string }> = ({
  kicker,
  title,
  sub,
}) => (
  <div style={{ position: "absolute", left: 70, right: 70, top: 94 }}>
    {kicker ? (
      <div style={{ color: palette.cyan, fontSize: 28, fontWeight: 900, marginBottom: 18 }}>
        {kicker}
      </div>
    ) : null}
    <div style={{ color: palette.ink, fontSize: 62, lineHeight: 1.12, fontWeight: 950 }}>
      {title}
    </div>
    {sub ? (
      <div style={{ color: palette.muted, fontSize: 29, lineHeight: 1.35, marginTop: 20, fontWeight: 760 }}>
        {sub}
      </div>
    ) : null}
  </div>
);

const Pill: React.FC<{ text: string; color?: string }> = ({ text, color = palette.cyan }) => (
  <div
    style={{
      color,
      border: `2px solid ${color}`,
      borderRadius: 10,
      padding: "10px 15px",
      fontSize: 25,
      fontWeight: 900,
      background: "rgba(8,10,14,0.66)",
      whiteSpace: "nowrap",
    }}
  >
    {text}
  </div>
);

const DataPanel: React.FC<{ label: string; value: string; note?: string; color?: string }> = ({
  label,
  value,
  note,
  color = palette.cyan,
}) => (
  <div
    style={{
      borderLeft: `8px solid ${color}`,
      background: "rgba(13,18,27,0.86)",
      padding: "24px 26px",
      boxShadow: "0 20px 54px rgba(0,0,0,0.28)",
    }}
  >
    <div style={{ color: palette.muted, fontSize: 24, fontWeight: 850 }}>{label}</div>
    <div style={{ color, fontSize: 54, lineHeight: 1.08, fontWeight: 950, marginTop: 8 }}>{value}</div>
    {note ? <div style={{ color: palette.muted, fontSize: 22, lineHeight: 1.35, marginTop: 8 }}>{note}</div> : null}
  </div>
);

const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = spring({ frame, fps: FPS, config: { damping: 180, stiffness: 24, mass: 2 } });
  return (
    <AbsoluteFill style={{ background: palette.bg, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, #080A0E 0%, #0E141F 54%, #07090D 100%)",
        }}
      />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: 0.54 }}>
        {Array.from({ length: 20 }).map((_, i) => (
          <path
            key={`v${i}`}
            d={`M${-240 + i * 78} 0 L${-520 + i * 78 + drift * 16} 1920`}
            stroke="rgba(170,179,194,0.12)"
            strokeWidth={1}
          />
        ))}
        {Array.from({ length: 16 }).map((_, i) => (
          <path key={`h${i}`} d={`M0 ${250 + i * 92} L1080 ${250 + i * 92}`} stroke="rgba(170,179,194,0.09)" />
        ))}
      </svg>
    </AbsoluteFill>
  );
};

const PhoneIcon: React.FC<{ x: number; y: number; color: string; label: string }> = ({ x, y, color, label }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-38} y={-58} width={76} height={116} rx={14} fill="rgba(8,10,14,0.7)" stroke={color} strokeWidth={5} />
    <circle cx={0} cy={40} r={5} fill={color} />
    <text y={98} fill={palette.ink} fontSize={25} fontWeight={900} textAnchor="middle">
      {label}
    </text>
  </g>
);

const Node: React.FC<{ x: number; y: number; color: string; label: string; small?: boolean }> = ({
  x,
  y,
  color,
  label,
  small,
}) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={small ? 44 : 58} fill="rgba(8,10,14,0.72)" stroke={color} strokeWidth={5} />
    <text y={8} fill={palette.ink} fontSize={small ? 22 : 25} fontWeight={900} textAnchor="middle">
      {label}
    </text>
  </g>
);

const Car: React.FC<{ x: number; y: number; scale?: number; color?: string }> = ({
  x,
  y,
  scale = 1,
  color = palette.cyan,
}) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <path
      d="M58 92 C140 28 244 8 372 18 L550 32 C652 42 742 76 820 142 L928 168 C956 175 974 196 974 226 L974 248 L45 248 L45 200 C45 152 50 116 58 92 Z"
      fill="rgba(45,212,191,0.04)"
      stroke={color}
      strokeWidth={7}
      strokeLinejoin="round"
    />
    <path d="M248 36 L196 118 L620 118 L540 48 Z" fill="none" stroke={color} strokeWidth={5} />
    <circle cx={260} cy={250} r={48} fill={palette.bg} stroke={color} strokeWidth={7} />
    <circle cx={755} cy={250} r={48} fill={palette.bg} stroke={color} strokeWidth={7} />
    <path d="M92 168 L170 168" stroke={color} strokeWidth={7} strokeLinecap="round" />
    <path d="M812 172 L900 172" stroke={color} strokeWidth={7} strokeLinecap="round" />
  </g>
);

const Hook: React.FC<{ frame: number }> = ({ frame }) => {
  const p = ease(progress(frame, scenes[0].start, scenes[0].end));
  return (
    <AbsoluteFill style={{ opacity: fadeScene(frame, scenes[0].start, scenes[0].end) }}>
      <Title title="小米造车，不是从零开始" sub="一个手机公司，第一次造车，为什么能让传统车企紧张？" />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {[
          ["手机", 160, 650, palette.cyan],
          ["米家", 158, 830, palette.green],
          ["发布会", 164, 1010, palette.amber],
          ["社群", 160, 1190, palette.blue],
        ].map(([label, x, y, color], i) => (
          <g key={label} opacity={interpolate(p, [i * 0.09, i * 0.09 + 0.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
            <Node x={x as number} y={y as number} label={label as string} color={color as string} />
          </g>
        ))}
        <path d="M300 925 C438 850 548 865 666 942" stroke={palette.amber} strokeWidth={7} fill="none" strokeDasharray="18 14" />
        <Car x={585} y={820} scale={0.38} />
      </svg>
      <div style={{ position: "absolute", left: 300, right: 260, top: 1190, display: "flex", gap: 16, alignItems: "center" }}>
        <Pill text="旧能力" color={palette.amber} />
        <div style={{ color: palette.ink, fontSize: 42, fontWeight: 950 }}>{"->"}</div>
        <Pill text="新战场" color={palette.cyan} />
      </div>
    </AbsoluteFill>
  );
};

const Judgment: React.FC<{ frame: number }> = ({ frame }) => {
  const p = ease(progress(frame, scenes[1].start, scenes[1].end));
  const tags = ["用户信任", "品牌心智", "渠道触点", "生态入口", "发布会传播"];
  return (
    <AbsoluteFill style={{ opacity: fadeScene(frame, scenes[1].start, scenes[1].end) }}>
      <Title kicker="先给结论" title="SU7 不是单点爆款" sub="它更像一次能力迁移。" />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <Car x={315} y={730} scale={0.44} color={palette.cyan} />
        {tags.map((t, i) => {
          const y = 1070 + i * 92;
          const color = [palette.cyan, palette.amber, palette.blue, palette.green, palette.violet][i];
          const op = interpolate(p, [i * 0.11, i * 0.11 + 0.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <g key={t} opacity={op}>
              <path d={`M230 ${y + 2} C390 ${y - 25} 520 1020 650 940`} stroke={color} strokeWidth={4} fill="none" />
              <rect x={90} y={y - 36} width={280} height={72} fill="rgba(8,10,14,0.72)" stroke={color} strokeWidth={3} />
              <text x={230} y={y + 10} fill={palette.ink} fontSize={28} fontWeight={900} textAnchor="middle">
                {t}
              </text>
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

const Timeline: React.FC<{ frame: number }> = ({ frame }) => {
  const p = ease(progress(frame, scenes[2].start, scenes[2].end));
  const items = [
    ["2021", "宣布造车", "10 年投入 100 亿美元"],
    ["2024-03-28", "SU7 上市", "21.59 万元起"],
    ["24 小时", "88,898 台预订", "预订不是交付"],
    ["2024-10", "单月交付超 20,000 台", "交付口径"],
    ["2025-03", "第 20 万辆交付", "整车交付"],
  ];
  return (
    <AbsoluteFill style={{ opacity: fadeScene(frame, scenes[2].start, scenes[2].end) }}>
      <Title kicker="时间线" title="三年铺垫，不是一夜爆红" />
      <div style={{ position: "absolute", left: 92, top: 500, width: 8, height: 875, background: "rgba(247,250,252,0.14)" }}>
        <div style={{ width: 8, height: `${p * 875}px`, background: palette.cyan }} />
      </div>
      <div style={{ position: "absolute", left: 125, right: 70, top: 455, display: "grid", gap: 20 }}>
        {items.map(([date, title, note], i) => {
          const color = i === 2 ? palette.amber : i >= 3 ? palette.green : palette.cyan;
          const op = interpolate(p, [i * 0.13, i * 0.13 + 0.18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <div key={date} style={{ opacity: op, display: "grid", gridTemplateColumns: "175px 1fr", gap: 24, alignItems: "center" }}>
              <div style={{ color, fontSize: date.length > 6 ? 24 : 34, fontWeight: 950 }}>{date}</div>
              <div style={{ borderBottom: `2px solid ${palette.line}`, padding: "21px 0" }}>
                <div style={{ color: palette.ink, fontSize: 33, fontWeight: 950 }}>{title}</div>
                <div style={{ color: palette.muted, fontSize: 23, marginTop: 7 }}>{note}</div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 96, right: 96, bottom: 240, color: palette.muted, fontSize: 28, lineHeight: 1.35, textAlign: "center" }}>
        长期投入接上强传播，热度才有机会转成交付。
      </div>
    </AbsoluteFill>
  );
};

const Trust: React.FC<{ frame: number }> = ({ frame }) => {
  const p = ease(progress(frame, scenes[3].start, scenes[3].end));
  return (
    <AbsoluteFill style={{ opacity: fadeScene(frame, scenes[3].start, scenes[3].end) }}>
      <Title kicker="第一层能力" title="用户信任，降低第一次尝试门槛" />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <PhoneIcon x={190} y={780} color={palette.cyan} label="手机用户" />
        <Node x={430} y={760} color={palette.blue} label="米粉社群" />
        <Node x={680} y={800} color={palette.amber} label="创始人IP" />
        <Car x={565} y={1030} scale={0.36} color={palette.green} />
        <path d="M190 780 C365 850 560 920 752 1090" stroke={palette.green} strokeWidth={7} fill="none" strokeDasharray={`${p * 760} 760`} />
      </svg>
      <div style={{ position: "absolute", left: 92, right: 92, top: 1295 }}>
        <DataPanel label="早期注意力动员" value="24小时 88,898 台预订" note="预订不等于最终交付" color={palette.amber} />
      </div>
    </AbsoluteFill>
  );
};

const Ecosystem: React.FC<{ frame: number }> = ({ frame }) => {
  const p = ease(progress(frame, scenes[4].start, scenes[4].end));
  const nodes = [
    ["手机", 540, 650, palette.cyan],
    ["平板", 300, 835, palette.blue],
    ["车机", 540, 980, palette.amber],
    ["家居", 790, 835, palette.green],
    ["家庭场景", 540, 1250, palette.violet],
  ] as const;
  return (
    <AbsoluteFill style={{ opacity: fadeScene(frame, scenes[4].start, scenes[4].end) }}>
      <Title kicker="第二层能力" title="生态入口，降低理解成本" />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {nodes.map(([text, x, y, color], i) => (
          <g key={text} opacity={interpolate(p, [i * 0.1, i * 0.1 + 0.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
            <path d={`M540 980 L${x} ${y}`} stroke={palette.line} strokeWidth={5} />
            <Node x={x} y={y} label={text} color={color} />
          </g>
        ))}
        <circle cx={540} cy={980} r={112} fill="rgba(244,178,77,0.08)" stroke={palette.amber} strokeWidth={5} />
      </svg>
      <div style={{ position: "absolute", left: 110, right: 110, top: 1448, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <DataPanel label="用户感受" value="知道怎么用" color={palette.cyan} />
        <DataPanel label="迁移路径" value="连接已有设备" color={palette.green} />
      </div>
    </AbsoluteFill>
  );
};

const Launch: React.FC<{ frame: number }> = ({ frame }) => {
  const p = ease(progress(frame, scenes[5].start, scenes[5].end));
  return (
    <AbsoluteFill style={{ opacity: fadeScene(frame, scenes[5].start, scenes[5].end) }}>
      <Title kicker="第三层能力" title="消费电子式发布，把价格变成事件" />
      <div style={{ position: "absolute", left: 94, right: 94, top: 560, height: 315, background: "linear-gradient(145deg,#121A27,#080A0E)", border: `2px solid ${palette.line}` }}>
        <div style={{ position: "absolute", left: 50, right: 50, top: 74, height: 6, background: palette.cyan, transform: `scaleX(${p})`, transformOrigin: "left" }} />
        <div style={{ position: "absolute", left: 52, top: 122, color: palette.ink, fontSize: 60, fontWeight: 950 }}>发布会舞台</div>
        <div style={{ position: "absolute", left: 55, top: 205, color: palette.muted, fontSize: 26, fontWeight: 800 }}>参数 + 价格 + 情绪 + 社群传播</div>
      </div>
      <div style={{ position: "absolute", left: 105, right: 105, top: 985 }}>
        <DataPanel label="上市价格" value="21.59 万元起" note="不只是数字，也是传播事件" color={palette.green} />
      </div>
      <div style={{ position: "absolute", left: 105, right: 105, top: 1328, display: "flex", gap: 15, flexWrap: "wrap" }}>
        <Pill text="参数可传播" color={palette.cyan} />
        <Pill text="价格可讨论" color={palette.amber} />
        <Pill text="社群可扩散" color={palette.green} />
      </div>
    </AbsoluteFill>
  );
};

const Data: React.FC<{ frame: number }> = ({ frame }) => {
  const p = ease(progress(frame, scenes[6].start, scenes[6].end));
  return (
    <AbsoluteFill style={{ opacity: fadeScene(frame, scenes[6].start, scenes[6].end) }}>
      <Title kicker="数据验证" title="热度，最后要看经营结果" />
      <div style={{ position: "absolute", left: 85, right: 85, top: 500, display: "grid", gap: 22 }}>
        <DataPanel label="2024 EV等创新业务收入" value="约 321 亿元" color={palette.cyan} />
        <DataPanel label="相关业务毛利率" value="约 18.5%" note="毛利率，不是单车净利润" color={palette.amber} />
        <DataPanel label="2025-03" value="第 20 万辆整车交付" color={palette.green} />
      </div>
      <div style={{ position: "absolute", left: 105, right: 105, top: 1388 }}>
        <div style={{ color: palette.muted, fontSize: 26, fontWeight: 900, marginBottom: 20 }}>这个数据说明什么</div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Pill text="声量" color={palette.cyan} />
          <div style={{ color: palette.ink, fontSize: 40, fontWeight: 950 }}>{"->"}</div>
          <Pill text="履约" color={palette.green} />
          <div style={{ color: palette.ink, fontSize: 40, fontWeight: 950 }}>{"->"}</div>
          <Pill text="收入" color={palette.amber} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 86, right: 86, bottom: 220, height: 16, background: "rgba(247,250,252,0.14)" }}>
        <div style={{ width: `${p * 100}%`, height: 16, background: palette.cyan }} />
      </div>
    </AbsoluteFill>
  );
};

const Model: React.FC<{ frame: number }> = ({ frame }) => {
  const p = ease(progress(frame, scenes[7].start, scenes[7].end));
  const tags = ["用户信任", "品牌心智", "渠道触点", "生态入口", "发布会传播"];
  return (
    <AbsoluteFill style={{ opacity: fadeScene(frame, scenes[7].start, scenes[7].end) }}>
      <Title kicker="可迁移模型" title="跨界成功，不只看新产品" />
      <div style={{ position: "absolute", left: 76, right: 76, top: 560, color: palette.ink, fontSize: 50, lineHeight: 1.45, fontWeight: 950 }}>
        <div>跨界成功 ≠ 从零开始</div>
        <div style={{ color: palette.cyan, marginTop: 34 }}>跨界成功 = 新产品能力 × 旧资产迁移</div>
      </div>
      <div style={{ position: "absolute", left: 82, right: 82, top: 970, display: "flex", gap: 14, flexWrap: "wrap" }}>
        {tags.map((tag, i) => (
          <div key={tag} style={{ opacity: interpolate(p, [i * 0.1, i * 0.1 + 0.18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
            <Pill text={tag} color={[palette.cyan, palette.amber, palette.blue, palette.green, palette.violet][i]} />
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 90, right: 90, bottom: 290, color: palette.muted, fontSize: 30, lineHeight: 1.42, fontWeight: 760 }}>
        旧资产不能替代造车能力，但能让新产品更快被看见、被讨论、被尝试。
      </div>
    </AbsoluteFill>
  );
};

const End: React.FC<{ frame: number }> = ({ frame }) => {
  const p = ease(progress(frame, scenes[8].start, scenes[8].end));
  const finalOnly = sec(frame) > 169.0;
  return (
    <AbsoluteFill style={{ opacity: fadeScene(frame, scenes[8].start, scenes[8].end) }}>
      {!finalOnly ? (
        <>
          <Title title="小米 SU7 的故事，不只是车卖得好" sub="它更像一个商业提醒。" />
          <div style={{ position: "absolute", left: 95, right: 95, top: 760, color: palette.ink, fontSize: 48, lineHeight: 1.42, fontWeight: 930, opacity: p }}>
            真正值钱的是：
            <br />
            把过去积累的能力，
            <br />
            搬到一个更大的市场里。
          </div>
        </>
      ) : (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 80 }}>
          <div style={{ color: palette.ink, fontSize: 76, lineHeight: 1.18, fontWeight: 950 }}>
            跨界不是
            <br />
            从零开始
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

const CaptionLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const t = sec(frame);
  const cap = captions.find(([start, end]) => t >= start && t < end);
  if (!cap) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 74,
        right: 74,
        bottom: 96,
        minHeight: 84,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: palette.ink,
        fontSize: 41,
        fontWeight: 950,
        textAlign: "center",
        background: "rgba(5,7,10,0.72)",
        border: "1px solid rgba(247,250,252,0.16)",
      }}
    >
      {cap[2]}
    </div>
  );
};

export const XiaomiSu7BusinessStoryV3: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ fontFamily: "Inter, Microsoft YaHei, Arial, sans-serif" }}>
      <Background />
      {audioSegments.map((audio) => (
        <Sequence key={audio.id} from={Math.round(audio.start * FPS)}>
          <Audio src={staticFile(`xiaomi-su7-business-story-v3/${audio.id}.mp3`)} volume={1} />
        </Sequence>
      ))}
      <Hook frame={frame} />
      <Judgment frame={frame} />
      <Timeline frame={frame} />
      <Trust frame={frame} />
      <Ecosystem frame={frame} />
      <Launch frame={frame} />
      <Data frame={frame} />
      <Model frame={frame} />
      <End frame={frame} />
      <CaptionLayer />
    </AbsoluteFill>
  );
};
