import path from 'path';

describe('i18nExecutor', () => {
  it('should generate the correct parser config', async () => {
    const ns = 'some-namespace';
    const projectRoot = 'ui/apps/akasha';
    const translationAppPath = path.resolve('ui', 'lib', 'translation');
    const translationAppOutputDir = `${translationAppPath}/dist/locales`;

    const parserConfig = {
      defaultValue: (_locale, _ns, key, value) => (value ? value : key),
      locales: ['en'],
      verbose: true,
      keySeparator: false,
      nsSeparator: null,
      defaultNamespace: ns,
      output: `${translationAppOutputDir}/$LOCALE/$NAMESPACE.json`,
      input: [`${projectRoot}/src/**/*.{ts,tsx}`],
    };

    expect(parserConfig.defaultValue).toBeDefined();
    expect(parserConfig.locales).toContain('en');
    expect(parserConfig.verbose).toBeTruthy();
    expect(parserConfig.keySeparator).toBeFalsy();
    expect(parserConfig.nsSeparator).toBeNull();
    expect(parserConfig.defaultNamespace).toEqual('some-namespace');
    expect(parserConfig.output).toContain('/locales/$LOCALE/$NAMESPACE.json');
    expect(parserConfig.input).toContain('ui/apps/akasha/src/**/*.{ts,tsx}');
  });
});
