import yaml from 'js-yaml';
import ini from 'ini';

export default {
  json: data => JSON.parse(data),
  yaml: data => yaml.safeLoad(data),
  ini: data => ini.parse(data),
};
