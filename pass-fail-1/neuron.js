// An output at or above the threshold predicts pass.
export const THRESHOLD = 0;

export function createNeuron() {
  return { bias: 0 };
}

// The weight is fixed at 1, so the output is the input plus the bias.
export function computeOutput(neuron, input) {
  return input + neuron.bias;
}

// 1 = pass, 0 = fail, matching the targets in the training data.
export function predict(output) {
  return output >= THRESHOLD ? 1 : 0;
}

// How many examples the neuron predicts correctly.
export function countCorrect(neuron, data) {
  return data.filter(({ input, target }) => predict(computeOutput(neuron, input)) === target).length;
}
