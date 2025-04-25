import { initCanvas, draw } from "./ui/canvas.js";
import { initNetwork, computeOutput, setParam, calcMetrics, learn } from "./network/network.js";
import { toNormalized, numClasses, setInputWidth, formatElapsedTime } from "./utils.js";

// Datasets
import * as datasets from "./training-data/index.js";

// UI helpers
import { buildPredictionUI, updatePredictionUI } from "./ui/prediction.js";
import { buildControlsUI, syncControls } from "./ui/network-controls.js";

// Canvas sizes
const CANVAS_SIZES = [100, 300, 500];
const CANVAS_CSS_WIDTH = 500;

// DOM Elements
const elements = {
  canvas: document.getElementById("canvas"),
  point: document.getElementById("point"),
  accuracy: document.getElementById("accuracy"),
  cost: document.getElementById("cost"),
  outputLayerSize: document.getElementById("layers-output"),
  fps: document.getElementById("fps"),
  stepTime: document.getElementById("step-time"),
  currentResolution: document.getElementById("current-resolution"),
};

// Buttons
const buttons = {
  learn: document.getElementById("learn"),
  step: document.getElementById("step"),
  reset: document.getElementById("reset"),
  resPlus: document.getElementById("resolution__plus"),
  resMinus: document.getElementById("resolution__minus"),
};

// Inputs
const inputs = {
  datasetSelector: document.getElementById("dataset-selector"),
  learnRate: document.getElementById("learn-rate"),
  hiddenLayerSize: document.getElementById("layers-hidden"),
  blended: document.getElementById("blended"),
};

// State variables
let coords = null;
let lockPos = false;
let dim = CANVAS_SIZES.at(-1);
let layerSizes;
let outputLayerSize;
let network;
let datasetName = "line";
let data;
let learnRate = 1;
let stopped = true;
let requestId;
let hiddenLayerContent = "";
let blended = false;
let fpsUpdate = 0;
let lastFrame;
let elapsed;

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
  inputs.hiddenLayerSize.value = "";
  setInputWidth(inputs.hiddenLayerSize);
  elements.currentResolution.textContent = `${dim}px`;
  updateUI();
}

function updateUI() {
  const position = { lock: lockPos, coords };
  draw(network, data, position, blended);
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
    elements.fps.textContent = elements.stepTime.textContent = "--";
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

inputs.hiddenLayerSize.addEventListener("input", (e) => {
  const input = e.target;

  const regex = /^$|^\d+(\s\d+)*\s?$/; // Matches only space-separated numbers
  if (!regex.test(input.value)) {
    input.value = hiddenLayerContent;
    return;
  }

  setInputWidth(input);
  hiddenLayerContent = input.value;

  const hidden = input.value.trim().split(/\s+/).map(Number).filter(Boolean);
  layerSizes = [layerSizes.at(0), ...hidden, layerSizes.at(-1)];
  network = initNetwork(layerSizes);
  buildControlsUI(network, onParamChange);
  updateUI();
});

inputs.blended.addEventListener("change", (e) => {
  blended = e.target.checked;
  updateUI();
});

function setCoords(e) {
  coords = toNormalized(e.offsetX, e.offsetY, CANVAS_CSS_WIDTH);
}

function updateCoords() {
  if (coords) {
    renderPrediction();
  } else {
    point.textContent = `x: --, y: --`;
  }
}

buttons.resPlus.addEventListener("click", () => handleResolutionChange(1));

buttons.resMinus.addEventListener("click", () => handleResolutionChange(-1));

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
  const start = performance.now();
  const frameTime = (start - lastFrame) / 1000 || null;
  lastFrame = start;
  learn(network, data, learnRate);
  elapsed = performance.now() - start;
  updateUI();

  if (start - fpsUpdate > 500) {
    fpsUpdate = start;
    elements.fps.textContent = frameTime ? (1 / frameTime).toFixed(0) : "--";
    elements.stepTime.textContent = formatElapsedTime(elapsed);
  }

  requestId = requestAnimationFrame(animate);
}

// Resolution change
function handleResolutionChange(direction) {
  const currentIndex = CANVAS_SIZES.indexOf(dim);
  const newIndex = currentIndex + direction;

  dim = CANVAS_SIZES[newIndex];

  buttons.resMinus.disabled = newIndex === 0;
  buttons.resPlus.disabled = newIndex === CANVAS_SIZES.length - 1;
  elements.currentResolution.textContent = `${dim}px`;

  initCanvas(dim);
  updateUI();
}
