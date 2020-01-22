import fs from 'fs';
import _ from 'lodash';
import path from 'path';
import parser from './parsers';
import render from './formatters';

const readFile = pathToFile => fs.readFileSync(pathToFile, 'utf8');

const propertyActions = [
  {
    type: 'none',
    check: (after, before, key) => before[key] instanceof Object && after[key] instanceof Object,
    getValue: () => { },
    getChildren: (after, before, func) => func(before, after),
  },
  {
    type: 'add',
    check: (after, before, key) => _.has(after, key) && !_.has(before, key),
    getValue: after => ({ after }),
    getChildren: () => { },
  },
  {
    type: 'remove',
    check: (after, before, key) => !_.has(after, key),
    getValue: (after, before) => ({ before }),
    getChildren: () => { },
  },
  {
    type: 'change',
    check: (after, before, key) => after[key] !== before[key],
    getValue: (after, before) => ({ after, before }),
    getChildren: () => { },
  },
  {
    type: 'unchanged',
    check: (after, before, key) => after[key] === before[key],
    getValue: after => ({ after }),
    getChildren: () => { },
  },
];

const getPropertyAction = (dataAfter, dataBefore, key) => _
  .find(propertyActions, ({ check }) => check(dataAfter, dataBefore, key));

const compereData = (dataBefore, dataAfter) => _.uniq(
  [
    ...Object.keys(dataBefore),
    ...Object.keys(dataAfter),
  ],
).map((key) => {
  const { type, getValue, getChildren } = getPropertyAction(
    dataAfter,
    dataBefore,
    key,
  );
  return {
    key,
    type,
    value: getValue(dataAfter[key], dataBefore[key]),
    children: getChildren(dataAfter[key], dataBefore[key], compereData),
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
