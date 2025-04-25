const predictionEl = document.getElementById("prediction");

function buildPredictionUI() {
  predictionEl.innerHTML = "";

  for (let i = 0; i < 10; i++) {
    const classEl = document.createElement("div");
    classEl.className = "digit-class";
    classEl.id = `digit-class-${i}`;

    const labelEl = document.createElement("div");
    labelEl.textContent = i;
    classEl.append(labelEl);

    const valEl = document.createElement("div");
    valEl.className = "prediction-val";
    classEl.append(valEl);

    predictionEl.append(classEl);
  }
}

function updatePredictionUI(output) {
  const sortedIndices = [...output]
    .map((val, index) => ({ val, index }))
    .sort((a, b) => b.val - a.val)
    .map(({ index }) => index);

  output.forEach((val, i) => {
    const classEl = document.getElementById(`digit-class-${i}`);
    classEl.classList.toggle("first", i === sortedIndices[0]);
    classEl.style.order = sortedIndices.indexOf(i);
    classEl.querySelector(".prediction-val").textContent = val.toFixed(3);
  });
}

export { buildPredictionUI, updatePredictionUI };
