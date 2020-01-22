import fs from 'fs';
import _ from 'lodash';
import path from 'path';
import parser from './parsers';
import render from './formatters';

const readFile = pathToFile => fs.readFileSync(pathToFile, 'utf8');

const propertyActions = [
  {
    type: 'none',
    check: (valueBefore, valueAfter, key) => valueBefore[key] instanceof Object
      && valueAfter[key] instanceof Object,
    getValue: () => { },
    getChildren: (valueBefore, valueAfter, func) => func(valueBefore, valueAfter),
  },
  {
    type: 'add',
    check: (valueBefore, valueAfter, key) => _.has(valueAfter, key) && !_.has(valueBefore, key),
    getValue: (__, valueAfter) => valueAfter,
    getChildren: () => { },
  },
  {
    type: 'remove',
    check: (valueBefore, valueAfter, key) => !_.has(valueAfter, key),
    getValue: _.identity,
    getChildren: () => { },
  },
  {
    type: 'change',
    check: (valueBefore, valueAfter, key) => valueAfter[key] !== valueBefore[key],
    getValue: (valueBefore, valueAfter) => ({ valueBefore, valueAfter }),
    getChildren: () => { },
  },
  {
    type: 'unchanged',
    check: (valueBefore, valueAfter, key) => valueAfter[key] === valueBefore[key],
    getValue: (__, valueAfter) => valueAfter,
    getChildren: () => { },
  },
];

const getPropertyAction = (dataBefore, dataAfter, key) => _
  .find(propertyActions, ({ check }) => check(dataBefore, dataAfter, key));

const compereData = (dataBefore, dataAfter) => _.uniq(
  [
    ...Object.keys(dataBefore),
    ...Object.keys(dataAfter),
  ],
).map((key) => {
  const { type, getValue, getChildren } = getPropertyAction(
    dataBefore,
    dataAfter,
    key,
  );
  return {
    key,
    type,
    value: getValue(dataBefore[key], dataAfter[key]),
    children: getChildren(dataBefore[key], dataAfter[key], compereData),
  };
});

export default (pathBefore, pathAfter, format) => {
  const [dataBefore, dataAfter] = [pathBefore, pathAfter].map((pathToFile) => {
    const extension = path.extname(pathToFile).slice(1);
    return parser[extension](readFile(pathToFile));
  });
  const result = compereData(dataBefore, dataAfter);
  return render[format](result);
};
