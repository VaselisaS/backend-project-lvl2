import fs from 'fs';
import _ from 'lodash';
import path from 'path';
import parser from './parsers';
import render from './formatters';

const getParsedContent = (pathToFile) => {
  const readFile = fs.readFileSync(pathToFile, 'utf8');
  const extension = path.extname(pathToFile).slice(1);
  return parser(readFile, extension);
};

const propertyActions = [
  {
    type: 'children',
    check: (valueBefore, valueAfter, key) => valueBefore[key] instanceof Object
      && valueAfter[key] instanceof Object,
    getValue: (valueBefore, valueAfter, func) => func(valueBefore, valueAfter),
  },
  {
    type: 'add',
    check: (valueBefore, valueAfter, key) => _.has(valueAfter, key) && !_.has(valueBefore, key),
    getValue: (__, valueAfter) => valueAfter,
  },
  {
    type: 'remove',
    check: (valueBefore, valueAfter, key) => !_.has(valueAfter, key),
    getValue: _.identity,
  },
  {
    type: 'change',
    check: (valueBefore, valueAfter, key) => valueAfter[key] !== valueBefore[key],
    getValue: (valueBefore, valueAfter) => ({ valueBefore, valueAfter }),
  },
  {
    type: 'unchanged',
    check: (valueBefore, valueAfter, key) => valueAfter[key] === valueBefore[key],
    getValue: (__, valueAfter) => valueAfter,
  },
];

const getPropertyAction = (dataBefore, dataAfter, key) => _
  .find(propertyActions, ({ check }) => check(dataBefore, dataAfter, key));

const buildAst = (dataBefore, dataAfter) => _.union(Object.keys(dataBefore), Object.keys(dataAfter))
  .map((key) => {
    const { type, getValue } = getPropertyAction(dataBefore, dataAfter, key);
    return {
      key,
      type,
      value: getValue(dataBefore[key], dataAfter[key], buildAst),
    };
  });

export default (pathToFileBefore, pathFileToAfter, format) => {
  const [dataBefore, dataAfter] = [pathToFileBefore, pathFileToAfter]
    .map(pathToFile => getParsedContent(pathToFile));
  const result = buildAst(dataBefore, dataAfter);
  return render(result, format);
};
