import { toInput } from "../exam.js";

// Exam scores, with a pass mark between the last fail and the first pass.
const failScores = [10, 20, 30, 40, 50, 55, 65, 70, 75, 80];
const passScores = [90, 95];

export const data = [
  ...failScores.map((score) => ({ input: toInput(score), target: 0 })),
  ...passScores.map((score) => ({ input: toInput(score), target: 1 })),
];
