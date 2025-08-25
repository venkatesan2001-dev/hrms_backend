import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

export default () => {
  let COMPANYSERVICE_CONFIG_PATH = './config.yml';
  const res = yaml.load(
    readFileSync(join(COMPANYSERVICE_CONFIG_PATH), 'utf8'),
  ) as Record<string, any>;
  //   const res = {
  //     MONGO_URI:
  //       'mongodb+srv://venkatesan2001official:venkatesan2001official@cluster0.we3z6ih.mongodb.net/"',
  //     PORT: 8000,
  //     HASH_SECRET_KEY: 'HASH_SECRET_KEY',
  //   };
  console.log('Configuration Loaded:', res);
  return res;
};
