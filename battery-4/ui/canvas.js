import { RESULTS } from "../battery.js";
import { computeOutput, cost } from "../network.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// The output range on the y-axis, and the output that separates died from made it.
const Y_MIN = -2;
const Y_MAX = 2;
const Y_LABELS = [-2, -1, 0, 1, 2];
const THRESHOLD = 0;

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

// Input −1–1 → canvas x, matching the 4% horizontal padding used by setCoords.
function toX(input) {
  return padding + ((input + 1) / 2) * (canvasSize - 2 * padding);
}

// Output → canvas y, with Y_MAX at the top.
function toY(output) {
  return plotBottom - ((output - Y_MIN) / (Y_MAX - Y_MIN)) * (plotBottom - plotTop);
}

function draw(network, data, position, showNetwork = true) {
  ctx.clearRect(0, 0, canvasSize, canvasHeight);
  if (showNetwork) {
    for (let i = 0; i < canvasSize; i++) {
      const x = ((i - padding) / (canvasSize - 2 * padding)) * 2 - 1;
      const output = computeOutput([x], network);
      const color = RESULTS[Number(output >= THRESHOLD)].predictionColor;
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

  drawErrors(network, data);
  drawCurve(network);

  // Each example sits on the threshold, and its output sits on the line above or below it.
  data.forEach(({ input, target }) => {
    const { color } = RESULTS[target[0]];
    drawDot(input[0], THRESHOLD, color);
    drawDot(input[0], computeOutput(input, network), color);
  });

  if (position.lock) drawDot(position.coords[0], computeOutput(position.coords, network), "#1f1d1a");
  ctx.restore();
}

function setPixel(i, j, [r, g, b, a = 150]) {
  const index = (i + j * canvasSize) * 4;
  imageData.data[index] = r;
  imageData.data[index + 1] = g;
  imageData.data[index + 2] = b;
  imageData.data[index + 3] = a;
}

// Axes and gridlines stay quiet so the data stands out.
function drawAxes() {
  ctx.strokeStyle = "#8a8378";
  ctx.fillStyle = "#5c574f";
  ctx.lineWidth = canvasSize / 500;
  ctx.font = `${canvasSize / 40}px Inter, sans-serif`;

  // Battery axis along the bottom.
  ctx.beginPath();
  ctx.moveTo(padding, plotBottom);
  ctx.lineTo(canvasSize - padding, plotBottom);
  ctx.stroke();
  ctx.textAlign = "center";
  for (let percent = 0; percent <= 100; percent += 25) {
    const x = toX(percent / 50 - 1);
    ctx.beginPath();
    ctx.moveTo(x, plotBottom);
    ctx.lineTo(x, plotBottom + canvasSize / 100);
    ctx.stroke();
    ctx.fillText(`${percent}%`, x, canvasHeight * 0.97);
  }

  // Output gridlines, with the decision threshold dashed.
  ctx.textAlign = "left";
  ctx.lineWidth = canvasSize / 1000;
  ctx.strokeStyle = "#cfc8bc";
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

// The output across every battery level.
function drawCurve(network) {
  ctx.strokeStyle = "#1f1d1a";
  ctx.lineWidth = canvasSize / 200;
  ctx.beginPath();
  for (let i = padding; i <= canvasSize - padding; i++) {
    const x = ((i - padding) / (canvasSize - 2 * padding)) * 2 - 1;
    const y = toY(computeOutput([x], network));
    i === padding ? ctx.moveTo(i, y) : ctx.lineTo(i, y);
  }
  ctx.stroke();
}

// Each example's loss: how far its output is past the threshold on the wrong side.
function drawErrors(network, data) {
  ctx.lineWidth = canvasSize / 400;
  ctx.setLineDash([3, 3]);
  data.forEach(({ input, target }) => {
    const output = computeOutput(input, network);
    if (cost(output, target) === 0) return;
    const x = toX(input[0]);
    ctx.strokeStyle = RESULTS[target[0]].color;
    ctx.beginPath();
    ctx.moveTo(x, toY(THRESHOLD));
    ctx.lineTo(x, toY(output));
    ctx.stroke();
  });
  ctx.setLineDash([]);
}

// A dot with a white ring, so overlapping dots stay distinct.
function drawDot(input, output, color = "#1f1d1a") {
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.strokeStyle = "white";
  ctx.lineWidth = 2;
  ctx.arc(toX(input), toY(output), canvasSize / 90, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
}

export { initCanvas, draw };
