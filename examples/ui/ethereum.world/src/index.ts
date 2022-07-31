import { ILoaderConfig, INTEGRATION_TYPES } from '@akashaorg/ui-awf-typings/lib/app-loader';

console.time('AppLoader:firstMount');

declare const __DEV__: boolean;

(async function bootstrap(System) {
  const { default: startLoader } = await System.import('@akashaorg/ui-app-loader');
  const { default: getSDK } = await System.import('@akashaorg/awf-sdk');

  let registryOverrides = [
    {
      name: '@akashaorg/app-translation',
      integrationType: INTEGRATION_TYPES.APPLICATION,
      sources: ['/apps/translation/index.js'],
    },
    {
      name: '@akashaorg/app-routing',
      integrationType: INTEGRATION_TYPES.APPLICATION,
      sources: ['/apps/routing/index.js'],
    },
    {
      name: '@akashaorg/ui-widget-layout',
      integrationType: INTEGRATION_TYPES.WIDGET,
      sources: ['/widgets/layout/index.js'],
    },
    {
      name: '@akashaorg/ui-widget-sidebar',
      integrationType: INTEGRATION_TYPES.WIDGET,
      sources: ['/widgets/sidebar/index.js'],
    },
    {
      name: '@akashaorg/ui-widget-topbar',
      integrationType: INTEGRATION_TYPES.WIDGET,
      sources: ['/widgets/topbar/index.js'],
    },
    {
      name: '@akashaorg/ui-widget-mini-profile',
      integrationType: INTEGRATION_TYPES.WIDGET,
      sources: ['/widgets/mini-profile/index.js'],
    },
    {
      name: '@akashaorg/ui-widget-my-apps',
      integrationType: INTEGRATION_TYPES.WIDGET,
      sources: ['/widgets/my-apps/index.js'],
    },
  ];

  if (__DEV__) {
    registryOverrides = (await import('./registry-overrides')).default;
  }

  const loaderConfig: ILoaderConfig = {
    title: 'Ethereum World',
    // main layout (shell)
    layout: '@akashaorg/ui-widget-layout',
    // define an app that will load at root '/' path
    homepageApp: '@akashaorg/app-akasha-integration',
    // define pre-installed apps,
    // homepageApp is always loaded by default
    defaultApps: [
      '@akashaorg/app-routing',
      '@akashaorg/app-moderation-ewa',
      '@akashaorg/app-auth-ewa',
      '@akashaorg/app-integration-center',
      '@akashaorg/app-search',
      '@akashaorg/app-profile',
      '@akashaorg/app-notifications',
      '@akashaorg/app-legal',
      '@akashaorg/app-translation',
      '@akashaorg/app-bookmarks',
      '@akashaorg/app-settings-ewa',
      //'@akashaorg/app-messaging',
    ],
    // pre-installed widgets;
    // layout widget is always loaded by default
    defaultWidgets: [
      '@akashaorg/ui-widget-topbar',
      '@akashaorg/ui-widget-trending',
      '@akashaorg/ui-widget-analytics',
      '@akashaorg/ui-widget-sidebar',
      '@akashaorg/ui-widget-mini-profile',
      '@akashaorg/ui-widget-my-apps',
    ],
    analytics: {
      trackerUrl: process.env.MATOMO_TRACKER_URL,
      siteId: process.env.MATOMO_SITE_ID,
    },
    registryOverrides,
  };

  const sdk = getSDK();
  startLoader(loaderConfig);

  // tslint:disable-next-line:no-console
  console.log('initial sdk instance', sdk);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
})(globalThis.System);
