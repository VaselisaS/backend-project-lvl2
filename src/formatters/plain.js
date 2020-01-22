const convertedDataToString = (data) => {
  if (data instanceof Object) {
    return Object.keys(data)
      .map(key => `[${key} ${data[key]}]`)
      .join(' ');
  }
  return typeof data === 'number' || typeof data === 'boolean' ? data : `'${data}'`;
};

const typeData = {
  remove: key => `Property '${key}' was removed`,
  change: (key, value) => `Property '${key}' was updated. From ${convertedDataToString(value.valueBefore)} to ${convertedDataToString(value.valueAfter)}`,
  add: (key, value) => `Property '${key}' was added with value: ${convertedDataToString(value)}`,
  unchanged: () => '',
};

export default (data) => {
  const iter = (node, parent) => node
    .map(({
      children, key, type, value,
    }) => {
      const newKey = parent ? parent.concat('.', key) : key;
      if (children) {
        return iter(children, newKey);
      }
      return typeData[type](newKey, value);
    })
    .filter(el => !!el)
    .join('\n');
  return iter(data, '');
};
