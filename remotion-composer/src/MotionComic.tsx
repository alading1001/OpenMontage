import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

type MotionComicScene = {
  id: string;
  image: string;
  start: number;
  duration: number;
  caption: string;
  motion: "push-in" | "pull-back" | "pan-left" | "pan-right" | "drift-up" | "drift-down";
};

export type MotionComicProps = {
  scenes: MotionComicScene[];
  backgroundColor?: string;
};

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const SceneImage: React.FC<{ scene: MotionComicScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const durationFrames = Math.max(1, Math.round(scene.duration * fps));
  const progress = interpolate(frame, [0, durationFrames], [0, 1], clamp);
  const fadeIn = interpolate(frame, [0, 14], [0, 1], clamp);
  const fadeOut = interpolate(frame, [durationFrames - 14, durationFrames], [1, 0], clamp);
  const opacity = Math.min(fadeIn, fadeOut);

  let scale = 0.93;
  let x = 0;
  let y = 0;

  if (scene.motion === "push-in") {
    scale = interpolate(progress, [0, 1], [0.9, 0.97], clamp);
  } else if (scene.motion === "pull-back") {
    scale = interpolate(progress, [0, 1], [0.97, 0.91], clamp);
  } else if (scene.motion === "pan-left") {
    scale = 0.95;
    x = interpolate(progress, [0, 1], [18, -18], clamp);
  } else if (scene.motion === "pan-right") {
    scale = 0.95;
    x = interpolate(progress, [0, 1], [-18, 18], clamp);
  } else if (scene.motion === "drift-up") {
    scale = 0.94;
    y = interpolate(progress, [0, 1], [18, -18], clamp);
  } else if (scene.motion === "drift-down") {
    scale = 0.94;
    y = interpolate(progress, [0, 1], [-18, 18], clamp);
  }

  return (
    <AbsoluteFill style={{ opacity, backgroundColor: "#f7f1e8" }}>
      <Img
        src={staticFile(scene.image)}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "blur(34px)",
          transform: "scale(1.18)",
          opacity: 0.35,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(247,241,232,0.58) 0%, rgba(247,241,232,0.18) 42%, rgba(247,241,232,0.68) 100%)",
        }}
      />
      <Img
        src={staticFile(scene.image)}
        style={{
          position: "absolute",
          left: "50%",
          top: "46%",
          width: "100%",
          height: "auto",
          maxHeight: "87%",
          objectFit: "contain",
          transform: `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${scale})`,
          transformOrigin: "50% 50%",
          filter: "drop-shadow(0 18px 28px rgba(70, 52, 36, 0.18))",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 72,
          right: 72,
          bottom: 88,
          padding: "24px 34px",
          borderRadius: 28,
          background: "rgba(255, 252, 245, 0.92)",
          border: "2px solid rgba(67, 50, 35, 0.16)",
          boxShadow: "0 16px 34px rgba(67, 50, 35, 0.16)",
          color: "#2e261f",
          fontFamily:
            '"Microsoft YaHei", "PingFang SC", "Noto Sans CJK SC", system-ui, sans-serif',
          fontSize: 42,
          fontWeight: 700,
          lineHeight: 1.34,
          textAlign: "center",
          letterSpacing: 0,
        }}
      >
        {scene.caption}
      </div>
    </AbsoluteFill>
  );
};

export const MotionComic: React.FC<MotionComicProps> = ({
  scenes,
  backgroundColor = "#f7f1e8",
}) => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor }}>
      {scenes.map((scene) => (
        <Sequence
          key={scene.id}
          from={Math.round(scene.start * fps)}
          durationInFrames={Math.round(scene.duration * fps)}
        >
          <SceneImage scene={scene} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
