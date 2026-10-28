const networkContainer = document.getElementById("network-controls");

function buildControlsUI(network, onParamChange) {
  networkContainer.innerHTML = "";

  const layerContainer = createContainer("layer");
  networkContainer.append(layerContainer);

  network.forEach((_, index) => {
    const nodeContainer = createContainer("node");
    nodeContainer.classList.add("output");
    layerContainer.append(nodeContainer);

    const weightControl = createRangeControl(index, "weight");
    const biasControl = createRangeControl(index, "bias");
    nodeContainer.append(weightControl, biasControl);
  });

  function createRangeControl(index, param) {
    const container = document.createElement("div");
    container.classList.add("control", param);

    const input = createRangeInput(index, param);
    const display = createDisplay(index, param);

    input.addEventListener("input", (event) => {
      const newValue = +event.target.value;
      display.textContent = newValue.toFixed(5);
      onParamChange(newValue, index, param);
    });

    const label = document.createElement("label");
    label.htmlFor = input.id;
    label.textContent = param;
    container.append(label, input, display);
    return container;
  }
}

function createContainer(name) {
  const container = document.createElement("div");
  container.className = name;
  return container;
}

function createRangeInput(index, param) {
  const input = document.createElement("input");
  input.type = "range";
  input.min = -2;
  input.max = 2;
  input.step = "any";
  input.className = "control__input";

  const controlName = `${index}-${param}`;
  input.id = `input-${controlName}`;

  return input;
}

function createDisplay(index, param) {
  const display = document.createElement("span");
  display.className = "control__value";

  const controlName = `${index}-${param}`;
  display.id = `value-${controlName}`;

  return display;
}

function syncControls(network) {
  network.forEach((node, index) => {
    updateControl(index, node.weight, "weight");
    updateControl(index, node.bias, "bias");
  });
}

function updateControl(nodeName, value, param) {
  const input = document.getElementById(`input-${nodeName}-${param}`);
  const display = document.getElementById(`value-${nodeName}-${param}`);
  if (value < Number(input.min)) input.min = Math.floor(value);
  if (value > Number(input.max)) input.max = Math.ceil(value);
  input.value = display.textContent = value.toFixed(5);
}

export { buildControlsUI, syncControls };
