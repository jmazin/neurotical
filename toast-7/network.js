// Layers of neurons: one input, a hidden layer of two neurons, and one output neuron.
// Each neuron has one weight for every neuron in the layer before it, and one bias.
function initNetwork() {
  const random = () => Math.random() * 2 - 1;
  return [
    [{ name: "input" }],
    [
      { name: "hidden 1", weights: [random()], bias: random() },
      { name: "hidden 2", weights: [random()], bias: random() },
    ],
    [{ name: "output", weights: [random(), random()], bias: random() }],
  ];
}

// Send an input through the network, layer by layer.
// Returns every neuron's sum and activation in the same shape as the network:
// sums[l][n] and acts[l][n] belong to network[l][n]. The input layer has no sums.
function forwardPass(input, network) {
  const sums = [[]];
  const acts = [input];

  for (let l = 1; l < network.length; l++) {
    const prevActs = acts[l - 1];
    const layer = network[l];
    const layerSums = [];
    const layerActs = [];

    for (let n = 0; n < layer.length; n++) {
      const neuron = layer[n];

      let sum = neuron.bias;
      for (let i = 0; i < neuron.weights.length; i++) {
        sum += prevActs[i] * neuron.weights[i];
      }

      layerSums.push(sum);
      layerActs.push(activation(sum));
    }

    sums.push(layerSums);
    acts.push(layerActs);
  }

  return { sums, acts };
}

function activation(sum) {
  return 1 / (1 + Math.exp(-sum));
}

function computeOutput(input, network) {
  return forwardPass(input, network).acts.at(-1)[0];
}

function cost(output, target) {
  return (output - target[0]) ** 2;
}

function calcMetrics(network, data) {
  let totalCost = 0;
  let correct = 0;
  for (const { input, target } of data) {
    const output = computeOutput(input, network);
    totalCost += cost(output, target);
    correct += Number(Number(output >= 0.5) === target[0]);
  }
  return { correct, cost: totalCost / data.length };
}

function finiteDiff(network, data, learnRate) {
  if (!Number.isFinite(learnRate) || learnRate <= 0) return;
  const h = 0.0001;
  const { cost: originalCost } = calcMetrics(network, data);

  // Nudge each weight and bias in turn, and measure how much the cost changes.
  for (let l = 1; l < network.length; l++) {
    const layer = network[l];

    for (let n = 0; n < layer.length; n++) {
      const neuron = layer[n];

      neuron.weightGradients = [];
      for (let i = 0; i < neuron.weights.length; i++) {
        neuron.weights[i] += h;
        const { cost: newCost } = calcMetrics(network, data);
        neuron.weights[i] -= h;
        neuron.weightGradients[i] = (newCost - originalCost) / h;
      }

      neuron.bias += h;
      const { cost: newCost } = calcMetrics(network, data);
      neuron.bias -= h;
      neuron.biasGradient = (newCost - originalCost) / h;
    }
  }

  // Then move every weight and bias downhill.
  for (let l = 1; l < network.length; l++) {
    const layer = network[l];

    for (let n = 0; n < layer.length; n++) {
      const neuron = layer[n];

      for (let i = 0; i < neuron.weights.length; i++) {
        neuron.weights[i] -= learnRate * neuron.weightGradients[i];
      }
      neuron.bias -= learnRate * neuron.biasGradient;
    }
  }
}

export { initNetwork, forwardPass, computeOutput, calcMetrics, finiteDiff };
