// The two results, indexed by prediction: 0 = fail, 1 = pass.
export const RESULTS = [
  { label: "fail", color: "red", backgroundColor: [255, 0, 10] },
  { label: "pass", color: "blue", backgroundColor: [0, 150, 255] },
];

// Exam scores from 0–100% become inputs from −1 to 1, so 50% is 0.
export function toInput(score) {
  return score / 50 - 1;
}

export function toScore(input) {
  return (input + 1) * 50;
}
