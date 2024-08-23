import { createPackageJson, createLockFile, getLockFileName } from '@nx/js';
import { writeFileSync } from 'fs';
import { detectPackageManager, ExecutorContext, writeJsonFile } from '@nx/devkit';
import { ExtractDependenciesExecutorOptions } from './schema';

export default async function buildExecutor(
  options: ExtractDependenciesExecutorOptions,
  context: ExecutorContext,
) {
  const packageManager = detectPackageManager();

  if (!context.projectName) {
    return { success: false };
  }

  const packageJson = createPackageJson(context.projectName, context.projectGraph, {
    root: context.root,
    isProduction: true, // We want to strip any non-prod dependencies
  });

  const lockFile = createLockFile(packageJson, context.projectGraph, packageManager);
  const lockFileName = getLockFileName(packageManager);
  writeJsonFile(`${options.outputPath}/package.json`, packageJson);
  writeFileSync(`${options.outputPath}/${lockFileName}`, lockFile, {
    encoding: 'utf-8',
  });

  return { success: true };
}
