const networkContainer = document.getElementById("network-controls");

// One group of sliders per neuron: a slider for each weight, then one for the bias.
function buildControlsUI(network, onParamChange) {
  networkContainer.innerHTML = "";
  const layer = createContainer("layer");
  networkContainer.append(layer);

  network.slice(1).flat().forEach((neuron, n) => {
    const group = createContainer("node");
    const heading = document.createElement("div");
    heading.textContent = neuron.name;
    group.append(heading);

    neuron.weights.forEach((_, i) => {
      const name = neuron.weights.length > 1 ? `weight ${i + 1}` : "weight";
      group.append(createRangeControl(`${n}-weight-${i}`, name, (value) => (neuron.weights[i] = value)));
    });
    group.append(createRangeControl(`${n}-bias`, "bias", (value) => (neuron.bias = value)));

    layer.append(group);
  });

  function createRangeControl(id, name, setValue) {
    const container = createContainer("control");
    container.classList.add(name === "bias" ? "bias" : "weight");

    const input = document.createElement("input");
    input.type = "range";
    input.min = -25;
    input.max = 25;
    input.step = "any";
    input.className = "control__input";
    input.id = `input-${id}`;

    const display = document.createElement("span");
    display.className = "control__value";
    display.id = `value-${id}`;

    input.addEventListener("input", (event) => {
      setValue(+event.target.value);
      onParamChange();
    });

    const label = document.createElement("label");
    label.htmlFor = input.id;
    label.textContent = name;
    container.append(label, input, display);
    return container;
  }
}

function createContainer(name) {
  const container = document.createElement("div");
  container.className = name;
  return container;
}

function syncControls(network) {
  network.slice(1).flat().forEach((neuron, n) => {
    neuron.weights.forEach((weight, i) => updateControl(`${n}-weight-${i}`, weight));
    updateControl(`${n}-bias`, neuron.bias);
  });
}

function updateControl(id, value) {
  const input = document.getElementById(`input-${id}`);
  if (value < Number(input.min)) input.min = Math.floor(value);
  if (value > Number(input.max)) input.max = Math.ceil(value);
  input.value = value;
  document.getElementById(`value-${id}`).textContent = value.toFixed(3);
}

export { buildControlsUI, syncControls };
