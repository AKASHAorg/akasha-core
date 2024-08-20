import { createPackageJson, createLockFile, getLockFileName } from '@nx/js';
import { writeFileSync } from 'fs';
import { detectPackageManager, ExecutorContext, writeJsonFile } from '@nx/devkit';

export interface ExtractDependenciesExecutorOptions {
  outputPath: string;
}

export default async function buildExecutor(
  options: ExtractDependenciesExecutorOptions,
  context: ExecutorContext,
) {
  // ...your executor code
  const packageManager = detectPackageManager();

  const packageJson = createPackageJson(context.projectName, context.projectGraph, {
    root: context.root,
    isProduction: true, // We want to strip any non-prod dependencies
  });

  // do any additional manipulations to "package.json" here

  const lockFile = createLockFile(packageJson, context.projectGraph, packageManager);
  const lockFileName = getLockFileName(packageManager);
  writeJsonFile(`${options.outputPath}/package.json`, packageJson);
  writeFileSync(`${options.outputPath}/${lockFileName}`, lockFile, {
    encoding: 'utf-8',
  });

  return { success: true };
}
