// The two outcomes, indexed by prediction: 0 = phone died, 1 = made it through the day.
export const RESULTS = [
  { label: "died", color: "#e34948", backgroundColor: [227, 73, 72] },
  { label: "made it", color: "#2a78d6", backgroundColor: [42, 120, 214] },
];

// Battery levels from 0–100% become inputs from 0 to 1.
export function toInput(percent) {
  return percent / 100;
}

export function toPercent(input) {
  return input * 100;
}
