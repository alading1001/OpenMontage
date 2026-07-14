import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {MOUSE_FRUIT_DURATION_FRAMES, MouseFruitSplit} from './MouseFruitSplit';

const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="MouseFruitSplit"
      component={MouseFruitSplit}
      durationInFrames={MOUSE_FRUIT_DURATION_FRAMES}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};

registerRoot(RemotionRoot);
