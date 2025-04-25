const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let canvasSize, halfSize, imageData;

function initCanvas() {
  canvasSize = 500;
  halfSize = canvasSize / 2;
  canvas.width = canvasSize;
  canvas.height = canvasSize;
  imageData = ctx.getImageData(0, 0, canvasSize, canvasSize);
}

function draw(position) {
  for (let i = 0; i < canvasSize; i++) {
    for (let j = 0; j < canvasSize; j++) {
      const coords = [i - halfSize, halfSize - j];
      const color = computeColor(coords);
      setPixel(i, j, color);
    }
  }

  ctx.putImageData(imageData, 0, 0);

  drawAxes();
  drawDot([0, 0]);

  if (position.lock) drawDot(position.coords, "purple");
}

function computeColor([x, y]) {
  const red = Math.floor((Math.abs(x * 2) * 255) / (canvasSize - 1));
  const green = Math.floor((Math.abs(y * 2) * 255) / (canvasSize - 1));
  const blue = 100;
  return [red, green, blue];
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
  const canvasX = x + halfSize;
  const canvasY = halfSize - y;
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.arc(canvasX, canvasY, 5, 0, 2 * Math.PI);
  ctx.fill();
}

export { initCanvas, draw };
