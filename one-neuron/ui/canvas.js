import { EXAM_RESULTS } from "../exam-results.js";
import { computeOutput, computeSum } from "../network.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let canvasSize, canvasHeight, padding, lineY, imageData;

function initCanvas(dim) {
  canvasSize = dim;
  canvasHeight = canvasSize / 5;
  padding = canvasSize * 0.04;
  lineY = canvasHeight * 0.45;
  canvas.width = canvasSize;
  canvas.height = canvasHeight;
  imageData = ctx.getImageData(0, 0, canvasSize, canvasHeight);
}

function draw(network, data, position, blended) {
  const isSigmoid = network[1][0].activation === "sigmoid";
  for (let i = 0; i < canvasSize; i++) {
    const x = ((i - padding) / (canvasSize - 2 * padding)) * 2 - 1;
    const output = computeOutput([x], network);
    const sum = computeSum([x], network);
    // Linear mode maps its raw sum to colors; sigmoid uses its probability.
    const blend = isSigmoid ? output : Math.max(0, Math.min(1, (output + 1) / 2));
    const color = blended ? blendColor([1 - blend, blend]) : EXAM_RESULTS[Number(sum >= 0)].predictionColor;
    for (let j = 0; j < canvasHeight; j++) {
      setPixel(i, j, color);
    }
  }

  ctx.putImageData(imageData, 0, 0);

  drawAxes();
  // Keep conflicting labels at the same score visible instead of covering them.
  const points = new Map();
  data.forEach(({ input, target }) => {
    const point = points.get(input[0]) ?? { input, colors: new Set() };
    point.colors.add(EXAM_RESULTS[target[0]].color);
    points.set(input[0], point);
  });
  points.forEach(({ input, colors }) => drawDot(input, [...colors]));

  if (position.lock) drawDot(position.coords, "purple");
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
  ctx.lineWidth = canvasSize / 500;
  ctx.beginPath();
  ctx.moveTo(padding, lineY);
  ctx.lineTo(canvasSize - padding, lineY);
  ctx.stroke();
  ctx.fillStyle = "black";
  ctx.font = `${canvasSize / 40}px Inter, sans-serif`;
  ctx.textAlign = "center";
  for (let score = 0; score <= 100; score += 25) {
    const x = padding + (score / 100) * (canvasSize - 2 * padding);
    ctx.beginPath();
    ctx.moveTo(x, lineY - canvasSize / 100);
    ctx.lineTo(x, lineY + canvasSize / 100);
    ctx.stroke();
    ctx.fillText(`${score}%`, x, canvasHeight * 0.85);
  }
}

function drawDot([x], color = "black") {
  const i = padding + ((x + 1) / 2) * (canvasSize - 2 * padding);
  const colors = Array.isArray(color) ? color : [color];
  colors.forEach((fill, index) => {
    ctx.beginPath();
    ctx.fillStyle = fill;
    if (colors.length > 1) ctx.moveTo(i, lineY);
    ctx.arc(i, lineY, canvasSize / 100, index / colors.length * 2 * Math.PI, (index + 1) / colors.length * 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
  });
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
