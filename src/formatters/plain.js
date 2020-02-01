import _ from 'lodash';

const toString = (data) => {
  if (_.isObject(data)) {
    return '[complex value]';
  }
  if (_.isString(data)) {
    return `'${data}'`;
  }
  return data;
};

const typeData = {
  remove: (key) => `Property '${key}' was removed`,
  change: (key, value) => `Property '${key}' was updated. From ${toString(value.valueBefore)} to ${toString(value.valueAfter)}`,
  add: (key, value) => `Property '${key}' was added with value: ${toString(value.valueAfter)}`,
  unchanged: () => null,
  nested: (key, value, fun) => fun(value.children, key),
};

export default (data) => {
  const iter = (node, parent) => node
    .map(({ key, type, ...values }) => {
      const newKey = parent ? parent.concat('.', key) : key;
      return typeData[type](newKey, values, iter);
    })
    .filter((el) => !!el)
    .join('\n');
  return iter(data, '');
};
