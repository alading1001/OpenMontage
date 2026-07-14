export const mouseApplesMoreStoryTimeline={
  "fps": 30,
  "total_seconds": 58.998,
  "segments": [
    {
      "id": "parent_hook",
      "text": "孩子会数数，不代表已经理解哪边更多。",
      "subtitle": "孩子会数数，还不会比多少？",
      "after_gap": 0.1,
      "file": "parent_hook.mp3",
      "start": 0.2,
      "duration": 3.624,
      "end": 3.824
    },
    {
      "id": "hook",
      "text": "小朋友，帮小老鼠看一看，哪边苹果更多？",
      "subtitle": "哪边的苹果更多？",
      "after_gap": 0.2,
      "file": "hook.mp3",
      "start": 3.924,
      "duration": 4.44,
      "end": 8.364
    },
    {
      "id": "left_intro",
      "text": "我们先数左边。",
      "subtitle": "先数左边",
      "after_gap": 0.2,
      "file": "left_intro.mp3",
      "start": 8.564,
      "duration": 1.464,
      "end": 10.028
    },
    {
      "id": "left_one",
      "text": "一。",
      "subtitle": "",
      "after_gap": 0.8,
      "file": "left_one.mp3",
      "start": 10.228,
      "duration": 0.648,
      "end": 10.876
    },
    {
      "id": "left_two",
      "text": "二。",
      "subtitle": "",
      "after_gap": 0.55,
      "file": "left_two.mp3",
      "start": 11.676,
      "duration": 0.84,
      "end": 12.516
    },
    {
      "id": "left_total",
      "text": "左边一共有两个苹果。",
      "subtitle": "左边有 2 个",
      "after_gap": 0.2,
      "file": "left_total.mp3",
      "start": 13.066,
      "duration": 2.04,
      "end": 15.106
    },
    {
      "id": "right_intro",
      "text": "再数右边。",
      "subtitle": "再数右边",
      "after_gap": 0.15,
      "file": "right_intro.mp3",
      "start": 15.306,
      "duration": 1.464,
      "end": 16.77
    },
    {
      "id": "right_one",
      "text": "一。",
      "subtitle": "",
      "after_gap": 0.65,
      "file": "right_one.mp3",
      "start": 16.92,
      "duration": 0.672,
      "end": 17.592
    },
    {
      "id": "right_two",
      "text": "二。",
      "subtitle": "",
      "after_gap": 0.65,
      "file": "right_two.mp3",
      "start": 18.242,
      "duration": 0.648,
      "end": 18.89
    },
    {
      "id": "right_three",
      "text": "三。",
      "subtitle": "",
      "after_gap": 0.65,
      "file": "right_three.mp3",
      "start": 19.54,
      "duration": 0.84,
      "end": 20.38
    },
    {
      "id": "right_four",
      "text": "四。",
      "subtitle": "",
      "after_gap": 0.3,
      "file": "right_four.mp3",
      "start": 21.03,
      "duration": 0.84,
      "end": 21.87
    },
    {
      "id": "right_total",
      "text": "右边有四个苹果。",
      "subtitle": "右边有 4 个",
      "after_gap": 0.2,
      "file": "right_total.mp3",
      "start": 22.17,
      "duration": 1.632,
      "end": 23.802
    },
    {
      "id": "question",
      "text": "现在轮到你啦。哪边的苹果更多？",
      "subtitle": "想一想，哪边更多？",
      "after_gap": 4.0,
      "file": "question.mp3",
      "start": 24.002,
      "duration": 3.6,
      "end": 27.602
    },
    {
      "id": "answer",
      "text": "右边四个，左边两个。右边更多，左边更少。",
      "subtitle": "右边更多，左边更少",
      "after_gap": 0.25,
      "file": "answer.mp3",
      "start": 31.602,
      "duration": 5.424,
      "end": 37.026
    },
    {
      "id": "rearrange",
      "text": "苹果换一种摆法。不要只看哪一排更长。摆得开、摆得紧，数量不会自己改变。右边还是更多。",
      "subtitle": "摆法换了，数量没变",
      "after_gap": 0.2,
      "file": "rearrange.mp3",
      "start": 37.276,
      "duration": 8.856,
      "end": 46.132
    },
    {
      "id": "equal",
      "text": "最后再看一种情况。左边三个，右边也是三个。这一次，两边一样多。",
      "subtitle": "两边一样多",
      "after_gap": 0.25,
      "file": "equal.mp3",
      "start": 46.332,
      "duration": 6.768,
      "end": 53.1
    },
    {
      "id": "offline",
      "text": "关掉视频，用水果或积木再玩一次。",
      "subtitle": "换成家里的东西，再玩一次",
      "after_gap": 2.0,
      "file": "offline.mp3",
      "start": 53.35,
      "duration": 3.648,
      "end": 56.998
    }
  ]
} as const;
export const MOUSE_APPLES_MORE_STORY_DURATION_FRAMES=Math.ceil(mouseApplesMoreStoryTimeline.total_seconds*30);
