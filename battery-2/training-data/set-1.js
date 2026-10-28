// Battery level when leaving the house, and whether the phone lasted until bedtime.
const diedAt = [70];
const madeItAt = [85];

// Match the existing network's normalized input range: 0–100% becomes −1–1.
const died = diedAt.map((percent) => ({ input: [percent / 50 - 1], target: [0] }));
const madeIt = madeItAt.map((percent) => ({ input: [percent / 50 - 1], target: [1] }));

export const data = [...died, ...madeIt];
