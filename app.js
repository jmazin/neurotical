const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const canvasSize = 500;
canvas.width = canvasSize;
canvas.height = canvasSize;

const imageData = ctx.getImageData(0, 0, canvasSize, canvasSize);

function setPixel(i, j, [r, g, b, a = 150]) {
  const index = (i + j * canvasSize) * 4;
  imageData.data[index] = r;
  imageData.data[index + 1] = g;
  imageData.data[index + 2] = b;
  imageData.data[index + 3] = a;
}

for (let i = 0; i < canvasSize; i++) {
  for (let j = 0; j < canvasSize; j++) {
    const coords = [i, j];
    const color = computeColor(coords);
    setPixel(i, j, color);
  }
}

ctx.putImageData(imageData, 0, 0);

//
//

function computeColor([i, j]) {
  const red = Math.floor((i * 255) / (canvasSize - 1));
  const green = Math.floor((j * 255) / (canvasSize - 1));
  const blue = 100;
  return [red, green, blue];
}
