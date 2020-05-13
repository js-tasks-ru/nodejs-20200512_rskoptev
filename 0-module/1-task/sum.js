function sum(a, b) {
  let res = 0;
  if ((typeof a && typeof b) === 'number') {
    res = a + b;
  } else {
    throw new TypeError("Wrong type")
  }
  return res
}

module.exports = sum;
