import { MUSHROOMS } from "../mushroom-info.js";

const container = document.getElementById("prediction");

function buildPredictionUI() {
  MUSHROOMS.forEach(({ label, color }) => {
    const mushroomEl = document.createElement("div");
    mushroomEl.className = "prediction__mushroom";
    mushroomEl.id = `prediction-${label}`;
    mushroomEl.style.color = color;

    const labelEl = document.createElement("div");
    labelEl.className = "prediction__label";
    labelEl.textContent = label;

    const valueEl = document.createElement("div");
    valueEl.className = "prediction__value";

    mushroomEl.append(labelEl, valueEl);
    container.appendChild(mushroomEl);
  });
}

function updatePredictionUI(output) {
  const sortedOutput = [...output].sort((a, b) => b - a);

  MUSHROOMS.forEach(({ label }, index) => {
    const value = output[index];
    const element = document.getElementById(`prediction-${label}`);
    element.style.order = sortedOutput.indexOf(value);
    element.querySelector(".prediction__value").textContent = value.toFixed(3);
  });
}

export { buildPredictionUI, updatePredictionUI };
