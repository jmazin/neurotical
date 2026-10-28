// An output at or above the threshold predicts the phone makes it through the day.
export const THRESHOLD = 0;

export function createNeuron() {
  return { bias: 0 };
}

// The output is the sum of the input and the bias.
export function computeOutput(neuron, input) {
  return input + neuron.bias;
}

// 1 = made it, 0 = died, matching the targets in the training data.
export function predict(output) {
  return output >= THRESHOLD ? 1 : 0;
}

// How many examples the neuron predicts correctly.
export function countCorrect(neuron, data) {
  return data.filter(({ input, target }) => predict(computeOutput(neuron, input)) === target).length;
}
