import { toInput } from "../toast.js";

// Real bread varies: a thick slice came out raw at 40%, and a thin one burnt at 62%.
const raw = [5, 15, 25, 32, 40];
const perfect = [38, 45, 50, 58, 68];
const burnt = [62, 75, 82, 90, 98];

export const data = [
  ...raw.map((percent) => ({ input: toInput(percent), target: [0] })),
  ...perfect.map((percent) => ({ input: toInput(percent), target: [1] })),
  ...burnt.map((percent) => ({ input: toInput(percent), target: [0] })),
];
