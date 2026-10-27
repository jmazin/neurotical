import { EXAM_RESULTS } from "../exam-results.js";

const networkContainer = document.getElementById("network-controls");

function buildControlsUI(network, onParamChange) {
  networkContainer.innerHTML = "";

  const layerContainer = createContainer("layer");
  networkContainer.append(layerContainer);

  network.forEach((_, index) => {
    const nodeContainer = createContainer("node");
    nodeContainer.classList.add("output");
    nodeContainer.style.borderColor = EXAM_RESULTS[0].color;
    layerContainer.append(nodeContainer);

    const biasControl = createRangeControl(index);
    nodeContainer.append(biasControl);
  });

  function createRangeControl(index) {
    const container = document.createElement("div");
    container.classList.add("control", "bias");

    const input = createRangeInput(index);
    const display = createDisplay(index);

    input.addEventListener("input", (event) => {
      const newValue = +event.target.value;
      display.textContent = newValue.toFixed(5);
      onParamChange(newValue, index);
    });

    const label = document.createElement("label");
    label.htmlFor = input.id;
    label.textContent = "bias";
    container.append(label, input, display);
    return container;
  }
}

function createContainer(name) {
  const container = document.createElement("div");
  container.className = name;
  return container;
}

function createRangeInput(index) {
  const input = document.createElement("input");
  input.type = "range";
  input.min = -2;
  input.max = 2;
  input.step = "any";
  input.className = "control__input";

  const controlName = `${index}-bias`;
  input.id = `input-${controlName}`;

  return input;
}

function createDisplay(index) {
  const display = document.createElement("span");
  display.className = "control__value";

  const controlName = `${index}-bias`;
  display.id = `value-${controlName}`;

  return display;
}

function syncControls(network) {
  network.forEach((node, index) => {
    updateControl(index, node.bias);
  });
}

function updateControl(nodeName, value) {
  const input = document.getElementById(`input-${nodeName}-bias`);
  const display = document.getElementById(`value-${nodeName}-bias`);
  if (value < Number(input.min)) input.min = Math.floor(value);
  if (value > Number(input.max)) input.max = Math.ceil(value);
  input.value = display.textContent = value.toFixed(5);
}

export { buildControlsUI, syncControls };
