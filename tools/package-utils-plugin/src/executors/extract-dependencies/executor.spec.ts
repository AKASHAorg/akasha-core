import { ExtractDependenciesExecutorOptions } from './schema';
import executor from './executor';
import path from 'path';

const options: ExtractDependenciesExecutorOptions = {
  outputPath: 'dist/test-executor',
};
const projectRoot = path.resolve(__dirname, '../../../../../');
describe('ExtractDependencies Executor', () => {
  it('can run', async () => {
    const output = await executor(options, {
      cwd: projectRoot,
      root: projectRoot,
      isVerbose: true,
    });
    expect(output.success).toBe(false);
  });
});
