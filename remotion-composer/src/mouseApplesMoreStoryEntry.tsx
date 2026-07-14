import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {MouseApplesMoreStory} from './MouseApplesMoreStory';
import {MOUSE_APPLES_MORE_STORY_DURATION_FRAMES} from './MouseApplesMoreStoryTimeline';

const Root: React.FC = () => <Composition id="MouseApplesMoreStory" component={MouseApplesMoreStory} durationInFrames={MOUSE_APPLES_MORE_STORY_DURATION_FRAMES} fps={30} width={1080} height={1920} />;
registerRoot(Root);
