import { forwardPass, costDeriv, activationDeriv } from "./network.js";

function learn(network, data, learnRate) {
  clear(network);
  computeGradients(network, data);
  applyGradients(network, learnRate, data.length);
}

function computeGradients(network, data) {
  // For every input in the dataset, compute and accumulate gradients for each weight and bias.

  for (let d = 0; d < data.length; d++) {
    const { input, target } = data[d];
    forwardPass(input, network);
    const outputLayer = network[network.length - 1];
    const prevLayer = network[network.length - 2];

    // For every node in the output layer:
    for (let n = 0; n < outputLayer.length; n++) {
      const node = outputLayer[n];

      const dCost_dActivation = costDeriv(node.act, target[n]);
      const dActivation_dSum = activationDeriv(node.sum);

      node.dCost_dSum = dCost_dActivation * dActivation_dSum;

      for (let w = 0; w < node.weights.length; w++) {
        // gradW[w] accumulates the total gradient over all training points
        node.gradW[w] += prevLayer[w].act * node.dCost_dSum;
      }

      node.gradB += node.dCost_dSum;
    }

    // hidden
    if (network.length > 2) {
      for (let l = network.length - 2; l > 0; l--) {
        const layer = network[l];
        const nextLayer = network[l + 1];
        const prevLayer = network[l - 1];

        for (let n = 0; n < layer.length; n++) {
          const node = layer[n];
          let dCost_dActivation = 0;

          for (let j = 0; j < nextLayer.length; j++) {
            const next = nextLayer[j];
            dCost_dActivation += next.weights[n] * next.dCost_dSum;
          }

          const dActivation_dSum = activationDeriv(node.sum);
          node.dCost_dSum = dCost_dActivation * dActivation_dSum;

          for (let w = 0; w < node.weights.length; w++) {
            node.gradW[w] += prevLayer[w].act * node.dCost_dSum;
          }

          node.gradB += node.dCost_dSum;
        }
      }
    }
  }
}

function applyGradients(network, learnRate, size) {
  for (let l = 1; l < network.length; l++) {
    const layer = network[l];

    for (let n = 0; n < layer.length; n++) {
      const node = layer[n];
      for (let w = 0; w < node.weights.length; w++) {
        node.weights[w] -= (node.gradW[w] * learnRate) / size;
      }
      node.bias -= (node.gradB * learnRate) / size;
    }
  }
}

function clear(network) {
  for (let l = 1; l < network.length; l++) {
    const layer = network[l];
    const prev = network[l - 1];
    for (let n = 0; n < layer.length; n++) {
      const node = layer[n];
      node.gradW = new Array(prev.length).fill(0);
      node.gradB = 0;
    }
  }
}

export { learn };
