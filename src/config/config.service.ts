import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as path from 'path';

type EnvType =
  | 'DB_PORT'
  | 'DB_NAME'
  | 'DB_HOST'
  | 'DB_USER'
  | 'DB_PWD'
  | 'PORT';

@Injectable()
export class ConfigService {
  constructor() {
    let filename = '.env';
    if (process.env.NODE_ENV === 'test') {
      filename = `.env.${process.env.NODE_ENV}`;
    }
    dotenv.config({
      path: path.resolve(process.cwd(), filename),
    });
  }

  getBoolean(key: EnvType) {
    return !!process.env[key];
  }

  getNumber(key: EnvType) {
    return +process.env[key] as number | undefined;
  }

  getString(key: EnvType) {
    return process.env[key];
  }
}

export const configService = new ConfigService();
