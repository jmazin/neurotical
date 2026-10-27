function initNetwork() {
  return [[{}], [{ name: "1-0", bias: 0 }]];
}

function computeOutput(input, network) {
  // Fixed weight = 1; the output is the raw sum.
  return input[0] + network[1][0].bias;
}

function setParam(network, name, value) {
  const [l, n] = name.split("-").map(Number);
  network[l][n].bias = value;
}

function cost(output, direction) {
  return Math.max(0, -direction * output);
}

function calcMetrics(network, data) {
  let totalCost = 0;
  let correct = 0;
  for (const { input, target } of data) {
    const output = computeOutput(input, network);
    const direction = target[0] === 1 ? 1 : -1;
    totalCost += cost(output, direction);
    correct += Number(Number(output >= 0) === target[0]);
  }
  return { correct, cost: totalCost / data.length };
}

function finiteDiff(network, data, learnRate) {
  if (!Number.isFinite(learnRate) || learnRate <= 0) return;
  const node = network[1][0];
  const bias = node.bias;
  const h = 0.0001;
  node.bias = bias + h;
  const { cost: upperCost } = calcMetrics(network, data);
  node.bias = bias - h;
  const { cost: lowerCost } = calcMetrics(network, data);
  const gradient = (upperCost - lowerCost) / (2 * h);

  node.bias = bias - learnRate * gradient;
}

export { initNetwork, computeOutput, setParam, calcMetrics, finiteDiff };
