import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {MiceFruitMoreLess} from './MiceFruitMoreLess';
import {MICE_FRUIT_MORE_LESS_DURATION_FRAMES} from './MiceFruitMoreLessTimeline';

const Root: React.FC = () => <Composition id="MiceFruitMoreLess" component={MiceFruitMoreLess} durationInFrames={MICE_FRUIT_MORE_LESS_DURATION_FRAMES} fps={30} width={1080} height={1920} />;
registerRoot(Root);
