import 'systemjs-webpack-interop/auto-public-path';

export const register = options => ({
  activeWhen: (location, pathToActiveWhen) => {
    return pathToActiveWhen('/hello-ethereum-world')(location);
  },
  loadingFn: () => import('./components'),
  mountsIn: options.layoutConfig?.pluginSlotId,
  logo: { type: 'icon', value: 'appAkasha' },
  i18nNamespace: ['app-akasha-integration', 'ui-lib-feed'],
});
