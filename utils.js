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

export { toNormalized, fromNormalized, argmax };
