export const appleMoreTimeline = {
  totalSeconds: 61.6,
  segments: [
    { id: '01-opening', start: 0, duration: 6.48, scene: 'opening', caption: '哪边的苹果更多？' },
    { id: '02-left', start: 6.75, duration: 5.21, scene: 'left', caption: '左边：1、2，共2个' },
    { id: '03-right', start: 12.25, duration: 6.43, scene: 'right', caption: '跟着数一数' },
    { id: '04-ask', start: 18.95, duration: 2.9, scene: 'ask', caption: '你来找一找' },
    { id: 'wait', start: 21.85, duration: 2.0, scene: 'ask', caption: '哪边的苹果更多？' },
    { id: '05-answer', start: 24.05, duration: 5.16, scene: 'answer', caption: '右边更多 · 左边更少' },
    { id: '06-rearrange', start: 29.45, duration: 11.86, scene: 'rearrange', caption: '摆得开、摆得紧，数量不会改变' },
    { id: '07-equal', start: 41.55, duration: 5.9, scene: 'equal', caption: '两边一样多' },
    { id: '08-closing', start: 47.75, duration: 11.47, scene: 'closing', caption: '先数清楚，再比较多少' },
  ],
} as const;
export const APPLE_MORE_DURATION_FRAMES = Math.ceil(appleMoreTimeline.totalSeconds * 30);
