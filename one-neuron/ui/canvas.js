import { MUSHROOMS } from "../mushroom-info.js";
import { computeOutput } from "../../network/network.js";
import { argmax } from "../../utils.js";

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
  for (let i = 0; i < canvasSize; i++) {
    const x = ((i - padding) / (canvasSize - 2 * padding)) * 2 - 1;
    const output = computeOutput([x], network);
    const color = blended ? blendColor(output) : MUSHROOMS[argmax(output)].predictionColor;
    for (let j = 0; j < canvasHeight; j++) {
      setPixel(i, j, color);
    }
  }

  ctx.putImageData(imageData, 0, 0);

  drawAxes();
  data.forEach(({ input, target }) => {
    drawDot(input, MUSHROOMS[target.indexOf(1)].color);
  });

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
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.arc(i, lineY, canvasSize / 100, 0, 2 * Math.PI);
  ctx.fill();
}

function blendColor(output) {
  return output.reduce(
    (acc, value, i) => {
      const scaledColor = MUSHROOMS[i].predictionColor.map((c) => c * value);
      return acc.map((val, j) => val + scaledColor[j]);
    },
    [0, 0, 0]
  );
}

export { initCanvas, draw };
