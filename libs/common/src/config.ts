import { join } from 'path';
import { ConfigModuleOptions } from '@nestjs/config';

export function createConfigModuleOptions(serviceName = 'users'): ConfigModuleOptions {
  const envFileName = `.env${process.env.NODE_ENV ? '.' + process.env.NODE_ENV : ''}`;
  const envFilePath = join(process.cwd(), `apps/${serviceName}`, envFileName);

  return {
    envFilePath,
    isGlobal: true,
  };
}
