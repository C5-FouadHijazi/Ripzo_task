const NodeCache = require("node-cache");

const cache = new NodeCache({ stdTTL: 5 * 60 });

function getKey(from, to, day) {
  const key = `${from}-${to}-${day}}`;
  return key;
}

function set(from, to, day, data) {
  const key = getKey(from, to, day);
  cache.set(key, data);
}

function get(from, to, day) {
  const key = getKey(from, to, day);
  const data = cache.get(key);
  return data;
}

module.exports = { get, set };
