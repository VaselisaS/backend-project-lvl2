import { has } from 'lodash';
import fs from 'fs';
import path from 'path';
import parser from './parsers';

const readFile = pathToFile => fs.readFileSync(pathToFile, 'utf8');

const render = {
  remove: (data, key) => `  - ${key}: ${data[key]}`,
  change: (data, changedData, key) => `  + ${key}: ${data[key]}\n  - ${key}: ${changedData[key]}`,
  add: (data, key) => `  + ${key}: ${data[key]}`,
  unchanged: (data, key) => `    ${key}: ${data[key]}`,
};

const compereData = (dataBefore, dataAfter) => {
  const mergeData = { ...dataBefore, ...dataAfter };
  const result = Object.keys(mergeData).map((key) => {
    if (has(dataAfter, key) && !has(dataBefore, key)) {
      return render.add(mergeData, key);
    }
    if (!has(dataAfter, key)) {
      return render.remove(mergeData, key);
    }
    return dataAfter[key] === dataBefore[key]
      ? render.unchanged(dataAfter, key)
      : render.change(dataAfter, dataBefore, key);
  });
  return `{\n${result.join('\n')}\n}`;
};

export default (...pathToFiles) => {
  const [dataBefore, dataAfter] = pathToFiles
    .map((pathToFile) => {
      const extension = path.extname(pathToFile).slice(1);
      return parser[extension](readFile(pathToFile));
    });
  const result = compereData(dataBefore, dataAfter);
  return result;
};
