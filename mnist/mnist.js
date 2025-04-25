// Network functions
import { initNetwork, computeOutput, calcMetrics, backprop } from "../network/network.js";

// UI helpers
import { buildGrid, drawGrid } from "./ui/grid.js";
import { buildPredictionUI, updatePredictionUI } from "./ui/prediction.js";

// Utils
import { formatElapsedTime, setInputWidth } from "../utils.js";

// DOM elements
const elements = {
  pixelGrid: document.getElementById("pixel-grid"),
  testAccuracy: document.getElementById("test-accuracy"),
  accuracy: document.getElementById("accuracy"),
  cost: document.getElementById("cost"),
  batch: document.getElementById("batch"),
  epoch: document.getElementById("epoch"),
  stepTime: document.getElementById("step-time"),
  learningControls: document.getElementById("learning-controls"),
};

// Buttons
const buttons = {
  next: document.getElementById("next"),
  prev: document.getElementById("prev"),
  clear: document.getElementById("clear"),
  load: document.getElementById("load"),
  learn: document.getElementById("learn"),
  step: document.getElementById("step"),
  reset: document.getElementById("reset"),
};

// Constants & State
const PIXEL_COUNT = 784;
let testSet = [];
let testNum = 0;
let label = null;
let input = Array(PIXEL_COUNT).fill(0);
let layerSizes, network;
let learnRate;
let stopped = true,
  singleBatch = false;
let elapsed, requestId;
let batches,
  trainingSet,
  batchNum = 0;

// Inputs
const inputs = {
  rate: document.getElementById("rate"),
  hiddenLayers: document.getElementById("layers-hidden"),
  singleBatch: document.getElementById("single-batch"),
};

// Initialize
await loadTestSet();
initializeUI();
showDemo();

// Fetch test set data
async function loadTestSet() {
  const response = await fetch("https://storage.googleapis.com/neurotical-mnist/test-set.json");
  testSet = await response.json();
}

// UI Setup
function initializeUI() {
  buildGrid(PIXEL_COUNT);
  attachEventListeners();
  buildPredictionUI();
  layerSizes = [PIXEL_COUNT, 100, 10];
  network = initNetwork(layerSizes);
  refreshPrediction();
  updateTestsetAccuracy();
  learnRate = 1;
  inputs.rate.value = learnRate;
  inputs.hiddenLayers.value = layerSizes.slice(1, -1).join(" ");
  setInputWidth(inputs.hiddenLayers);
}

// Attach event listeners
function attachEventListeners() {
  buttons.next.addEventListener("click", () => updateTestNum(1));
  buttons.prev.addEventListener("click", () => updateTestNum(-1));
  buttons.clear.addEventListener("click", clearGrid);
}

// Show demo UI
function showDemo() {
  document.body.classList.remove("is-loading");
}

// Update test index
function updateTestNum(delta) {
  testNum = (testNum + delta + testSet.length) % testSet.length;
  drawTest();
}

// Draw the current test example
function drawTest() {
  const { input: test, target } = testSet[testNum];
  input = [...test];
  label = target.indexOf(1);
  updateGridUI();
}

// Clear the current test example
function clearGrid() {
  input.fill(0);
  label = null;
  updateGridUI();
}

// Update the grid UI
function updateGridUI() {
  drawGrid(input);
  refreshPrediction();
}

function refreshPrediction() {
  const output = computeOutput(input, network);
  updatePredictionUI(output, label);
}

// Event listeners -- learning controls
buttons.load.addEventListener("click", async () => {
  buttons.load.disabled = true;
  buttons.load.textContent = "loading...";

  try {
    const file = await fetch("https://storage.googleapis.com/neurotical-mnist/batches-small.json");
    batches = await file.json();
    trainingSet = batches[batchNum];
    elements.learningControls.classList.remove("learning-controls--not-loaded");
    updateOutputUI();
    buttons.load.textContent = "loaded";
  } finally {
    buttons.load.disabled = true;
    buttons.load.remove();
  }
});

buttons.step.addEventListener("click", () => {
  backprop(network, trainingSet, learnRate);
  updateOutputUI();
});

buttons.learn.addEventListener("click", () => {
  console.log(network);
  if (stopped) {
    animate();
    buttons.step.disabled = true;
    buttons.learn.textContent = "stop";
  } else {
    cancelAnimationFrame(requestId);
    buttons.step.disabled = false;
    buttons.learn.textContent = "learn";
    elements.stepTime.textContent = "--";
  }
  stopped = !stopped;
});

buttons.reset.addEventListener("click", () => {
  network = initNetwork(layerSizes);
  batchNum = 0;
  updateOutputUI();
});

inputs.hiddenLayers.addEventListener("input", (e) => {
  const input = e.target;
  setInputWidth(input);

  const hidden = e.target.value.split(/\s+/).map(Number).filter(Boolean);
  layerSizes = [layerSizes[0], ...hidden, layerSizes.at(-1)];

  network = initNetwork(layerSizes);
  batchNum = 0;
  updateOutputUI();
});

inputs.singleBatch.addEventListener("change", (e) => {
  singleBatch = e.target.checked;
});

inputs.rate.addEventListener("input", (e) => {
  learnRate = +e.target.value;
  updateOutputUI();
});

// Event listeners -- Grid
elements.pixelGrid.addEventListener("mouseover", (e) => {
  if (e.target === e.currentTarget || !e.buttons) return;

  const index = +e.target.id.split("-")[1];
  updateInput(index);
  label = null;
  updateGridUI();
});

function updateTestsetAccuracy() {
  const { correct } = calcMetrics(network, testSet);
  const percent = ((correct / testSet.length) * 100).toFixed(0);
  elements.testAccuracy.innerText = `${correct}/${testSet.length} = ${percent}%`;
}

function updateOutputUI() {
  updateLearningUI();
  refreshPrediction();
  updateTestsetAccuracy();
}

function updateLearningUI() {
  const { correct, cost } = calcMetrics(network, trainingSet);
  const percent = ((correct / trainingSet.length) * 100).toFixed(2);
  elements.accuracy.innerText = `${correct}/${trainingSet.length} = ${percent}%`;
  elements.cost.innerText = cost.toFixed(6);
  elements.batch.textContent = `${(batchNum % batches.length) + 1}/${batches.length}`;
  elements.epoch.textContent = Math.floor(batchNum / batches.length);
}

function animate() {
  const start = performance.now();
  batchNum += !singleBatch;
  trainingSet = batches[batchNum % batches.length];
  backprop(network, trainingSet, learnRate);
  elapsed = performance.now() - start;
  updateOutputUI();
  elements.stepTime.textContent = formatElapsedTime(elapsed);
  requestId = requestAnimationFrame(animate);
}

function updateInput(index) {
  const center = 0.7;
  const side = 0.3;
  const width = 28;

  const add = (i, value) => {
    input[i] = Math.min(input[i] + value, 1);
  };

  add(index, center);

  const isLeftEdge = index % width === 0;
  const isRightEdge = (index + 1) % width === 0;

  if (!isLeftEdge) add(index - 1, side);
  if (!isRightEdge) add(index + 1, side);
  if (index + width < PIXEL_COUNT) add(index + width, side);
  if (index - width >= 0) add(index - width, side);
}
