import { initCanvas, draw } from "./canvas.js";

// DOM Elements
const elements = {
  canvas: document.getElementById("canvas"),
  point: document.getElementById("point"),
};

// State variables
let coords = null;
let lockPos = false;

// Initialize UI
initCanvas();
updateUI();

function updateUI() {
  const position = { lock: lockPos, coords };
  draw(position);
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
  const cx = e.offsetX - canvas.width / 2;
  const cy = canvas.height / 2 - e.offsetY;
  coords = [cx, cy];
}

function updateCoords() {
  if (coords) {
    point.textContent = `x: ${coords[0]}, y: ${coords[1]}`;
  } else {
    point.textContent = `x: --, y: --`;
  }
}
