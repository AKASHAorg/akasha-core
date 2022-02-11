import { ExecutorContext } from '@nrwl/devkit';
import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

const outputRoot = path.resolve('locales');
const executorRoot = path.resolve('tools', 'executors');

const getParserConfig = (ns: string, pkgRootPath: string) => ({
  useKeysAsDefaultValue: true,
  locales: ['en'],
  verbose: true,
  keySeparator: false,
  nsSeparator: null,
  defaultNamespace: ns,
  output: `${outputRoot}/$LOCALE/$NAMESPACE.json`,
  input: [`${pkgRootPath}/src/**/*.{ts,tsx}`],
});

export interface i18nExecutorOptions {
  cwd: string;
}

export default async function i18nExecutor(options: i18nExecutorOptions, context: ExecutorContext) {
  const currentProject = context.projectName;
  const namespace = currentProject.split('/')[1];
  const projectRoot = path.resolve(options.cwd);
  const config = getParserConfig(namespace, projectRoot);
  const configPath = `${executorRoot}/dist/i18next-parser.${namespace}.config.js`;

  fs.mkdirSync(`${executorRoot}/dist`, { recursive: true });
  fs.writeFileSync(configPath, `module.exports=${JSON.stringify(config)}`, 'utf-8');

  const { stdout, stderr } = await promisify(exec)(`i18next --config ${configPath}`);
  if (stderr) {
    console.error(stderr);
  }
  console.log(stdout);
  return { success: true };
}
