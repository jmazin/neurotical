import { toInput } from "../toast.js";

// Toaster settings: too low is raw, too high is burnt, and only the middle is perfect.
const raw = [5, 15, 25, 32];
const perfect = [42, 50, 58, 64];
const burnt = [74, 82, 90, 98];

export const data = [
  ...raw.map((percent) => ({ input: toInput(percent), target: [0] })),
  ...perfect.map((percent) => ({ input: toInput(percent), target: [1] })),
  ...burnt.map((percent) => ({ input: toInput(percent), target: [0] })),
];
