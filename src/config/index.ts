import defaultConfig from './default_config.json';
import overrideConfig from './override_config.json';
import _ from 'lodash/fp';
const regexConfig = {
  regex: {
    password: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/,
    email: /^[a-z][a-z0-9_\.]{5,40}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$/,
    phone: /^([+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*){8,}$/,
  },
};
let config = _.merge(defaultConfig, overrideConfig);
config = _.merge(config, regexConfig);
export { config };