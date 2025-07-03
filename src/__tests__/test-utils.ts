import type { Config } from '../core';

export const mustConfigByName = (configs: Config[], name: string): Config => {
  const config = configs.find(c => c.name === name);
  if (!config) throw new Error(`Config not found: ${name}`);
  return config;
};
