function initNetwork() {
  return [{ weight: 1, bias: 0 }];
}

function setParam(network, index, value, param = "bias") {
  network[index][param] = value;
}

function computeOutput(input, network) {
  const sum = input[0] * network[0].weight + network[0].bias;
  return sum;
}

// Wrong-side loss: zero on the correct side of 0, otherwise how far past 0 the output is.
function cost(output, target) {
  const direction = target[0] === 1 ? 1 : -1;
  return Math.max(0, -direction * output);
}

function calcMetrics(network, data) {
  let totalCost = 0;
  let correct = 0;
  for (const { input, target } of data) {
    const output = computeOutput(input, network);
    totalCost += cost(output, target);
    correct += Number(Number(output >= 0) === target[0]);
  }
  return { correct, cost: totalCost / data.length };
}

function finiteDiff(network, data, learnRate) {
  if (!Number.isFinite(learnRate) || learnRate <= 0) return;
  const node = network[0];
  const { weight, bias } = node;
  const h = 0.0001;
  const { cost: originalCost } = calcMetrics(network, data);
  node.bias = bias + h;
  const { cost: biasCost } = calcMetrics(network, data);
  node.bias = bias;

  node.weight = weight + h;
  const { cost: weightCost } = calcMetrics(network, data);
  node.weight = weight;

  const biasGradient = (biasCost - originalCost) / h;
  const weightGradient = (weightCost - originalCost) / h;
  node.bias = bias - learnRate * biasGradient;
  node.weight = weight - learnRate * weightGradient;
}

export { initNetwork, computeOutput, setParam, cost, calcMetrics, finiteDiff };
