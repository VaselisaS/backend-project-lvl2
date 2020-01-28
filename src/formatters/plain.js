const toString = (data) => {
  if (!(data instanceof Object)) {
    return typeof data === 'number' || typeof data === 'boolean'
      ? data
      : `'${data}'`;
  }
  return Object.keys(data)
    .map((key) => `[${key} ${data[key]}]`)
    .join(' ');
};

const typeData = {
  remove: (key) => `Property '${key}' was removed`,
  change: (key, value) => `Property '${key}' was updated. From ${toString(
    value.valueBefore,
  )} to ${toString(value.valueAfter)}`,
  add: (key, value) => `Property '${key}' was added with value: ${toString(value)}`,
  unchanged: () => '',
  children: (key, value, fun) => fun(value, key),
};

export default (data) => {
  const iter = (node, parent) => node
    .map(({ key, type, value }) => {
      const newKey = parent ? parent.concat('.', key) : key;
      return typeData[type](newKey, value, iter);
    })
    .filter((el) => !!el)
    .join('\n');
  return iter(data, '');
};
