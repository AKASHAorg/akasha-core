import { ILoaderConfig, ISdkConfig, LogLevels } from '@akashaproject/ui-awf-typings/lib/app-loader';

console.time('AppLoader:firstMount');

declare const __DEV__: boolean;

(async function bootstrap(System) {
  const { default: Loader } = await System.import('@akashaproject/ui-app-loader');
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
      '@akashaproject/app-integration-center',
      '@akashaproject/app-profile',
      '@akashaproject/app-notifications',
      '@akashaproject/app-legal',
      '@akashaproject/app-bookmarks',
    ],
    // pre-installed widgets;
    // layout widget is always loaded by default
    defaultWidgets: [
      '@akashaproject/ui-widget-topbar',
      '@akashaproject/ui-widget-trending',
      '@akashaproject/ui-widget-analytics',
      // '@akashaproject/ui-widget-sidebar',
    ],
    analytics: {
      trackerUrl: process.env.MATOMO_TRACKER_URL,
      siteId: process.env.MATOMO_SITE_ID,
    },
    registryOverrides,
  };

  const sdk = getSDK();
  const loader = new Loader({ ...loaderConfig, ...sdkConfig }, sdk);
  await loader.start();

  // tslint:disable-next-line:no-console
  console.log('initial sdk instance', sdk);
})(globalThis.System);
