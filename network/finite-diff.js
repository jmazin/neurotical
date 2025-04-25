import { calcMetrics } from "./network.js";

function learn(network, data, learnRate) {
  computeGradients(network, data);
  applyGradients(network, learnRate);
}

function computeGradients(network, data) {
  const { cost: origCost } = calcMetrics(network, data);

  const h = 0.0001;

  for (let l = 1; l < network.length; l++) {
    const layer = network[l];

    for (let n = 0; n < layer.length; n++) {
      const node = layer[n];

      // Compute gradient for each weight
      for (let j = 0; j < node.weights.length; j++) {
        node.weights[j] += h;
        const { cost: newCost } = calcMetrics(network, data);
        node.weights[j] -= h;
        node.gradW[j] = (newCost - origCost) / h;
      }

      // Compute gradient for bias
      node.bias += h;
      const { cost: newCost } = calcMetrics(network, data);
      node.bias -= h;
      node.gradB = (newCost - origCost) / h;
    }
  }
}

function applyGradients(network, learnRate) {
  for (let l = 1; l < network.length; l++) {
    const layer = network[l];

    for (let n = 0; n < layer.length; n++) {
      const node = layer[n];

      for (let i = 0; i < node.weights.length; i++) {
        node.weights[i] -= node.gradW[i] * learnRate;
      }

      node.bias -= node.gradB * learnRate;
    }
  }
}

export { learn };
