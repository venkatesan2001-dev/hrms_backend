import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

export default () => {
  return {
    MONGO_URI:
      'mongodb+srv://venkatesan2001official:venkatesan2001official@cluster0.we3z6ih.mongodb.net/',
    PORT: 8000,
    HASH_SECRET_KEY: 'HASH_SECRET_KEY',
    STAGE: 'DEV',
    JWT_SECRET_KEY: 'JWT_SECRET_KEY',
    JWT_EXPIRATION_TIME: 3600,
  };
  //   let COMPANYSERVICE_CONFIG_PATH = './config.yml';
  //   return yaml.load(
  //     readFileSync(join(COMPANYSERVICE_CONFIG_PATH), 'utf8'),
  //   ) as Record<string, any>;
};
