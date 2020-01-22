const space = 4;

const convertedDataToString = (data, depth) => {
  if (data instanceof Object) {
    const result = Object.keys(data)
      .map(key => `${key}: ${data[key]}`)
      .join(`${' '.repeat(space + space * depth)}`);
    return `{\n${' '.repeat(space + space * depth)}${result}\n${' '.repeat(space * depth)}}`;
  }
  return `${data}`;
};

const stringify = (key, value, depth, designation) => `${' '.repeat(space * depth)
  .slice(0, -2)}${designation} ${key}: ${convertedDataToString(value, depth)}`;

const typeData = {
  remove: (key, value, depth) => stringify(key, value.before, depth, '-'),
  change: (key, value, depth) => `${stringify(key, value.before, depth, '-')}\n${stringify(key, value.after, depth, '+')}`,
  add: (key, value, depth) => stringify(key, value.after, depth, '+'),
  unchanged: (key, value, depth) => stringify(key, value.after, depth, ' '),
};

export default (data) => {
  const iter = (dataForRender, depth) => dataForRender
    .map(({
      children, key, type, value,
    }) => {
      if (children) {
        return `${' '.repeat(space * depth)}${key}: {\n${iter(children, depth + 1)}\n${' '.repeat(space * depth)}}`;
      }
      return `${typeData[type](key, value, depth)}`;
    })
    .join('\n');
  return `{\n${iter(data, 1)}\n}`;
};
