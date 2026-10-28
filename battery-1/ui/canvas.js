import { RESULTS, toInput } from "../battery.js";
import { THRESHOLD, computeOutput, predict } from "../neuron.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const WIDTH = 500;
canvas.width = WIDTH;

// A short strip shows just the examples along the battery axis; the taller plot adds the output.
const STRIP_HEIGHT = 60;
const PLOT_HEIGHT = 300;

// The plot area inside the canvas, leaving room for labels. axisY is where the battery axis sits.
const LEFT = WIDTH * 0.04;
const RIGHT = WIDTH - LEFT;
const DOT_RADIUS = WIDTH / 100;
let height, top, axisY;

function resize(showOutput) {
  height = showOutput ? PLOT_HEIGHT : STRIP_HEIGHT;
  top = height * 0.06;
  axisY = showOutput ? height * 0.88 : height * 0.45;
  if (canvas.height !== height) canvas.height = height;
}

// The output range on the y-axis.
const Y_MIN = -1;
const Y_MAX = 1;
const Y_LABELS = [-1, -0.5, 0, 0.5, 1];

// Input 0–1 ↔ canvas x.
function toX(input) {
  return LEFT + input * (RIGHT - LEFT);
}

function toInputAtX(x) {
  return (x - LEFT) / (RIGHT - LEFT);
}

// Output → canvas y, with Y_MAX at the top.
function toY(output) {
  return axisY - ((output - Y_MIN) / (Y_MAX - Y_MIN)) * (axisY - top);
}

// The input under the pointer, ignoring its vertical position.
export function inputAt(event) {
  const x = (event.offsetX / canvas.clientWidth) * WIDTH;
  return Math.max(0, Math.min(1, toInputAtX(x)));
}

export function draw(neuron, data, { probe = null, showNetwork = true, showOutput = false } = {}) {
  resize(showOutput);
  ctx.clearRect(0, 0, WIDTH, height);
  if (showNetwork) drawPredictions(neuron);
  drawBatteryAxis();

  // Without the output, each example and the probe sit on the battery axis.
  if (!showOutput) {
    data.forEach(({ input, target }) => drawDot(toX(input), axisY, RESULTS[target].color));
    if (probe !== null) drawDot(toX(probe), axisY, "#1f1d1a");
    return;
  }

  drawOutputGrid();

  // Keep the output and anything on it inside the plot.
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, top - DOT_RADIUS, WIDTH, axisY - top + 2 * DOT_RADIUS);
  ctx.clip();

  drawOutput(neuron);

  // Each example sits on the threshold, and its output sits on the line above or below it.
  data.forEach(({ input, target }) => {
    const { color } = RESULTS[target];
    drawDot(toX(input), toY(THRESHOLD), color);
    drawDot(toX(input), toY(computeOutput(neuron, input)), color);
  });

  if (probe !== null) drawDot(toX(probe), toY(computeOutput(neuron, probe)), "#1f1d1a");
  ctx.restore();
}

// Shade each column of pixels by the neuron's prediction at that battery level.
function drawPredictions(neuron) {
  for (let x = 0; x < WIDTH; x++) {
    const [r, g, b] = RESULTS[predict(computeOutput(neuron, toInputAtX(x)))].backgroundColor;
    ctx.fillStyle = `rgb(${r} ${g} ${b} / 0.25)`;
    ctx.fillRect(x, 0, 1, height);
  }
}

// Axes and gridlines stay quiet so the data stands out.
function drawBatteryAxis() {
  ctx.strokeStyle = "#8a8378";
  ctx.fillStyle = "#5c574f";
  ctx.font = `${WIDTH / 40}px Inter, sans-serif`;
  ctx.lineWidth = WIDTH / 500;
  drawLine(LEFT, axisY, RIGHT, axisY);
  ctx.textAlign = "center";
  for (let percent = 0; percent <= 100; percent += 25) {
    const x = toX(toInput(percent));
    drawLine(x, axisY, x, axisY + WIDTH / 100);
    ctx.fillText(`${percent}%`, x, height * 0.95);
  }
}

// Output gridlines, with the threshold dashed.
function drawOutputGrid() {
  ctx.textAlign = "left";
  ctx.lineWidth = WIDTH / 1000;
  ctx.strokeStyle = "#cfc8bc";
  Y_LABELS.forEach((output) => {
    ctx.setLineDash(output === THRESHOLD ? [6, 4] : []);
    drawLine(LEFT, toY(output), RIGHT, toY(output));
    ctx.fillText(output, LEFT + 4, toY(output) - 4);
  });
  ctx.setLineDash([]);
}

// The neuron's output across every battery level.
function drawOutput(neuron) {
  ctx.strokeStyle = "#1f1d1a";
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

// A dot with a white ring, so overlapping dots stay distinct.
function drawDot(x, y, color) {
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.strokeStyle = "white";
  ctx.lineWidth = 2;
  ctx.arc(x, y, DOT_RADIUS, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
}
