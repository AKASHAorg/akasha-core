import { ILoaderConfig, INTEGRATION_TYPES } from '@akashaorg/typings/ui';
import { missingRequiredFields } from './registry-overrides';

const HOST = 'https://akasha.ethereum.world';

console.time('AppLoader:firstMount');

declare const __DEV__: boolean;

(async function bootstrap(System) {
  const { default: startLoader } = await System.import('@akashaorg/ui-app-loader');
  const { default: getSDK } = await System.import('@akashaorg/awf-sdk');

  let registryOverrides = [
    {
      name: '@akashaorg/app-translation',
      integrationType: INTEGRATION_TYPES.APPLICATION,
      sources: [`${HOST}/apps/translation/index.js`],
      ...missingRequiredFields,
    },
    {
      name: '@akashaorg/app-routing',
      integrationType: INTEGRATION_TYPES.APPLICATION,
      sources: [`${HOST}/apps/routing/index.js`],
      ...missingRequiredFields,
    },
    {
      name: '@akashaorg/app-example',
      integrationType: INTEGRATION_TYPES.APPLICATION,
      sources: [`/app-example/index.js`],
      ...missingRequiredFields,
    },
    {
      name: '@akashaorg/ui-widget-example',
      integrationType: INTEGRATION_TYPES.WIDGET,
      sources: [`/widget-example/index.js`],
      ...missingRequiredFields,
    },
    {
      name: '@akashaorg/ui-widget-layout',
      integrationType: INTEGRATION_TYPES.WIDGET,
      sources: [`${HOST}/widgets/layout/index.js`],
      ...missingRequiredFields,
    },
    {
      name: '@akashaorg/ui-widget-sidebar',
      integrationType: INTEGRATION_TYPES.WIDGET,
      sources: [`${HOST}/widgets/sidebar/index.js`],
      ...missingRequiredFields,
    },
    {
      name: '@akashaorg/ui-widget-topbar',
      integrationType: INTEGRATION_TYPES.WIDGET,
      sources: [`${HOST}/widgets/topbar/index.js`],
      ...missingRequiredFields,
    },
    {
      name: '@akashaorg/ui-widget-mini-profile',
      integrationType: INTEGRATION_TYPES.WIDGET,
      sources: [`${HOST}/widgets/mini-profile/index.js`],
      ...missingRequiredFields,
    },
  ];

  if (__DEV__) {
    registryOverrides = (await import('./registry-overrides')).default;
  }

  const loaderConfig: ILoaderConfig = {
    title: 'Example App',
    // main layout (shell)
    layout: '@akashaorg/ui-widget-layout',
    // define an app that will load at root '/' path
    homepageApp: '@akashaorg/app-example',
    // define pre-installed apps,
    // homepageApp is always loaded by default
    defaultApps: [
      '@akashaorg/app-routing',
      '@akashaorg/app-auth-ewa',
      '@akashaorg/app-profile',
      '@akashaorg/app-translation',
      '@akashaorg/app-settings-ewa',
    ],
    // pre-installed widgets;
    // layout widget is always loaded by default
    defaultWidgets: [
      '@akashaorg/ui-widget-example',
      '@akashaorg/ui-widget-topbar',
      '@akashaorg/ui-widget-sidebar',
      '@akashaorg/ui-widget-mini-profile',
    ],
    registryOverrides,
  };

  const sdk = getSDK();
  startLoader(loaderConfig);

  // tslint:disable-next-line:no-console
  console.log('initial sdk instance', sdk);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
})(globalThis.System);
