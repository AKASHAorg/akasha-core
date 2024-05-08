import { ExecutorContext } from '@nrwl/devkit';
import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

export interface i18nExecutorOptions {
  cwd: string;
}

export default async function i18nExecutor(options: i18nExecutorOptions, context: ExecutorContext) {
  const outputDir = path.resolve(__dirname, `../../../dist/locales`);
  const executorRoot = path.resolve('tools', 'executors');

  const currentProject = context.projectName;
  const namespace = currentProject.split('/')[1];
  const projectRoot = path.resolve(options.cwd);

  const configPath = `${executorRoot}/dist/i18next-parser.${namespace}.config.js`;
  // const configPathInApp = `${executorRoot}/dist/i18next-parser.${namespace}.InApp.config.js`;

  fs.mkdirSync(`${executorRoot}/dist`, { recursive: true });
  fs.writeFileSync(
    configPath,
    `module.exports={
    defaultValue: (_locale, _ns, key, value) => value ? value : key,
    locales: ['en'],
    verbose: true,
    keySeparator: false,
    nsSeparator: null,
    defaultNamespace: "${namespace}",
    output: "${outputDir}/$LOCALE/$NAMESPACE.json",
    input: ["${projectRoot}/src/**/*.{ts,tsx}"],
  };`,
    'utf-8',
  );

  const { stdout, stderr } = await promisify(exec)(`i18next --config ${configPath}`);
  // await promisify(exec)(`i18next --config ${configPathInApp}`);
  if (stderr) {
    console.error(stderr);
  }
  console.log(stdout);
  return { success: !stderr };
}
