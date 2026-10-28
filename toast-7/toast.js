// The two outcomes, indexed by prediction: 0 = yuck (raw or burnt), 1 = perfect.
export const TOAST = [
  { label: "yuck", color: "red", predictionColor: [255, 0, 10] },
  { label: "perfect", color: "blue", predictionColor: [0, 150, 255] },
];

// Toaster settings from 0–100% become inputs from 0 to 1.
export function toInput(percent) {
  return [percent / 100];
}

export function toPercent(input) {
  return input[0] * 100;
}
