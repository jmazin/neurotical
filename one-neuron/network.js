function initNetwork(activation = "linear", trainWeight = false, loss = "difference") {
  return [[{}], [{ name: "1-0", weight: 1, bias: 0, activation, trainWeight, loss }]];
}

function computeOutput(input, network) {
  return activation(computeSum(input, network), network[1][0].activation);
}

function computeSum(input, network) {
  const node = network[1][0];
  return input[0] * node.weight + node.bias;
}

function activation(sum, type) {
  return type === "sigmoid" ? 1 / (1 + Math.exp(-sum)) : sum;
}

function setParam(network, name, value, weightIndex = null) {
  const [l, n] = name.split("-").map(Number);
  network[l][n][weightIndex === null ? "bias" : "weight"] = value;
}

function cost(output, target, loss) {
  if (loss === "difference") {
    const direction = Math.sign(target);
    return Math.max(0, -direction * output);
  }
  return (output - target) ** 2;
}

function calcMetrics(network, data) {
  let totalCost = 0;
  let correct = 0;
  const node = network[1][0];
  const useRawSum = node.loss === "difference" || node.activation === "linear";
  for (const { input, target } of data) {
    const sum = computeSum(input, network);
    const output = useRawSum ? sum : activation(sum, node.activation);
    const expected = useRawSum ? target[0] * 2 - 1 : target[0];
    totalCost += cost(output, expected, node.loss);
    correct += Number(Number(sum >= 0) === target[0]);
  }
  return { correct, cost: totalCost / data.length };
}

function finiteDiff(network, data, learnRate) {
  if (!Number.isFinite(learnRate) || learnRate <= 0) return;
  const node = network[1][0];
  const params = node.trainWeight ? ["weight", "bias"] : ["bias"];
  const original = params.map((param) => node[param]);
  const h = 0.0001;
  const { cost: origCost } = calcMetrics(network, data);
  const gradients = params.map((param, index) => {
    node[param] = original[index] + h;
    const { cost: upperCost } = calcMetrics(network, data);
    node[param] = original[index] - h;
    const { cost: lowerCost } = calcMetrics(network, data);
    node[param] = original[index];
    return (upperCost - lowerCost) / (2 * h);
  });

  // Halve an overshooting step until it no longer increases the loss.
  let rate = learnRate;
  for (let attempt = 0; attempt < 20; attempt++) {
    params.forEach((param, index) => {
      node[param] = original[index] - rate * gradients[index];
    });
    if (calcMetrics(network, data).cost <= origCost) return;
    rate /= 2;
  }
  params.forEach((param, index) => {
    node[param] = original[index];
  });
}

export { initNetwork, computeOutput, computeSum, setParam, calcMetrics, finiteDiff };
