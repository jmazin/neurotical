// UI helpers
import { buildGrid, drawGrid } from "./ui/grid.js";

// Example
import { test } from "./test.js";

// DOM elements
const elements = {
  pixelGrid: document.getElementById("pixel-grid"),
  label: document.getElementById("label"),
};

// Constants & State
const PIXEL_COUNT = 784;
const { input, target } = test;
const label = target.indexOf(1);

// Initialize
buildGrid(PIXEL_COUNT);
updateGridUI();

// Update the grid UI
function updateGridUI() {
  elements.label.textContent = label;
  drawGrid(input);
}
