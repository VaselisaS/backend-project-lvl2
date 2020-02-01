import _ from 'lodash';

const space = 4;

const indent = (count) => ' '.repeat(count * space);

const toString = (data, depth) => {
  if (!_.isObject(data)) {
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
  remove: (key, value, depth) => stringify(key, value.valueBefore, depth, '-'),
  change: (key, value, depth) => {
    const valueBefore = stringify(key, value.valueBefore, depth, '-');
    const valueAfter = stringify(key, value.valueAfter, depth, '+');
    return `${valueBefore}\n${valueAfter}`;
  },
  add: (key, value, depth) => stringify(key, value.valueAfter, depth, '+'),
  unchanged: (key, value, depth) => stringify(key, value.valueBefore, depth, ' '),
  nested: (key, value, depth, fun) => `${indent(depth)}${key}: {\n${fun(value.children, depth + 1)}\n${indent(depth)}}`,
};

export default (data) => {
  const iter = (dataForRender, depth) => dataForRender
    .map(({ key, type, ...values }) => typeData[type](key, values, depth, iter))
    .join('\n');
  return `{\n${iter(data, 1)}\n}`;
};
