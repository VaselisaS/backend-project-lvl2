const space = 4;

const toString = (data, depth) => {
  if (data instanceof Object) {
    const result = Object.keys(data)
      .map(key => `${key}: ${data[key]}`)
      .join(`${' '.repeat(space + space * depth)}`);
    return `{\n${' '.repeat(space + space * depth)}${result}\n${' '.repeat(space * depth)}}`;
  }
  return `${data}`;
};

const stringify = (key, value, depth, designation) => `${' '.repeat(space * depth)
  .slice(0, -2)}${designation} ${key}: ${toString(value, depth)}`;

const typeData = {
  remove: (key, value, depth) => stringify(key, value, depth, '-'),
  change: (key, value, depth) => {
    const valueBefore = stringify(key, value.valueBefore, depth, '-');
    const valueAfter = stringify(key, value.valueAfter, depth, '+');
    return `${valueBefore}\n${valueAfter}`;
  },
  add: (key, value, depth) => stringify(key, value, depth, '+'),
  unchanged: (key, value, depth) => stringify(key, value, depth, ' '),
};

export default (data) => {
  const iter = (dataForRender, depth) => dataForRender
    .map(({ key, type, value }) => {
      if (type === 'children') {
        return `${' '.repeat(space * depth)}${key}: {\n${iter(value, depth + 1)}\n${' '.repeat(space * depth)}}`;
      }
      return `${typeData[type](key, value, depth)}`;
    })
    .join('\n');
  return `{\n${iter(data, 1)}\n}`;
};
