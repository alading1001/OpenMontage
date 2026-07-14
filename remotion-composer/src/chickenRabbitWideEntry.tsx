import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {ChickenRabbitWide} from './ChickenRabbitWide';

const DURATION_IN_FRAMES = 3032;

const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="ChickenRabbitWide"
      component={ChickenRabbitWide}
      durationInFrames={DURATION_IN_FRAMES}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};

registerRoot(RemotionRoot);
