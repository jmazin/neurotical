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

function cost(output, target) {
  const direction = Math.sign(target);
  return Math.max(0, -direction * output);
}

function calcMetrics(network, data) {
  let totalCost = 0;
  let correct = 0;
  for (const { input, target } of data) {
    const output = computeOutput(input, network);
    totalCost += cost(output, target[0] * 2 - 1);
    correct += Number(Number(output >= 0) === target[0]);
  }
  return { correct, cost: totalCost / data.length };
}

function finiteDiff(network, data, learnRate) {
  if (!Number.isFinite(learnRate) || learnRate <= 0) return;
  const node = network[1][0];
  const bias = node.bias;
  const h = 0.0001;
  const { cost: origCost } = calcMetrics(network, data);
  node.bias = bias + h;
  const { cost: upperCost } = calcMetrics(network, data);
  node.bias = bias - h;
  const { cost: lowerCost } = calcMetrics(network, data);
  const gradient = (upperCost - lowerCost) / (2 * h);

  // Halve an overshooting step until it no longer increases the loss.
  let rate = learnRate;
  for (let attempt = 0; attempt < 20; attempt++) {
    node.bias = bias - rate * gradient;
    if (calcMetrics(network, data).cost <= origCost) return;
    rate /= 2;
  }
  node.bias = bias;
}

export { initNetwork, computeOutput, setParam, calcMetrics, finiteDiff };
