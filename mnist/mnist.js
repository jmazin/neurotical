// Network functions
import { initNetwork, computeOutput } from "../network/network.js";

// UI helpers
import { buildGrid, drawGrid } from "./ui/grid.js";
import { buildPredictionUI, updatePredictionUI } from "./ui/prediction.js";

// DOM elements
const elements = {
  pixelGrid: document.getElementById("pixel-grid"),
};

// Buttons
const buttons = {
  next: document.getElementById("next"),
  prev: document.getElementById("prev"),
  clear: document.getElementById("clear"),
};

// Constants & State
const PIXEL_COUNT = 784;
let testSet = [];
let testNum = 0;
let label = null;
let input = Array(PIXEL_COUNT).fill(0);
let layerSizes, network;

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
