const safePoints = [[0.3, 0.2]];

const poisonPoints = [[0.5, -0.5]];

const safe = safePoints.map((input) => ({ input, label: [1, 0] }));
const poison = poisonPoints.map((input) => ({ input, label: [0, 1] }));

const data = [...safe, ...poison];

export { data };
