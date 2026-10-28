// The two outcomes, indexed by prediction: 0 = phone died, 1 = made it through the day.
export const RESULTS = [
  { label: "died", color: "red", backgroundColor: [255, 0, 10] },
  { label: "made it", color: "blue", backgroundColor: [0, 150, 255] },
];

// Battery levels from 0–100% become inputs from 0 to 1.
export function toInput(percent) {
  return percent / 100;
}

export function toPercent(input) {
  return input * 100;
}
