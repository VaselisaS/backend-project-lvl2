import json from './json';
import plain from './plain';
import ast from './ast';

const formatters = ({
  json,
  plain,
  ast,
});

export default (data, format) => formatters[format](data);
