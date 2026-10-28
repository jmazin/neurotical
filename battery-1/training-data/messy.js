import { toInput } from "../battery.js";

// Real days overlap: a quiet day survived on 45%, and a day of video calls died at 80%.
const diedAt = [5, 20, 30, 50, 60, 80];
const madeItAt = [45, 65, 75, 85, 90, 100];

export const data = [
  ...diedAt.map((percent) => ({ input: toInput(percent), target: 0 })),
  ...madeItAt.map((percent) => ({ input: toInput(percent), target: 1 })),
];
