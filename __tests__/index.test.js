import fs from 'fs';
import path from 'path';
import { upperFirst } from 'lodash';
import genDiff from '../src';

const fullPathToDir = path.join(__dirname, '..');
const getFixturePath = (filename, dir = fullPathToDir) => path.join(dir, '__fixtures__', filename);

test.each([
  ['.json', 'plain'],
  ['.yaml', 'json'],
  ['.ini', 'winding'],
])('gendiff extension %s format %s', (extension, format) => {
  const expected = fs.readFileSync(getFixturePath(`result${upperFirst(format)}.txt`), 'utf-8').trim();
  const absolutePathBefore = getFixturePath(`before${extension}`);
  const absolutePathAfter = getFixturePath(`after${extension}`);

  const actual = genDiff(absolutePathBefore, absolutePathAfter, format);

  expect(actual).toBe(expected);

  const relativePathsAfter = getFixturePath(`after${extension}`, '.');
  const relativePathsBefore = getFixturePath(`before${extension}`, '.');
  const actual2 = genDiff(relativePathsBefore, relativePathsAfter, format);

  expect(actual2).toBe(expected);
});
