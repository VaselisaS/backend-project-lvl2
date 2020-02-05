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
  remove: ({ key, valueBefore }, depth) => stringify(key, valueBefore, depth, '-'),
  change: ({ key, valueBefore, valueAfter }, depth) => `${stringify(key, valueBefore, depth, '-')}\n${stringify(key, valueAfter, depth, '+')}`,
  add: ({ key, valueAfter }, depth) => stringify(key, valueAfter, depth, '+'),
  unchanged: ({ key, valueBefore }, depth) => stringify(key, valueBefore, depth, ' '),
  nested: ({ key, children }, depth, fun) => `${indent(depth)}${key}: {\n${fun(children, depth + 1)}\n${indent(depth)}}`,
};

export default (data) => {
  const iter = (dataForRender, depth) => dataForRender
    .map((node) => {
      const { type } = node;
      return typeData[type](node, depth, iter);
    })
    .join('\n');
  return `{\n${iter(data, 1)}\n}`;
};
