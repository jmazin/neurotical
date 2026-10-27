import { initCanvas, draw } from "./ui/canvas.js";
import { initNetwork, computeOutput, setParam, calcMetrics, finiteDiff as learn } from "./network.js";

// Datasets
import * as datasets from "./training-data/index.js";

// UI helpers
import { buildPredictionUI, updatePredictionUI } from "./ui/prediction.js";
import { buildControlsUI, syncControls } from "./ui/network-controls.js";

const CANVAS_WIDTH = 500;

// DOM Elements
const elements = {
  canvas: document.getElementById("canvas"),
  point: document.getElementById("point"),
  accuracy: document.getElementById("accuracy"),
  cost: document.getElementById("cost"),
  cutoff: document.getElementById("cutoff"),
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
  blended: document.getElementById("blended"),
  showNetwork: document.getElementById("show-network"),
};

// State variables
let coords = null;
let lockPos = false;
let network;
let datasetName = "set-1";
let data;
let learnRate = 0.1;
let stopped = true;
let requestId;
let blended = false;
let showNetwork = inputs.showNetwork.checked;

// Initialize UI
populateDatasetSelector();
resetUI();
showDemo();

function resetUI() {
  data = datasets[datasetName].data;
  network = initNetwork();
  initCanvas(CANVAS_WIDTH);
  buildPredictionUI();
  buildControlsUI(network, onParamChange);
  inputs.datasetSelector.selectedIndex = Object.keys(datasets).indexOf(datasetName);
  inputs.learnRate.value = learnRate;
  updateUI();
}

function updateUI() {
  const position = { lock: lockPos, coords };
  draw(network, data, position, blended, showNetwork);
  updateCoords();

  if (coords) {
    renderPrediction();
  }

  const { correct, cost } = calcMetrics(network, data);
  const percent = ((correct / data.length) * 100).toFixed(2);
  elements.accuracy.innerText = `${correct}/${data.length} = ${percent}%`;
  elements.cost.innerText = cost;
  const { weight, bias } = network[0];
  elements.cutoff.textContent = weight === 0
    ? `none (all ${bias >= 0 ? "pass" : "fail"})`
    : `${((1 - bias / weight) * 50).toFixed(1)}%${weight < 0 ? " (pass at/below)" : ""}`;
  syncControls(network);
}

function onParamChange(value, node, param) {
  setParam(network, node, value, param);
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
  network = initNetwork();
  updateUI();
});

inputs.learnRate.addEventListener("input", (e) => {
  learnRate = +e.target.value;
});

inputs.blended.addEventListener("change", (e) => {
  blended = e.target.checked;
  updateUI();
});

inputs.showNetwork.addEventListener("change", (e) => {
  showNetwork = e.target.checked;
  updateUI();
});

function setCoords(e) {
  // Match the line's 4% padding, and ignore the vertical pointer position.
  const x = (e.offsetX / elements.canvas.clientWidth - 0.04) / 0.92;
  coords = [Math.max(-1, Math.min(1, x * 2 - 1))];
}

function updateCoords() {
  if (coords) {
    renderPrediction();
  } else {
    elements.point.textContent = "score: --";
  }
}

function renderPrediction() {
  const output = computeOutput(coords, network);
  elements.point.textContent = `score: ${((coords[0] + 1) * 50).toFixed(1)}%`;
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

function showDemo() {
  document.body.classList.remove("is-loading");
}
