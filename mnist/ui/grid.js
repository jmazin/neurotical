const grid = document.getElementById("pixel-grid");

let size;
let pixels = [];

function buildGrid(dim) {
  size = dim;
  pixels = [];
  grid.innerHTML = "";

  for (let i = 0; i < size; i++) {
    const pixel = document.createElement("div");
    pixel.id = `pixel-${i}`;
    grid.append(pixel);
    pixels.push(pixel); // cache reference
  }
}

function drawGrid(input) {
  for (let i = 0; i < input.length; i++) {
    const val = Math.round(input[i] * 255);
    pixels[i].style.backgroundColor = rgb(val);
  }
}

function rgb(val) {
  return `rgb(${val}, ${val}, ${val})`;
}

export { buildGrid, drawGrid };
