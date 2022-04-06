import { ILoaderConfig, INTEGRATION_TYPES } from '@akashaproject/ui-awf-typings/lib/app-loader';

console.time('AppLoader:firstMount');

declare const __DEV__: boolean;

(async function bootstrap(System) {
  const { default: startLoader } = await System.import('@akashaproject/ui-app-loader');
  const { default: getSDK } = await System.import('@akashaproject/awf-sdk');

  let registryOverrides = [
    {
      name: '@akashaproject/app-translation',
      integrationType: INTEGRATION_TYPES.APPLICATION,
      sources: ['/apps/translation/index.js'],
    },
    {
      name: '@akashaproject/app-routing',
      integrationType: INTEGRATION_TYPES.APPLICATION,
      sources: ['/apps/routing/index.js'],
    },
    {
      name: '@akashaproject/ui-widget-layout',
      integrationType: INTEGRATION_TYPES.WIDGET,
      sources: ['/widgets/layout/index.js'],
    },
    {
      name: '@akashaproject/ui-widget-sidebar',
      integrationType: INTEGRATION_TYPES.WIDGET,
      sources: ['/widgets/sidebar/index.js'],
    },
    {
      name: '@akashaproject/ui-widget-topbar',
      integrationType: INTEGRATION_TYPES.WIDGET,
      sources: ['/widgets/topbar/index.js'],
    },
  ];

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
      '@akashaproject/app-translation',
      '@akashaproject/app-routing',
      '@akashaproject/app-bookmarks',
    ],
    // pre-installed widgets;
    // layout widget is always loaded by default
    defaultWidgets: [
      '@akashaproject/ui-widget-topbar',
      '@akashaproject/ui-widget-trending',
      '@akashaproject/ui-widget-analytics',
      '@akashaproject/ui-widget-sidebar',
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
