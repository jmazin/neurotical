import { initCanvas, draw } from "./ui/canvas.js";
import { initNetwork, computeOutput, setParam } from "./network.js";
import { toNormalized } from "./utils.js";
import { data } from "./training.js";

// UI helpers
import { buildPredictionUI, updatePredictionUI } from "./ui/prediction.js";
import { buildControlsUI } from "./ui/network-controls.js";

// DOM Elements
const elements = {
  canvas: document.getElementById("canvas"),
  point: document.getElementById("point"),
};

// State variables
let coords = null;
let lockPos = false;
let dim = 500;
const layerSizes = [2, 2];
const network = initNetwork(layerSizes);

// Initialize UI
initCanvas(dim);
buildPredictionUI();
buildControlsUI(network, onParamChange);
updateUI();

function updateUI() {
  const position = { lock: lockPos, coords };
  draw(network, data, position);
  updateCoords();

  if (coords) {
    renderPrediction();
  }
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
