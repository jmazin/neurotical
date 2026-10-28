// The two outcomes, indexed by prediction: 0 = yuck (raw or burnt), 1 = perfect.
export const TOAST = [
  { label: "yuck", color: "#e34948", predictionColor: [227, 73, 72] },
  { label: "perfect", color: "#eda100", predictionColor: [237, 161, 0] },
];

// Toaster settings from 0–100% become inputs from 0 to 1.
export function toInput(percent) {
  return [percent / 100];
}

export function toPercent(input) {
  return input[0] * 100;
}
