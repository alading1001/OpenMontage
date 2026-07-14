export const parentMathTimeline = {
  "total_seconds": 110.068,
  "segments": [
    {
      "id": "hook",
      "scene": "hook",
      "text": "孩子能从一数到六，不代表他已经理解哪边更多。",
      "after_gap": 0.3,
      "start": 0.2,
      "duration": 4.44,
      "end": 4.64
    },
    {
      "id": "problem",
      "scene": "two_vs_four",
      "text": "很多家长会发现，孩子已经会数数了，但问他哪边更多，还是会犹豫。",
      "after_gap": 0.35,
      "start": 4.94,
      "duration": 6.264,
      "end": 11.204
    },
    {
      "id": "concept",
      "scene": "two_vs_four",
      "text": "这不是孩子不会数学，而是还没有真正建立数量比较的概念。",
      "after_gap": 0.5,
      "start": 11.554,
      "duration": 5.064,
      "end": 16.618
    },
    {
      "id": "wrong",
      "scene": "spread_vs_tight",
      "text": "第一步，不要只问哪一排看起来更长。孩子可能比较的是占了多少地方，不是在比较有几个。",
      "after_gap": 0.55,
      "start": 17.118,
      "duration": 8.448,
      "end": 25.566
    },
    {
      "id": "method",
      "scene": "aligned",
      "text": "更好的方法，是把两组东西摆整齐，然后陪孩子一个一个数。",
      "after_gap": 0.3,
      "start": 26.116,
      "duration": 5.64,
      "end": 31.756
    },
    {
      "id": "count_left",
      "scene": "aligned",
      "text": "左边是一、二，一共有两块。",
      "after_gap": 0.35,
      "start": 32.056,
      "duration": 4.032,
      "end": 36.088
    },
    {
      "id": "count_right",
      "scene": "aligned",
      "text": "右边是一、二、三、四，一共有四块。",
      "after_gap": 0.4,
      "start": 36.438,
      "duration": 4.44,
      "end": 40.878
    },
    {
      "id": "ask",
      "scene": "aligned",
      "text": "数完以后，再问孩子：哪边更多？",
      "after_gap": 0.45,
      "start": 41.278,
      "duration": 3.24,
      "end": 44.518
    },
    {
      "id": "repair",
      "scene": "labels",
      "text": "家长可以接着问：左边有几个？右边有几个？哪边更多？答错了，就再陪他数一遍。",
      "after_gap": 0.45,
      "start": 44.968,
      "duration": 8.76,
      "end": 53.728
    },
    {
      "id": "answer",
      "scene": "labels",
      "text": "让他自己发现，右边有四块，左边有两块。右边更多，左边更少。",
      "after_gap": 0.65,
      "start": 54.178,
      "duration": 7.272,
      "end": 61.45
    },
    {
      "id": "change",
      "scene": "rearranged",
      "text": "还可以故意换一种摆法：把四块积木摆得紧一点，把两块积木摆得开一点。",
      "after_gap": 0.3,
      "start": 62.1,
      "duration": 5.616,
      "end": 67.716
    },
    {
      "id": "recount",
      "scene": "rearranged",
      "text": "这时候让孩子重新数一数。队伍排得开，或者排得紧，不会让积木变多或变少。右边仍然是四块。",
      "after_gap": 0.6,
      "start": 68.016,
      "duration": 9.024,
      "end": 77.04
    },
    {
      "id": "equal",
      "scene": "equal",
      "text": "最后，再给孩子一个一样多的例子。左边三个水果，右边也是三个。这一次，两边一样多。",
      "after_gap": 0.65,
      "start": 77.64,
      "duration": 7.992,
      "end": 85.632
    },
    {
      "id": "offline",
      "scene": "offline",
      "text": "看完以后，建议家长直接关掉视频。拿两堆积木、玩具或者水果，一堆放两个，一堆放四个。",
      "after_gap": 0.3,
      "start": 86.282,
      "duration": 8.472,
      "end": 94.754
    },
    {
      "id": "practice",
      "scene": "offline",
      "text": "先让孩子自己数，再问哪边更多、哪边更少。换一种物品，再做一次。",
      "after_gap": 0.55,
      "start": 95.054,
      "duration": 6.24,
      "end": 101.294
    },
    {
      "id": "conclusion",
      "scene": "offline",
      "text": "数学启蒙不是让孩子背答案，而是让他在真实生活里发现数量关系。",
      "after_gap": 2.2,
      "start": 101.844,
      "duration": 6.024,
      "end": 107.868
    }
  ]
} as const;
export const PARENT_MATH_DURATION_FRAMES = Math.ceil(parentMathTimeline.total_seconds * 30);
