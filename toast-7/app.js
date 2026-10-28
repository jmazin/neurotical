import { initCanvas, draw } from "./ui/canvas.js";
import { initNetwork, calcMetrics, finiteDiff as learn } from "./network.js";

// Datasets
import datasets from "./training-data/index.js";

// UI helpers
import { buildControlsUI, syncControls } from "./ui/network-controls.js";
import { drawDiagram } from "./ui/diagram.js";

const CANVAS_WIDTH = 500;

// A hidden layer takes thousands of steps to train, so each animation frame takes several.
const STEPS_PER_FRAME = 10;

// DOM Elements
const elements = {
  canvas: document.getElementById("canvas"),
  accuracy: document.getElementById("accuracy"),
  cost: document.getElementById("cost"),
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
  showHidden: document.getElementById("show-hidden"),
};

// State variables
let coords = null;
let lockPos = false;
let network;
let datasetName = "typical";
let data;
let learnRate = 3;
let stopped = true;
let requestId;
let blended = false;
let showNetwork = inputs.showNetwork.checked;
let showHidden = inputs.showHidden.checked;

// Initialize UI
populateDatasetSelector();
resetUI();
showDemo();

function resetUI() {
  data = datasets[datasetName];
  network = initNetwork();
  initCanvas(CANVAS_WIDTH);
  buildControlsUI(network, onParamChange);
  inputs.datasetSelector.value = datasetName;
  inputs.learnRate.value = learnRate;
  updateUI();
}

function updateUI() {
  const position = { lock: lockPos, coords };
  draw(network, data, position, blended, showNetwork, showHidden);
  updateCoords();

  const { correct, cost } = calcMetrics(network, data);
  const percent = ((correct / data.length) * 100).toFixed(2);
  elements.accuracy.innerText = `${correct}/${data.length} = ${percent}%`;
  elements.cost.innerText = cost;
  syncControls(network);
}

function onParamChange() {
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

// Reset starts from new random weights and biases.
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

inputs.showHidden.addEventListener("change", (e) => {
  showHidden = e.target.checked;
  updateUI();
});

function setCoords(e) {
  // Match the plot's 4% padding, and ignore the vertical pointer position.
  const x = (e.offsetX / elements.canvas.clientWidth - 0.04) / 0.92;
  coords = [Math.max(0, Math.min(1, x))];
}

function updateCoords() {
  drawDiagram(network, coords);
}

// Create <option> elements for datasets
function populateDatasetSelector() {
  Object.keys(datasets).forEach((name) => {
    inputs.datasetSelector.append(new Option(name, name));
  });
}

// Animation
function animate() {
  for (let i = 0; i < STEPS_PER_FRAME; i++) learn(network, data, learnRate);
  updateUI();

  requestId = requestAnimationFrame(animate);
}

function showDemo() {
  document.body.classList.remove("is-loading");
}
