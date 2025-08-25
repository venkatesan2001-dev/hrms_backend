import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

export default () => {
    let COMPANYSERVICE_CONFIG_PATH = 
    './config.yml'
    return yaml.load(
        readFileSync(join(COMPANYSERVICE_CONFIG_PATH), 'utf8'),
    ) as Record<string, any>;
};
