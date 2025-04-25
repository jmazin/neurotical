import { initCanvas, draw } from "./ui/canvas.js";
import { initNetwork, computeOutput, setParam, calcMetrics } from "./network.js";
import { toNormalized } from "./utils.js";

// Datasets
import * as datasets from "./training-data/index.js";

// UI helpers
import { buildPredictionUI, updatePredictionUI } from "./ui/prediction.js";
import { buildControlsUI } from "./ui/network-controls.js";

// DOM Elements
const elements = {
  canvas: document.getElementById("canvas"),
  point: document.getElementById("point"),
  accuracy: document.getElementById("accuracy"),
};

// Inputs
const inputs = {
  datasetSelector: document.getElementById("dataset-selector"),
};

// State variables
let coords = null;
let lockPos = false;
let dim = 500;
const layerSizes = [2, 2];
let network;
let datasetName = "line";
let data;

// Initialize UI
populateDatasetSelector();
resetUI();

function resetUI() {
  data = datasets[datasetName].data;
  network = initNetwork(layerSizes);
  initCanvas(dim);
  buildPredictionUI();
  buildControlsUI(network, onParamChange);
  inputs.datasetSelector.selectedIndex = Object.keys(datasets).indexOf(datasetName);
  updateUI();
}

function updateUI() {
  const position = { lock: lockPos, coords };
  draw(network, data, position);
  updateCoords();

  if (coords) {
    renderPrediction();
  }

  const { correct } = calcMetrics(network, data);
  const percent = ((correct / data.length) * 100).toFixed(2);
  elements.accuracy.innerText = `${correct}/${data.length} = ${percent}%`;
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
