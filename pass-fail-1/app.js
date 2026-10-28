import { draw, inputAt } from "./ui/canvas.js";
import { createNeuron, computeOutput, predict, countCorrect } from "./neuron.js";
import { RESULTS, toScore } from "./exam.js";
import * as datasets from "./training-data/index.js";

const $ = (id) => document.getElementById(id);
const el = {
  canvas: $("canvas"),
  accuracy: $("accuracy"),
  cutoff: $("cutoff"),
  showNetwork: $("show-network"),
  score: $("score"),
  prediction: $("prediction"),
  predictionLabel: $("prediction-label"),
  predictionOutput: $("prediction-output"),
  dataset: $("dataset"),
  reset: $("reset"),
  bias: $("bias"),
  biasValue: $("bias-value"),
};

let neuron = createNeuron();
let data = datasets["set-1"].data;

// The input under the pointer, and whether a click has pinned it there.
let probe = null;
let pinned = false;

for (const name of Object.keys(datasets)) {
  el.dataset.append(new Option(name, name));
}

render();
document.body.classList.remove("is-loading");

function render() {
  draw(neuron, data, { probe: pinned ? probe : null, showNetwork: el.showNetwork.checked });

  const correct = countCorrect(neuron, data);
  el.accuracy.textContent = `${correct}/${data.length} = ${((correct / data.length) * 100).toFixed(2)}%`;

  // The output crosses 0 where input + bias = 0, so at input = −bias.
  el.cutoff.textContent = `${toScore(-neuron.bias).toFixed(1)}%`;

  el.bias.value = neuron.bias;
  el.biasValue.textContent = neuron.bias.toFixed(5);

  renderPrediction();
}

function renderPrediction() {
  if (probe === null) {
    el.score.textContent = "score: --";
    el.predictionLabel.textContent = el.predictionOutput.textContent = "";
    return;
  }
  const output = computeOutput(neuron, probe);
  const { label, color } = RESULTS[predict(output)];
  el.score.textContent = `score: ${toScore(probe).toFixed(1)}%`;
  el.prediction.style.color = color;
  el.predictionLabel.textContent = label;
  el.predictionOutput.textContent = `sum: ${output.toFixed(3)}`;
}

// Hovering previews a score; clicking pins it on the plot; double-clicking unpins it.
el.canvas.addEventListener("mousemove", (e) => {
  if (pinned) return;
  probe = inputAt(e);
  renderPrediction();
});

el.canvas.addEventListener("mouseout", () => {
  if (pinned) return;
  probe = null;
  renderPrediction();
});

el.canvas.addEventListener("click", (e) => {
  pinned = true;
  probe = inputAt(e);
  render();
});

el.canvas.addEventListener("dblclick", () => {
  pinned = false;
  probe = null;
  render();
});

el.bias.addEventListener("input", (e) => {
  neuron.bias = +e.target.value;
  render();
});

el.dataset.addEventListener("change", (e) => {
  data = datasets[e.target.value].data;
  neuron = createNeuron();
  render();
});

el.reset.addEventListener("click", () => {
  neuron = createNeuron();
  render();
});

el.showNetwork.addEventListener("change", render);
