import { ILoaderConfig, ISdkConfig, LogLevels } from '@akashaproject/ui-awf-typings/lib/app-loader';

console.time('AppLoader:firstMount');

declare const __DEV__: boolean;

(async function bootstrap(System) {
  const { default: Loader } = await System.import('@akashaproject/app-loader');
  const { default: getSDK } = await System.import('@akashaproject/awf-sdk');

  const sdkConfig: ISdkConfig = {
    logLevel: LogLevels.DEBUG,
  };
  let registryOverrides = [];

  if (__DEV__) {
    registryOverrides = (await import('./registry-overrides')).default;
  }

  const loaderConfig: ILoaderConfig = {
    title: 'Ethereum World',
    // main layout (shell)
    layout: '@akashaproject/ui-widget-layout',
    // define an app that will load at root '/' path
    homepageApp: '@akashaproject/app-akasha-integration',
    // define pre-installed apps,
    // homepageApp is always loaded by default
    defaultApps: [
      '@akashaproject/app-moderation-ewa',
      '@akashaproject/app-search',
      '@akashaproject/app-auth-ewa',
      '@akashaproject/app-settings-ewa',
      '@akashaproject/ui-plugin-app-center',
      '@akashaproject/ui-plugin-profile',
      '@akashaproject/ui-plugin-notifications',
      '@akashaproject/ui-plugin-legal',
      '@akashaproject/ui-plugin-bookmarks',
    ],
    // pre-installed widgets;
    // layout widget is always loaded by default
    defaultWidgets: [
      { name: '@akashaproject/ui-widget-topbar', version: '0.0.1' },
      '@akashaproject/ui-widget-trending',
      // '@akashaproject/ui-widget-sidebar',
    ],
    registryOverrides,
  };

  const sdk = getSDK();
  const loader = new Loader({ ...loaderConfig, ...sdkConfig }, sdk);
  await loader.start();

  // tslint:disable-next-line:no-console
  console.log('initial sdk instance', sdk);
})(globalThis.System);
