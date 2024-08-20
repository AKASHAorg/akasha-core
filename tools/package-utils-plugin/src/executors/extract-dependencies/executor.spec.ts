import { ExtractDependenciesExecutorSchema } from './schema';
import executor from './executor';

const options: ExtractDependenciesExecutorSchema = {};

describe('ExtractDependencies Executor', () => {
  it('can run', async () => {
    const output = await executor(options);
    expect(output.success).toBe(true);
  });
});
