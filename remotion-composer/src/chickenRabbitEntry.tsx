import { Composition, registerRoot } from "remotion";
import { ChickenRabbit } from "./ChickenRabbit";

const Root: React.FC = () => (
  <Composition
    id="ChickenRabbit"
    component={ChickenRabbit}
    durationInFrames={30 * 101}
    fps={30}
    width={1080}
    height={1920}
    defaultProps={{}}
  />
);

registerRoot(Root);
