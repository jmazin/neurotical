import { argmax } from "../utils.js";

function initNetwork(layerSizes) {
  return layerSizes.map((layerSize, l) => {
    const prevLayerSize = layerSizes[l - 1] || 0;

    return Array.from({ length: layerSize }, (_, i) =>
      l === 0
        ? {}
        : {
            name: `${l}-${i}`,
            weights: Array.from({ length: prevLayerSize }, () => (Math.random() * 2 - 1) * Math.sqrt(6 / prevLayerSize)),
            bias: 0,
            gradW: new Array(prevLayerSize).fill(0),
            gradB: 0,
          }
    );
  });
}

function forwardPass(input, network) {
  const inputLayer = network[0];

  for (let n = 0; n < inputLayer.length; n++) {
    inputLayer[n].act = input[n];
  }

  for (let l = 1; l < network.length; l++) {
    const prevLayer = network[l - 1];
    const layer = network[l];

    for (let n = 0; n < layer.length; n++) {
      const node = layer[n];

      let sum = node.bias;
      for (let i = 0; i < node.weights.length; i++) {
        sum += prevLayer[i].act * node.weights[i];
      }

      node.act = activation(sum);
    }
  }

  return network;
}

function activation(sum) {
  return 1 / (1 + Math.E ** -sum);
}

function computeOutput(input, network) {
  const outputs = forwardPass(input, network);
  const lastLayer = outputs[outputs.length - 1];

  const result = [];
  for (let i = 0; i < lastLayer.length; i++) {
    result.push(lastLayer[i].act);
  }

  return result;
}

function setParam(network, name, value, index = null) {
  const [l, n] = name.split("-").map(Number);
  // check if weight or bias
  if (index !== null) {
    network[l][n].weights[index] = value;
  } else {
    network[l][n].bias = value;
  }
}

function calcMetrics(network, data) {
  let cost = 0;
  let correct = 0;

  for (let i = 0; i < data.length; i++) {
    const { input, target } = data[i];
    const output = computeOutput(input, network);

    if (argmax(output) === target.indexOf(1)) {
      correct++;
    }

    cost += outputCost(output, target);
  }

  return { correct, cost: cost / data.length };
}

function outputCost(output, target) {
  let total = 0;

  for (let i = 0; i < output.length; i++) {
    total += nodeCost(output[i], target[i]);
  }

  return total;
}

function nodeCost(val, expected) {
  return (val - expected) ** 2;
}

export { initNetwork, computeOutput, setParam, calcMetrics };
export { learn } from "./finite-diff.js";
