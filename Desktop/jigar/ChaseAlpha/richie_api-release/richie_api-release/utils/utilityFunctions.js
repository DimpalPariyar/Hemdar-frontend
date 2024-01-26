function getObjKey(obj, value) {
  return Object.keys(obj).find((key) => obj[key] === value);
}

const addPercent = (value, percent) => {
  return +((percent / 100) * value + value).toFixed(1);
};

module.exports = {
  getObjKey,
  addPercent,
};
