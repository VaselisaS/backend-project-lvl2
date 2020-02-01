import json from './json';
import plain from './plain';
import winding from './winding';

const formatters = {
  json,
  plain,
  winding,
};

export default (data, format) => formatters[format](data);
