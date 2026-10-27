function initNetwork() {
  return [{ bias: 0 }];
}

function setParam(network, name, value) {
  network[0].bias = value;
}

function computeOutput(input, network) {
  const sum = input[0] + network[0].bias;
  return sum;
}

function cost(output, target) {
  const direction = target[0] === 1 ? 1 : -1;
  console.log(output, direction);
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
  const bias = node.bias;
  const h = 0.0001;
  const { cost: originalCost } = calcMetrics(network, data);
  node.bias = bias + h;
  const { cost: changedCost } = calcMetrics(network, data);
  const gradient = (changedCost - originalCost) / h;

  node.bias = bias - learnRate * gradient;
}

export { initNetwork, computeOutput, setParam, calcMetrics, finiteDiff };
