import { MUSHROOMS } from "../mushroom-info.js";

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
        nodeContainer.style.borderColor = MUSHROOMS[i].color;
      }
      layerContainer.append(nodeContainer);

      // Add weight controls
      node.weights.forEach((_, i) => {
        const weightControl = createRangeControl(node, i);
        nodeContainer.append(weightControl);
      });

      // Add bias control
      const biasControl = createRangeControl(node);
      nodeContainer.append(biasControl);
    });
  });

  function createRangeControl(node, weightIndex = null) {
    const container = document.createElement("div");
    container.classList.add("control", weightIndex !== null ? "weight" : "bias");

    const input = createRangeInput(node, weightIndex);
    const display = createDisplay(node, weightIndex);

    input.addEventListener("input", (event) => {
      const newValue = +event.target.value;
      display.textContent = newValue.toFixed(5);
      onParamChange(newValue, node.name, weightIndex);
    });

    container.append(input, display);
    return container;
  }
}

function createContainer(name) {
  const container = document.createElement("div");
  container.className = name;
  return container;
}

function createRangeInput(node, weightIndex) {
  const input = document.createElement("input");
  input.type = "range";
  input.min = -25;
  input.max = 25;
  input.step = "any";
  input.className = "control__input";

  const controlName = `${node.name}-${weightIndex ?? "bias"}`;
  input.id = `input-${controlName}`;
  input.value = node.weights[weightIndex] ?? node.bias;

  return input;
}

function createDisplay(node, weightIndex) {
  const display = document.createElement("span");
  display.className = "control__value";

  const controlName = `${node.name}-${weightIndex ?? "bias"}`;
  display.id = `value-${controlName}`;
  display.innerText = (node.weights[weightIndex] ?? node.bias).toFixed(5);

  return display;
}

export { buildControlsUI };
