import { has } from 'lodash';
import fs from 'fs';

const readFile = path => fs.readFileSync(path, 'utf8');

const render = {
  remove: (data, key) => `-${key}: ${data[key]}`,
  change: (data, changedData, key) => `+${key}: ${data[key]}\n\t-${key}: ${changedData[key]}`,
  add: (data, key) => `+${key}: ${data[key]}`,
  unchanged: (data, key) => `${key}: ${data[key]}`,
};

const parser = (dataBefore, dataAfter) => {
  const mergeData = { ...dataBefore, ...dataAfter };
  const result = Object.keys(mergeData).map((key) => {
    if (has(dataAfter, key) && has(dataBefore, key)) {
      return dataAfter[key] === dataBefore[key]
        ? render.unchanged(dataAfter, key)
        : render.change(dataAfter, dataBefore, key);
    }
    if (!has(dataAfter, key)) {
      return render.remove(mergeData, key);
    }
    return render.add(mergeData, key);
  });
  return `{\n\t${result.join('\n\t')}\n}`;
};

export default (...pathToFiles) => {
  const [dataBefore, dataAfter] = pathToFiles.map(path => JSON.parse(readFile(path)));
  const result = parser(dataBefore, dataAfter);
  return result;
};
