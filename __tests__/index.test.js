import fs from 'fs';
import path from 'path';
import genDiff from '../src';

const getFixturePath = filename => path.join(__dirname, '..', '__fixtures__', filename);

test.each(['.json', '.yaml', '.ini'])('gendiff %s', (extension) => {
  const expectedJson = fs.readFileSync(getFixturePath('resultJson.txt'), 'utf-8');
  const expectedPlain = fs.readFileSync(getFixturePath('resultPlain.txt'), 'utf-8');

  const absolutePathAfter = getFixturePath(`after${extension}`);
  const absolutePathBefore = getFixturePath(`before${extension}`);
  const actualJson = genDiff(absolutePathBefore, absolutePathAfter, 'json');
  const actualPlain = genDiff(absolutePathBefore, absolutePathAfter, 'plain');

  expect(actualJson).toBe(expectedJson.trim());
  expect(actualPlain).toBe(expectedPlain.trim());

  const relativePathsAfter = path.join('.', '__fixtures__', `after${extension}`);
  const relativePathsBefore = path.join('.', '__fixtures__', `before${extension}`);
  const actualJson2 = genDiff(relativePathsBefore, relativePathsAfter, 'json');
  const actualPlain2 = genDiff(relativePathsBefore, relativePathsAfter, 'plain');

  expect(actualJson2).toBe(actualJson2.trim());
  expect(actualPlain2).toBe(actualPlain2.trim());
});
