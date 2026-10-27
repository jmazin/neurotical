import { EXAM_RESULTS } from "../exam-results.js";

const container = document.getElementById("prediction");

function buildPredictionUI() {
  container.innerHTML = "";

  const resultEl = document.createElement("div");
  resultEl.className = "prediction__mushroom";
  resultEl.id = "prediction-result";

  const labelEl = document.createElement("div");
  labelEl.className = "prediction__label";
  labelEl.id = "prediction-label";

  const valueEl = document.createElement("div");
  valueEl.className = "prediction__value";
  valueEl.id = "prediction-output";

  resultEl.append(labelEl, valueEl);
  container.appendChild(resultEl);
}

function updatePredictionUI(output, network, sum) {
  const { label, color } = EXAM_RESULTS[Number(sum >= 0)];
  document.getElementById("prediction-result").style.color = color;
  document.getElementById("prediction-label").textContent = label;
  document.getElementById("prediction-output").textContent = network[1][0].activation === "sigmoid"
    ? `p: ${(output * 100).toFixed(1)}%`
    : `sum: ${output.toFixed(3)}`;
}

export { buildPredictionUI, updatePredictionUI };
