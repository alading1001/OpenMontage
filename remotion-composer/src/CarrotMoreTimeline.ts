export const carrotMoreTimeline = {
  totalSeconds: 60.2,
  segments: [
    { id: '01-opening', start: 0, duration: 6.29, scene: 'opening', caption: '哪边的胡萝卜更多？' },
    { id: '02-left', start: 6.7, duration: 4.51, scene: 'left', caption: '左边：1、2，共2根' },
    { id: '03-right', start: 11.6, duration: 5.47, scene: 'right', caption: '跟着数一数：1、2、3、4' },
    { id: '04-ask', start: 17.5, duration: 2.42, scene: 'ask', caption: '你来找一找' },
    { id: 'wait', start: 19.92, duration: 4.0, scene: 'ask', caption: '哪边的胡萝卜更多？' },
    { id: '05-answer', start: 24.2, duration: 6.72, scene: 'answer', caption: '右边更多 · 左边更少' },
    { id: '06-rearrange', start: 31.1, duration: 10.39, scene: 'rearrange', caption: '摆得开、摆得紧，数量不会改变' },
    { id: '07-equal', start: 41.9, duration: 4.7, scene: 'equal', caption: '两边一样多' },
    { id: '08-closing', start: 47.0, duration: 10.27, scene: 'closing', caption: '先数清楚，再比较多少' },
  ],
} as const;

export const CARROT_MORE_DURATION_FRAMES = Math.ceil(carrotMoreTimeline.totalSeconds * 30);
