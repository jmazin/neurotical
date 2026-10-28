function initNetwork() {
  return [{ bias: 0 }];
}

function setParam(network, index, value, param = "bias") {
  network[index][param] = value;
}

function computeOutput(input, network) {
  // The weight is fixed at 1, so the output is the raw sum.
  const sum = input[0] + network[0].bias;
  return sum;
}

function calcMetrics(network, data) {
  let correct = 0;
  for (const { input, target } of data) {
    const output = computeOutput(input, network);
    correct += Number(Number(output >= 0) === target[0]);
  }
  return { correct };
}

export { initNetwork, computeOutput, setParam, calcMetrics };
