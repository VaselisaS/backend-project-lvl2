const space = 4;

const indent = (count) => ' '.repeat(count * space);

const toString = (data, depth) => {
  if (!(data instanceof Object)) {
    return `${data}`;
  }
  const result = Object.keys(data)
    .map((key) => `${key}: ${data[key]}`)
    .join(`${indent(depth)}`);
  return `{\n${indent(depth + 1)}${result}\n${indent(depth)}}`;
};

const stringify = (key, value, depth, designation) => `${indent(depth).slice(0, -2)}${designation} ${key}: ${toString(
  value,
  depth,
)}`;

const typeData = {
  remove: (key, value, depth) => stringify(key, value, depth, '-'),
  change: (key, value, depth) => {
    const valueBefore = stringify(key, value.valueBefore, depth, '-');
    const valueAfter = stringify(key, value.valueAfter, depth, '+');
    return `${valueBefore}\n${valueAfter}`;
  },
  add: (key, value, depth) => stringify(key, value, depth, '+'),
  unchanged: (key, value, depth) => stringify(key, value, depth, ' '),
  children: (key, value, depth, fun) => `${indent(depth)}${key}: {\n${fun(value, depth + 1)}\n${indent(depth)}}`,
};

export default (data) => {
  const iter = (dataForRender, depth) => dataForRender
    .map(({ key, type, value }) => typeData[type](key, value, depth, iter))
    .join('\n');
  return `{\n${iter(data, 1)}\n}`;
};
