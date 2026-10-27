import { EXAM_RESULTS } from "../exam-results.js";

const networkContainer = document.getElementById("network-controls");

function buildControlsUI(networkWithInput, onParamChange) {
  const network = networkWithInput.slice(1);
  networkContainer.innerHTML = "";

  network.forEach((layer) => {
    const isOutputLayer = layer === network.at(-1);
    const layerContainer = createContainer("layer");
    networkContainer.append(layerContainer);

    layer.forEach((node, i) => {
      const nodeContainer = createContainer("node");
      if (isOutputLayer) {
        nodeContainer.classList.add("output");
        nodeContainer.style.borderColor = EXAM_RESULTS[i].color;
      }
      layerContainer.append(nodeContainer);

      // Add bias control
      const biasControl = createRangeControl(node);
      nodeContainer.append(biasControl);
    });
  });

  function createRangeControl(node) {
    const container = document.createElement("div");
    container.classList.add("control", "bias");

    const input = createRangeInput(node);
    const display = createDisplay(node);

    input.addEventListener("input", (event) => {
      const newValue = +event.target.value;
      display.textContent = newValue.toFixed(5);
      onParamChange(newValue, node.name);
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

function createRangeInput(node) {
  const input = document.createElement("input");
  input.type = "range";
  input.min = -2;
  input.max = 2;
  input.step = "any";
  input.className = "control__input";

  const controlName = `${node.name}-bias`;
  input.id = `input-${controlName}`;

  return input;
}

function createDisplay(node) {
  const display = document.createElement("span");
  display.className = "control__value";

  const controlName = `${node.name}-bias`;
  display.id = `value-${controlName}`;

  return display;
}

function syncControls(network) {
  network.forEach((layer) => {
    layer.forEach((node) => {
      updateControl(node.name, node.bias);
    });
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
