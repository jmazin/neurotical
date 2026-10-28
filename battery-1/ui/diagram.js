import { RESULTS, toPercent } from "../battery.js";
import { computeOutput, predict } from "../neuron.js";

const $ = (id) => document.getElementById(id);

// Two decimals, with a true minus sign.
const format = (value) => value.toFixed(2).replace("-", "−");

// Fill in the neuron diagram for one input, or leave it blank when there is none.
export function drawNeuron(neuron, input) {
  $("neuron-bias").textContent = `bias ${format(neuron.bias)}`;

  if (input === null) {
    ["neuron-input", "neuron-sum", "neuron-output"].forEach((id) => ($(id).textContent = "—"));
    $("neuron-percent").textContent = $("neuron-prediction").textContent = "";
    $("neuron-equation").textContent = "Hover over the plot to send a battery level through the neuron.";
    return;
  }

  const sum = computeOutput(neuron, input);
  const { label, color } = RESULTS[predict(sum)];

  $("neuron-input").textContent = format(input);
  $("neuron-percent").textContent = `${toPercent(input).toFixed(0)}% battery`;
  $("neuron-sum").textContent = format(sum);
  $("neuron-output").textContent = format(sum);
  $("neuron-prediction").textContent = label;
  $("neuron-prediction").setAttribute("fill", color);

  const bias = neuron.bias < 0 ? `(${format(neuron.bias)})` : format(neuron.bias);
  $("neuron-equation").textContent = `sum = ${format(input)} + ${bias} = ${format(sum)}`;
}
