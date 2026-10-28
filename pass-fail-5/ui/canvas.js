import { EXAM_RESULTS } from "../exam-results.js";
import { computeOutput } from "../network.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// The output range on the y-axis, and the output that separates fail from pass.
const Y_MIN = 0;
const Y_MAX = 1;
const Y_LABELS = [0, 0.5, 1];
const THRESHOLD = 0.5;

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

function draw(network, data, position, blended, showNetwork = true) {
  ctx.clearRect(0, 0, canvasSize, canvasHeight);
  if (showNetwork) {
    for (let i = 0; i < canvasSize; i++) {
      const x = ((i - padding) / (canvasSize - 2 * padding)) * 2 - 1;
      const output = computeOutput([x], network);
      const color = blended ? blendColor([1 - output, output]) : EXAM_RESULTS[Number(output >= THRESHOLD)].predictionColor;
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

  // Each example sits at its target (fail at 0, pass at 1), and its output sits on the curve.
  data.forEach(({ input, target }) => {
    const { color } = EXAM_RESULTS[target[0]];
    drawDot(input[0], target[0], color);
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

  // Score axis along the bottom.
  ctx.beginPath();
  ctx.moveTo(padding, plotBottom);
  ctx.lineTo(canvasSize - padding, plotBottom);
  ctx.stroke();
  ctx.textAlign = "center";
  for (let score = 0; score <= 100; score += 25) {
    const x = toX(score / 50 - 1);
    ctx.beginPath();
    ctx.moveTo(x, plotBottom);
    ctx.lineTo(x, plotBottom + canvasSize / 100);
    ctx.stroke();
    ctx.fillText(`${score}%`, x, canvasHeight * 0.97);
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

// The output across every score.
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

// Each example's error: the vertical gap between its target and the curve.
function drawErrors(network, data) {
  ctx.lineWidth = canvasSize / 400;
  ctx.setLineDash([3, 3]);
  data.forEach(({ input, target }) => {
    const x = toX(input[0]);
    ctx.strokeStyle = EXAM_RESULTS[target[0]].color;
    ctx.beginPath();
    ctx.moveTo(x, toY(target[0]));
    ctx.lineTo(x, toY(computeOutput(input, network)));
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

function blendColor(output) {
  return output.reduce(
    (acc, value, i) => {
      const scaledColor = EXAM_RESULTS[i].predictionColor.map((c) => c * value);
      return acc.map((val, j) => val + scaledColor[j]);
    },
    [0, 0, 0],
  );
}

export { initCanvas, draw };
