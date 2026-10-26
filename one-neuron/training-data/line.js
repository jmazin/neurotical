// Exam scores, with a pass mark between the last fail and the first pass.
const failScores = [10, 20, 30, 40, 50, 55];
const passScores = [65, 70, 75, 80, 90, 95];

// Match the existing network's normalized input range: 0–100% becomes −1–1.
const fail = failScores.map((score) => ({ input: [score / 50 - 1], target: [1, 0] }));
const pass = passScores.map((score) => ({ input: [score / 50 - 1], target: [0, 1] }));

export const data = [...fail, ...pass];
