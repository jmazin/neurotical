import { EXAM_RESULTS } from "../exam-results.js";
import { computeOutput } from "../network.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

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

// Output 0–1 → canvas y, with 1 at the top.
function toY(output) {
  return plotBottom - output * (plotBottom - plotTop);
}

function draw(network, data, position, blended, showNetwork = true) {
  ctx.clearRect(0, 0, canvasSize, canvasHeight);
  if (showNetwork) {
    for (let i = 0; i < canvasSize; i++) {
      const x = ((i - padding) / (canvasSize - 2 * padding)) * 2 - 1;
      const output = computeOutput([x], network);
      const color = blended ? blendColor([1 - output, output]) : EXAM_RESULTS[Number(output >= 0.5)].predictionColor;
      for (let j = 0; j < canvasHeight; j++) {
        setPixel(i, j, [...color, 60]);
      }
    }
    ctx.putImageData(imageData, 0, 0);
  }

  drawAxes();
  drawErrors(network, data);
  drawCurve(network);

  // Fails sit at output 0 and passes at 1, so conflicting labels never overlap.
  data.forEach(({ input, target }) => {
    const { color } = EXAM_RESULTS[target[0]];
    drawDot(input[0], target[0], color);
    drawDot(input[0], computeOutput(input, network), color);
  });

  if (position.lock) drawDot(position.coords[0], computeOutput(position.coords, network), "purple");
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

  // Score axis along output = 0.
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

  // Output gridlines: 1 at the top, the 0.5 decision threshold dashed.
  ctx.textAlign = "left";
  ctx.lineWidth = canvasSize / 1000;
  [1, 0.5].forEach((output) => {
    ctx.setLineDash(output === 0.5 ? [6, 4] : []);
    ctx.beginPath();
    ctx.moveTo(padding, toY(output));
    ctx.lineTo(canvasSize - padding, toY(output));
    ctx.stroke();
  });
  ctx.setLineDash([]);
  [0, 0.5, 1].forEach((output) => ctx.fillText(output, padding + 4, toY(output) - 4));
}

// The output as a curve across every score.
function drawCurve(network) {
  ctx.strokeStyle = "black";
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

function drawDot(input, output, color = "black") {
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.arc(toX(input), toY(output), canvasSize / 100, 0, 2 * Math.PI);
  ctx.fill();
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
