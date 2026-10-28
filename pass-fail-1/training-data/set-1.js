import { toInput } from "../exam.js";

// Exam scores, with a pass mark between the last fail and the first pass.
const failScores = [70];
const passScores = [85];

export const data = [
  ...failScores.map((score) => ({ input: toInput(score), target: 0 })),
  ...passScores.map((score) => ({ input: toInput(score), target: 1 })),
];
