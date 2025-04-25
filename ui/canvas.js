import { MUSHROOMS } from "../mushroom-info.js";
import { computeOutput } from "../network.js";
import { toNormalized, fromNormalized, argmax } from "../utils.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let canvasSize, halfSize, imageData;

function initCanvas(dim) {
  canvasSize = dim;
  halfSize = canvasSize / 2;
  canvas.width = canvasSize;
  canvas.height = canvasSize;
  imageData = ctx.getImageData(0, 0, canvasSize, canvasSize);
}

function draw(network, data, position) {
  for (let i = 0; i < canvasSize; i++) {
    for (let j = 0; j < canvasSize; j++) {
      const coords = toNormalized(i, j, canvasSize);
      const output = computeOutput(coords, network);
      const color = MUSHROOMS[argmax(output)].predictionColor;
      setPixel(i, j, color);
    }
  }

  ctx.putImageData(imageData, 0, 0);

  drawAxes();
  drawDot([0, 0]);

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
  // x axis
  ctx.beginPath();
  ctx.moveTo(0, halfSize);
  ctx.lineTo(canvasSize, halfSize);
  ctx.stroke();

  // y axis
  ctx.beginPath();
  ctx.moveTo(halfSize, 0);
  ctx.lineTo(halfSize, canvasSize);
  ctx.stroke();
}

function drawDot([x, y], color = "black") {
  const [i, j] = fromNormalized(x, y, canvasSize);
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.arc(i, j, 5, 0, 2 * Math.PI);
  ctx.fill();
}

export { initCanvas, draw };
