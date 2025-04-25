import { initCanvas, draw } from "./canvas.js";
import { initNetwork } from "./network.js";
import { toNormalized } from "./utils.js";

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
updateUI();

function updateUI() {
  const position = { lock: lockPos, coords };
  draw(network, position);
  updateCoords();
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

function setCoords(e) {
  coords = toNormalized(e.offsetX, e.offsetY, dim);
}

function updateCoords() {
  if (coords) {
    point.textContent = `x: ${coords[0].toFixed(3)}, y: ${coords[1].toFixed(3)}`;
  } else {
    point.textContent = `x: --, y: --`;
  }
}
