import { toInput } from "../battery.js";

// Battery level when leaving the house, and whether the phone lasted until bedtime.
const diedAt = [10, 25, 40, 55];
const madeItAt = [70, 80, 90, 100];

export const data = [
  ...diedAt.map((percent) => ({ input: toInput(percent), target: 0 })),
  ...madeItAt.map((percent) => ({ input: toInput(percent), target: 1 })),
];
