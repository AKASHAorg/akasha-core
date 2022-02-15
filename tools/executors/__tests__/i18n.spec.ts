import { getParserConfig } from '../i18n/impl';

const expectedParserConfig = {
  useKeysAsDefaultValue: true,
  locales: ['en'],
  verbose: true,
  keySeparator: false,
  nsSeparator: null,
  defaultNamespace: 'some-namespace',
  output:
    '/home/blkns/akasha/akasha-world-framework/tools/executors/locales/$LOCALE/$NAMESPACE.json',
  input: ['ui/apps/akasha/src/**/*.{ts,tsx}'],
};

describe('i18nExecutor', () => {
  it('should generate the correct parser config', async () => {
    const parserConfig = getParserConfig('some-namespace', 'ui/apps/akasha');
    expect(parserConfig).toEqual(expectedParserConfig);
  });
});
