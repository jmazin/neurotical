import { RESULTS, toInput } from "../exam.js";
import { THRESHOLD, computeOutput, predict } from "../neuron.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const WIDTH = 500;
const HEIGHT = 300;
canvas.width = WIDTH;
canvas.height = HEIGHT;

// The plot area inside the canvas, leaving room for labels.
const LEFT = WIDTH * 0.04;
const RIGHT = WIDTH - LEFT;
const TOP = HEIGHT * 0.06;
const BOTTOM = HEIGHT * 0.88;
const DOT_RADIUS = WIDTH / 100;

// The output range on the y-axis.
const Y_MIN = -2;
const Y_MAX = 2;
const Y_LABELS = [-2, -1, 0, 1, 2];

// Input −1–1 ↔ canvas x.
function toX(input) {
  return LEFT + ((input + 1) / 2) * (RIGHT - LEFT);
}

function toInputAtX(x) {
  return ((x - LEFT) / (RIGHT - LEFT)) * 2 - 1;
}

// Output → canvas y, with Y_MAX at the top.
function toY(output) {
  return BOTTOM - ((output - Y_MIN) / (Y_MAX - Y_MIN)) * (BOTTOM - TOP);
}

// The input under the pointer, ignoring its vertical position.
export function inputAt(event) {
  const x = (event.offsetX / canvas.clientWidth) * WIDTH;
  return Math.max(-1, Math.min(1, toInputAtX(x)));
}

export function draw(neuron, data, { probe = null, showNetwork = true } = {}) {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  if (showNetwork) drawPredictions(neuron);
  drawAxes();

  // Keep the output and anything on it inside the plot.
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, TOP - DOT_RADIUS, WIDTH, BOTTOM - TOP + 2 * DOT_RADIUS);
  ctx.clip();

  drawOutput(neuron);

  // Each example sits on the threshold, and its output sits on the line above or below it.
  data.forEach(({ input, target }) => {
    const { color } = RESULTS[target];
    drawDot(input, THRESHOLD, color);
    drawDot(input, computeOutput(neuron, input), color);
  });

  if (probe !== null) drawDot(probe, computeOutput(neuron, probe), "purple");
  ctx.restore();
}

// Shade each column of pixels by the neuron's prediction at that score.
function drawPredictions(neuron) {
  for (let x = 0; x < WIDTH; x++) {
    const [r, g, b] = RESULTS[predict(computeOutput(neuron, toInputAtX(x)))].backgroundColor;
    ctx.fillStyle = `rgb(${r} ${g} ${b} / 0.25)`;
    ctx.fillRect(x, 0, 1, HEIGHT);
  }
}

function drawAxes() {
  ctx.strokeStyle = "black";
  ctx.fillStyle = "black";
  ctx.font = `${WIDTH / 40}px Inter, sans-serif`;

  // Score axis along the bottom.
  ctx.lineWidth = WIDTH / 500;
  drawLine(LEFT, BOTTOM, RIGHT, BOTTOM);
  ctx.textAlign = "center";
  for (let score = 0; score <= 100; score += 25) {
    const x = toX(toInput(score));
    drawLine(x, BOTTOM, x, BOTTOM + WIDTH / 100);
    ctx.fillText(`${score}%`, x, HEIGHT * 0.97);
  }

  // Output gridlines, with the threshold dashed.
  ctx.textAlign = "left";
  ctx.lineWidth = WIDTH / 1000;
  Y_LABELS.forEach((output) => {
    ctx.setLineDash(output === THRESHOLD ? [6, 4] : []);
    drawLine(LEFT, toY(output), RIGHT, toY(output));
    ctx.fillText(output, LEFT + 4, toY(output) - 4);
  });
  ctx.setLineDash([]);
}

// The neuron's output across every score.
function drawOutput(neuron) {
  ctx.strokeStyle = "black";
  ctx.lineWidth = WIDTH / 200;
  ctx.beginPath();
  for (let x = LEFT; x <= RIGHT; x++) {
    ctx.lineTo(x, toY(computeOutput(neuron, toInputAtX(x))));
  }
  ctx.stroke();
}

function drawLine(x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function drawDot(input, output, color) {
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.arc(toX(input), toY(output), DOT_RADIUS, 0, 2 * Math.PI);
  ctx.fill();
}
