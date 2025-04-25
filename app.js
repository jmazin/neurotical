import { initCanvas, draw } from "./ui/canvas.js";
import { initNetwork, computeOutput, setParam, calcMetrics, learn } from "./network.js";
import { toNormalized, numClasses } from "./utils.js";

// Datasets
import * as datasets from "./training-data/index.js";

// UI helpers
import { buildPredictionUI, updatePredictionUI } from "./ui/prediction.js";
import { buildControlsUI, syncControls } from "./ui/network-controls.js";

// DOM Elements
const elements = {
  canvas: document.getElementById("canvas"),
  point: document.getElementById("point"),
  accuracy: document.getElementById("accuracy"),
  cost: document.getElementById("cost"),
  outputLayerSize: document.getElementById("layers-output"),
};

// Buttons
const buttons = {
  learn: document.getElementById("learn"),
  step: document.getElementById("step"),
  reset: document.getElementById("reset"),
};

// Inputs
const inputs = {
  datasetSelector: document.getElementById("dataset-selector"),
  learnRate: document.getElementById("learn-rate"),
};

// State variables
let coords = null;
let lockPos = false;
let dim = 500;
let layerSizes;
let outputLayerSize;
let network;
let datasetName = "line";
let data;
let learnRate = 0.1;
let stopped = true;
let requestId;

// Initialize UI
populateDatasetSelector();
resetUI();

function resetUI() {
  data = datasets[datasetName].data;
  layerSizes = [2, null];
  outputLayerSize = numClasses(data);
  layerSizes[layerSizes.length - 1] = outputLayerSize;
  network = initNetwork(layerSizes);
  initCanvas(dim);
  buildPredictionUI(data);
  buildControlsUI(network, onParamChange);
  inputs.datasetSelector.selectedIndex = Object.keys(datasets).indexOf(datasetName);
  inputs.learnRate.value = learnRate;
  elements.outputLayerSize.textContent = outputLayerSize;
  updateUI();
}

function updateUI() {
  const position = { lock: lockPos, coords };
  draw(network, data, position);
  updateCoords();

  if (coords) {
    renderPrediction();
  }

  const { correct, cost } = calcMetrics(network, data);
  const percent = ((correct / data.length) * 100).toFixed(2);
  elements.accuracy.innerText = `${correct}/${data.length} = ${percent}%`;
  elements.cost.innerText = cost;
  syncControls(network.slice(1));
}

function onParamChange(value, node, weightIndex = null) {
  setParam(network, node, value, weightIndex);
  updateUI();
}

// Canvas Event Listeners
elements.canvas.addEventListener("mousemove", (e) => {
  if (lockPos) return;
  setCoords(e);
  updateCoords();
});

elements.canvas.addEventListener("mouseout", () => {
  if (lockPos) return;
  coords = null;
  updateCoords();
  document.querySelectorAll(".prediction__value").forEach((div) => {
    div.textContent = "";
  });
});

elements.canvas.addEventListener("click", (e) => {
  lockPos = true;
  setCoords(e);
  updateUI();
});

elements.canvas.addEventListener("dblclick", () => {
  lockPos = false;
  coords = null;
  updateUI();
});

// Event Listeners
inputs.datasetSelector.addEventListener("change", (e) => {
  datasetName = e.target.value;
  resetUI();
});

buttons.step.addEventListener("click", () => {
  learn(network, data, learnRate);
  updateUI();
});

buttons.learn.addEventListener("click", () => {
  if (stopped) {
    animate();
    buttons.step.disabled = true;
    buttons.learn.textContent = "stop";
  } else {
    cancelAnimationFrame(requestId);
    buttons.step.disabled = false;
    buttons.learn.textContent = "learn";
  }
  stopped = !stopped;
});

buttons.reset.addEventListener("click", () => {
  network = initNetwork(layerSizes);
  updateUI();
});

inputs.learnRate.addEventListener("input", (e) => {
  learnRate = +e.target.value;
});

function setCoords(e) {
  coords = toNormalized(e.offsetX, e.offsetY, dim);
}

function updateCoords() {
  if (coords) {
    renderPrediction();
  } else {
    point.textContent = `x: --, y: --`;
  }
}

function renderPrediction() {
  const output = computeOutput(coords, network);
  point.textContent = `x: ${coords[0].toFixed(3)}, y: ${coords[1].toFixed(3)}`;
  updatePredictionUI(output);
}

// Create <option> elements for datasets
function populateDatasetSelector() {
  Object.keys(datasets).forEach((file) => {
    const option = document.createElement("option");
    option.value = option.textContent = file;
    inputs.datasetSelector.append(option);
  });
}

// Animation
function animate() {
  learn(network, data, learnRate);
  updateUI();
  requestId = requestAnimationFrame(animate);
}
