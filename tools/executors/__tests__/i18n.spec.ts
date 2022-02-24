import { getParserConfig } from '../i18n/impl';

describe('i18nExecutor', () => {
  it('should generate the correct parser config', async () => {
    const parserConfig = getParserConfig('some-namespace', 'ui/apps/akasha');
    expect(parserConfig.useKeysAsDefaultValue).toBeTruthy();
    expect(parserConfig.locales).toContain('en');
    expect(parserConfig.verbose).toBeTruthy();
    expect(parserConfig.keySeparator).toBeFalsy();
    expect(parserConfig.nsSeparator).toBeNull();
    expect(parserConfig.defaultNamespace).toEqual('some-namespace');
    expect(parserConfig.output).toContain('/locales/$LOCALE/$NAMESPACE.json');
    expect(parserConfig.input).toContain('ui/apps/akasha/src/**/*.{ts,tsx}');
  });
});
