export const fruitTimeline = {
  "total_seconds": 96.796,
  "segments": [
    {
      "id": "hook",
      "scene": "basket",
      "text": "孩子会从一数到六，为什么还是分不清哪边更多？",
      "after_gap": 0.25,
      "start": 0.2,
      "duration": 4.44,
      "end": 4.64
    },
    {
      "id": "relation",
      "scene": "basket",
      "text": "因为会数数，和理解数量关系，是两件事。",
      "after_gap": 0.45,
      "start": 4.89,
      "duration": 4.008,
      "end": 8.898
    },
    {
      "id": "first_step",
      "scene": "takeout",
      "text": "教孩子比较多少，第一步不是直接问答案。先让他一个一个数。",
      "after_gap": 0.3,
      "start": 9.348,
      "duration": 5.616,
      "end": 14.964
    },
    {
      "id": "left_count",
      "scene": "rows",
      "text": "左边是一、二，一共有两个苹果。",
      "after_gap": 0.3,
      "start": 15.264,
      "duration": 3.624,
      "end": 18.888
    },
    {
      "id": "right_count",
      "scene": "rows",
      "text": "右边是一、二、三、四，一共有四个苹果。",
      "after_gap": 0.45,
      "start": 19.188,
      "duration": 5.064,
      "end": 24.252
    },
    {
      "id": "compare",
      "scene": "pairing",
      "text": "现在再进行比较。左边有两个，右边有四个。",
      "after_gap": 0.25,
      "start": 24.702,
      "duration": 4.632,
      "end": 29.334
    },
    {
      "id": "extra",
      "scene": "pairing",
      "text": "右边多出来了两个。所以右边更多，左边更少。",
      "after_gap": 0.55,
      "start": 29.584,
      "duration": 4.464,
      "end": 34.048
    },
    {
      "id": "change",
      "scene": "spread",
      "text": "接下来，可以故意换一种摆法。把四个苹果摆得紧一点，把两个苹果摆得开一点。",
      "after_gap": 0.35,
      "start": 34.598,
      "duration": 7.032,
      "end": 41.63
    },
    {
      "id": "hesitate",
      "scene": "spread",
      "text": "这时候，孩子可能会觉得左边更多。不要马上告诉他答案。",
      "after_gap": 0.3,
      "start": 41.98,
      "duration": 5.232,
      "end": 47.212
    },
    {
      "id": "recount",
      "scene": "recount",
      "text": "我们再一个一个数。虽然摆法变了，但左边还是两个，右边还是四个。",
      "after_gap": 0.3,
      "start": 47.512,
      "duration": 5.832,
      "end": 53.344
    },
    {
      "id": "quantity",
      "scene": "pairing",
      "text": "摆得开、摆得紧，不会让苹果变多或变少。所以右边还是更多。",
      "after_gap": 0.7,
      "start": 53.644,
      "duration": 5.424,
      "end": 59.068
    },
    {
      "id": "banana",
      "scene": "banana",
      "text": "最后，再给孩子看一个一样多的例子。左边三根香蕉，右边也是三根。",
      "after_gap": 0.3,
      "start": 59.768,
      "duration": 5.664,
      "end": 65.432
    },
    {
      "id": "equal",
      "scene": "banana",
      "text": "重新数一数，两边一样多。",
      "after_gap": 0.65,
      "start": 65.732,
      "duration": 2.832,
      "end": 68.564
    },
    {
      "id": "tools",
      "scene": "tools",
      "text": "家长不需要准备专门教具。苹果、香蕉、积木、玩具都可以。",
      "after_gap": 0.25,
      "start": 69.214,
      "duration": 6.072,
      "end": 75.286
    },
    {
      "id": "practice",
      "scene": "tools",
      "text": "先让孩子一个一个数，再问哪边更多、哪边更少，或者一样多。",
      "after_gap": 0.35,
      "start": 75.536,
      "duration": 5.64,
      "end": 81.176
    },
    {
      "id": "offline",
      "scene": "family",
      "text": "看完以后，关掉视频，陪孩子在线下做一次。换一种物品、换一种摆法，再试一次。",
      "after_gap": 0.35,
      "start": 81.526,
      "duration": 7.656,
      "end": 89.182
    },
    {
      "id": "conclusion",
      "scene": "family",
      "text": "数学启蒙不是背答案，而是在生活里发现数量关系。",
      "after_gap": 2.2,
      "start": 89.532,
      "duration": 5.064,
      "end": 94.596
    }
  ]
} as const;
export const FRUIT_DURATION_FRAMES=Math.ceil(fruitTimeline.total_seconds*30);
