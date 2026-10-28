import { TOAST } from "../toast.js";
import { forwardPass, computeOutput } from "../network.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// The output range on the y-axis, and the output that separates yuck from perfect.
const Y_MIN = 0;
const Y_MAX = 1;
const Y_LABELS = [0, 0.5, 1];
const THRESHOLD = 0.5;

// Each hidden neuron's curve gets its own color, matching the diagram.
export const HIDDEN_COLORS = ["darkorange", "darkviolet"];

let canvasSize, canvasHeight, padding, plotTop, plotBottom, imageData;

function initCanvas(dim) {
  canvasSize = dim;
  canvasHeight = canvasSize * 0.6;
  padding = canvasSize * 0.04;
  plotTop = canvasHeight * 0.06;
  plotBottom = canvasHeight * 0.88;
  canvas.width = canvasSize;
  canvas.height = canvasHeight;
  imageData = ctx.getImageData(0, 0, canvasSize, canvasHeight);
}

// Input 0–1 ↔ canvas x, matching the 4% horizontal padding used by setCoords.
function toX(input) {
  return padding + input * (canvasSize - 2 * padding);
}

function toInputAtX(x) {
  return (x - padding) / (canvasSize - 2 * padding);
}

// Output → canvas y, with Y_MAX at the top.
function toY(output) {
  return plotBottom - ((output - Y_MIN) / (Y_MAX - Y_MIN)) * (plotBottom - plotTop);
}

function draw(network, data, position, blended, showNetwork = true, showHidden = false) {
  ctx.clearRect(0, 0, canvasSize, canvasHeight);
  if (showNetwork) {
    for (let i = 0; i < canvasSize; i++) {
      const output = computeOutput([toInputAtX(i)], network);
      const color = blended ? blendColor([1 - output, output]) : TOAST[Number(output >= THRESHOLD)].predictionColor;
      for (let j = 0; j < canvasHeight; j++) {
        setPixel(i, j, [...color, 60]);
      }
    }
    ctx.putImageData(imageData, 0, 0);
  }

  drawAxes();

  // Keep the output and anything on it inside the plot.
  const margin = canvasSize / 100;
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, plotTop - margin, canvasSize, plotBottom - plotTop + 2 * margin);
  ctx.clip();

  if (showHidden) {
    HIDDEN_COLORS.forEach((color, h) => {
      drawCurve((input) => forwardPass([input], network).acts[1][h], color, [6, 4]);
    });
  }

  drawErrors(network, data);
  drawCurve((input) => computeOutput([input], network), "black");

  // Each example sits at its target (yuck at 0, perfect at 1), and its output sits on the curve.
  data.forEach(({ input, target }) => {
    const { color } = TOAST[target[0]];
    drawDot(input[0], target[0], color);
    drawDot(input[0], computeOutput(input, network), color);
  });

  if (position.lock) drawDot(position.coords[0], computeOutput(position.coords, network), "purple");
  ctx.restore();
}

function setPixel(i, j, [r, g, b, a = 150]) {
  const index = (i + j * canvasSize) * 4;
  imageData.data[index] = r;
  imageData.data[index + 1] = g;
  imageData.data[index + 2] = b;
  imageData.data[index + 3] = a;
}

function drawAxes() {
  ctx.strokeStyle = "black";
  ctx.fillStyle = "black";
  ctx.lineWidth = canvasSize / 500;
  ctx.font = `${canvasSize / 40}px Inter, sans-serif`;

  // Toaster setting axis along the bottom.
  ctx.beginPath();
  ctx.moveTo(padding, plotBottom);
  ctx.lineTo(canvasSize - padding, plotBottom);
  ctx.stroke();
  ctx.textAlign = "center";
  for (let percent = 0; percent <= 100; percent += 25) {
    const x = toX(percent / 100);
    ctx.beginPath();
    ctx.moveTo(x, plotBottom);
    ctx.lineTo(x, plotBottom + canvasSize / 100);
    ctx.stroke();
    ctx.fillText(`${percent}%`, x, canvasHeight * 0.97);
  }

  // Output gridlines, with the decision threshold dashed.
  ctx.textAlign = "left";
  ctx.lineWidth = canvasSize / 1000;
  Y_LABELS.forEach((output) => {
    ctx.setLineDash(output === THRESHOLD ? [6, 4] : []);
    ctx.beginPath();
    ctx.moveTo(padding, toY(output));
    ctx.lineTo(canvasSize - padding, toY(output));
    ctx.stroke();
    ctx.fillText(output, padding + 4, toY(output) - 4);
  });
  ctx.setLineDash([]);
}

// A function of the input, drawn across every toaster setting.
function drawCurve(f, color, dash = []) {
  ctx.strokeStyle = color;
  ctx.lineWidth = canvasSize / 200;
  ctx.setLineDash(dash);
  ctx.beginPath();
  for (let i = padding; i <= canvasSize - padding; i++) {
    const y = toY(f(toInputAtX(i)));
    i === padding ? ctx.moveTo(i, y) : ctx.lineTo(i, y);
  }
  ctx.stroke();
  ctx.setLineDash([]);
}

// Each example's error: the vertical gap between its target and the curve.
function drawErrors(network, data) {
  ctx.lineWidth = canvasSize / 400;
  ctx.setLineDash([3, 3]);
  data.forEach(({ input, target }) => {
    const x = toX(input[0]);
    ctx.strokeStyle = TOAST[target[0]].color;
    ctx.beginPath();
    ctx.moveTo(x, toY(target[0]));
    ctx.lineTo(x, toY(computeOutput(input, network)));
    ctx.stroke();
  });
  ctx.setLineDash([]);
}

function drawDot(input, output, color = "black") {
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.arc(toX(input), toY(output), canvasSize / 100, 0, 2 * Math.PI);
  ctx.fill();
}

function blendColor(output) {
  return output.reduce(
    (acc, value, i) => {
      const scaledColor = TOAST[i].predictionColor.map((c) => c * value);
      return acc.map((val, j) => val + scaledColor[j]);
    },
    [0, 0, 0],
  );
}

export { initCanvas, draw };
