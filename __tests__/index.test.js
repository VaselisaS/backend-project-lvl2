import fs from 'fs';
import path from 'path';
import genDiff from '../src';

const getFixturePath = filename => path.join(__dirname, '..', '__fixtures__', filename);

test('gendiffTest', () => {
  const absolutePathAfter = getFixturePath('after.json');
  const absolutePathBefore = getFixturePath('before.json');
  const expected = fs.readFileSync(getFixturePath('result.txt'), 'utf-8');
  const actual = genDiff(absolutePathBefore, absolutePathAfter);

  expect(actual).toBe(expected.trim());
  const relativePathsAfter = path.join('.', '__fixtures__', 'after.json');
  const relativePathsBefore = path.join('.', '__fixtures__', 'before.json');
  const actual2 = genDiff(relativePathsBefore, relativePathsAfter);

  expect(actual2).toBe(expected.trim());
});
