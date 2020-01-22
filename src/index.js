import fs from 'fs';
import _ from 'lodash';
import path from 'path';
import parser from './parsers';
import render from './formatters';

const readFile = pathToFile => fs.readFileSync(pathToFile, 'utf8');

const propertyActions = [
  {
    type: 'none',
    check: (before, after, key) => before[key] instanceof Object && after[key] instanceof Object,
    getValue: () => { },
    getChildren: (before, after, func) => func(before, after),
  },
  {
    type: 'add',
    check: (before, after, key) => _.has(after, key) && !_.has(before, key),
    getValue: (__, after) => after,
    getChildren: () => { },
  },
  {
    type: 'remove',
    check: (before, after, key) => !_.has(after, key),
    getValue: _.identity,
    getChildren: () => { },
  },
  {
    type: 'change',
    check: (before, after, key) => after[key] !== before[key],
    getValue: (before, after) => ({ before, after }),
    getChildren: () => { },
  },
  {
    type: 'unchanged',
    check: (before, after, key) => after[key] === before[key],
    getValue: (__, after) => after,
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
