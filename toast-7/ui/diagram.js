import { TOAST } from "../toast.js";
import { forwardPass } from "../network.js";
import { HIDDEN_COLORS } from "./canvas.js";

const svg = document.getElementById("diagram");
const caption = document.getElementById("diagram-caption");

// Where each neuron sits in the 500 × 230 drawing, layer by layer.
const RADIUS = 32;
const POSITIONS = [
  [[60, 115]],
  [
    [250, 55],
    [250, 175],
  ],
  [[440, 115]],
];

// Two decimals, with a true minus sign.
const format = (value) => value.toFixed(2).replace("-", "−");

// Redraw the network, showing each neuron's activation for one input (or "—" when there is none).
function drawDiagram(network, input) {
  const pass = input ? forwardPass(input, network) : null;
  const acts = pass?.acts;
  const parts = [];

  // Each neuron's incoming connections, one per weight.
  for (let l = 1; l < network.length; l++) {
    network[l].forEach((neuron, n) => {
      neuron.weights.forEach((weight, i) => {
        parts.push(connection(POSITIONS[l - 1][i], POSITIONS[l][n], weight));
      });
    });
  }

  // Then the neurons on top. Hidden neurons match their curve colors on the plot.
  network.forEach((layer, l) => {
    layer.forEach((neuron, n) => {
      const color = l === 1 ? HIDDEN_COLORS[n] : "black";
      const sum = l > 0 && pass ? pass.sums[l][n] : null;
      const act = pass ? acts[l][n] : null;
      parts.push(drawNeuron(POSITIONS[l][n], neuron.name, sum, act, neuron.bias, color));
    });
  });

  const [x, y] = POSITIONS.at(-1)[0];
  if (acts) {
    const { label, color } = TOAST[Number(acts.at(-1)[0] >= 0.5)];
    parts.push(haloText(x, y + RADIUS + 34, label, color));
  }
  caption.textContent = acts ? "" : "Hover over the plot to send a toaster setting through the network.";

  svg.innerHTML = parts.join("");
}

// A line between two neurons: blue for a positive weight, red for negative, thicker when larger.
function connection([x1, y1], [x2, y2], weight) {
  const length = Math.hypot(x2 - x1, y2 - y1);
  const [dx, dy] = [((x2 - x1) / length) * RADIUS, ((y2 - y1) / length) * RADIUS];
  const color = weight >= 0 ? "steelblue" : "crimson";
  const width = 1 + Math.min(Math.abs(weight), 10) * 0.5;
  return `
    <line x1="${x1 + dx}" y1="${y1 + dy}" x2="${x2 - dx}" y2="${y2 - dy}" stroke="${color}" stroke-width="${width}" />
    ${haloText((x1 + x2) / 2, (y1 + y2) / 2 - 8, format(weight), color)}`;
}

// A neuron: its name above, its sum (small) and activation (bold) inside, and its bias below.
// The input neuron has no sum or bias; it just shows the input.
function drawNeuron([x, y], name, sum, act, bias, stroke) {
  const value = act === null ? "—" : format(act);
  return `
    <text x="${x}" y="${y - RADIUS - 8}" fill="dimgray">${name}</text>
    <circle cx="${x}" cy="${y}" r="${RADIUS}" fill="white" stroke="${stroke}" stroke-width="2.5" />
    ${sum === null ? "" : `<text x="${x}" y="${y - 6}" fill="dimgray" font-size="10">Σ ${format(sum)}</text>`}
    <text x="${x}" y="${sum === null ? y + 5 : y + 12}" font-weight="bold">${value}</text>
    ${bias === undefined ? "" : `<text x="${x}" y="${y + RADIUS + 16}" fill="dimgray" font-size="11">bias ${format(bias)}</text>`}`;
}

// Text with a white halo, so it stays readable on top of lines.
function haloText(x, y, text, color) {
  return `<text x="${x}" y="${y}" fill="${color}" font-weight="bold" paint-order="stroke" stroke="white" stroke-width="4">${text}</text>`;
}

export { drawDiagram };
