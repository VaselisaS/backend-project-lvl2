import fs from 'fs';
import path from 'path';
import genDiff from '../src';

const getFixturePath = filename => path.join(__dirname, '..', '__fixtures__', filename);

test.each(['.json', '.yaml', '.ini'])('gendiff %s', (extension) => {
  const expected = fs.readFileSync(getFixturePath('result.txt'), 'utf-8');

  const absolutePathAfter = getFixturePath(`after${extension}`);
  const absolutePathBefore = getFixturePath(`before${extension}`);
  const actual = genDiff(absolutePathBefore, absolutePathAfter);

  expect(actual).toBe(expected.trim());

  const relativePathsAfter = path.join('.', '__fixtures__', `after${extension}`);
  const relativePathsBefore = path.join('.', '__fixtures__', `before${extension}`);
  const actual2 = genDiff(relativePathsBefore, relativePathsAfter);

  expect(actual2).toBe(expected.trim());
});
