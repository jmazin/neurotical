function scaleTo(v, dim) {
  return (v * 2) / dim - 1;
}

function scaleFrom(n, dim) {
  return ((n + 1) * dim) / 2;
}

function toNormalized(x, y, dim) {
  return [scaleTo(x, dim), -scaleTo(y, dim)];
}

function fromNormalized(x, y, dim) {
  return [scaleFrom(x, dim), dim - scaleFrom(y, dim)];
}

function argmax(arr) {
  return arr.indexOf(Math.max(...arr));
}

function numClasses(data) {
  return data[0].target.length;
}

function setInputWidth(input) {
  const tempSpan = document.createElement("span");
  tempSpan.style.visibility = "hidden";
  tempSpan.style.whiteSpace = "pre";
  tempSpan.textContent = input.value;

  document.body.appendChild(tempSpan);

  // Update the input width based on the temporary span's width
  input.style.width = `${input.value.length}ch`;

  // Remove the temporary element after calculation
  document.body.removeChild(tempSpan);
}

function formatElapsedTime(time) {
  let elapsed = Math.round(time);
  let units = "ms";

  if (time < 10) {
    elapsed = time.toFixed(1);
  } else if (time >= 1000) {
    elapsed = (time / 1000).toFixed(2);
    units = "s";
  }

  return `${elapsed}${units}`;
}

export { toNormalized, fromNormalized, argmax, numClasses, setInputWidth, formatElapsedTime };
