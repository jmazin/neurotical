import { RESULTS } from "../battery.js";
import { computeOutput } from "../network.js";

const $ = (id) => document.getElementById(id);

// Two decimals, with a true minus sign.
const format = (value) => value.toFixed(2).replace("-", "−");

// Negative numbers go in brackets, so the equation reads cleanly.
const term = (value) => (value < 0 ? `(${format(value)})` : format(value));

// Fill in the neuron diagram for one input, or leave it blank when there is none.
export function drawNeuron(network, input) {
  const { bias } = network[0];
  $("neuron-bias").textContent = `bias ${format(bias)}`;

  if (input === null) {
    ["neuron-input", "neuron-sum", "neuron-output"].forEach((id) => ($(id).textContent = "—"));
    $("neuron-percent").textContent = $("neuron-prediction").textContent = "";
    $("neuron-equation").textContent = "Hover over the plot to send a battery level through the neuron.";
    return;
  }

  // Battery levels from 0–100% are inputs from −1 to 1.
  const [x] = input;
  const sum = x + bias;
  const output = computeOutput(input, network);
  const { label, color } = RESULTS[Number(output >= 0)];

  $("neuron-input").textContent = format(x);
  $("neuron-percent").textContent = `${((x + 1) * 50).toFixed(0)}% battery`;
  $("neuron-sum").textContent = format(sum);
  $("neuron-output").textContent = format(output);
  $("neuron-prediction").textContent = label;
  $("neuron-prediction").setAttribute("fill", color);
  $("neuron-equation").textContent = `sum = ${format(x)} + ${term(bias)} = ${format(sum)}`;
}
