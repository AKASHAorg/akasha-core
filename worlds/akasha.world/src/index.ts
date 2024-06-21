import '@akashaorg/design-system-core/src/twind/main.css';
import '@akashaorg/design-system-core/src/twind/globals.css';

import { WorldConfig } from '@akashaorg/typings/lib/ui';
import { missingRequiredFields } from './registry-overrides';
import { AkashaAppApplicationType } from '@akashaorg/typings/lib/sdk/graphql-types-new';

console.time('AppLoader:firstMount');

declare const __DEV__: boolean;
declare const __LOAD_LOCAL_SOURCES__: boolean;

(async function bootstrap(System) {
  const { default: AppLoader } = await System.import('@akashaorg/ui-app-loader');
  const { default: getSDK } = await System.import('@akashaorg/awf-sdk');

  const origin = window.location.origin;
  let registryOverrides = [
    {
      name: '@akashaorg/app-routing',
      integrationType: AkashaAppApplicationType.App,
      sources: [`${origin}/apps/routing`],
      ...missingRequiredFields,
    },
    {
      name: '@akashaorg/ui-widget-layout',
      integrationType: AkashaAppApplicationType.Widget,
      sources: [`${origin}/widgets/layout`],
      ...missingRequiredFields,
    },
    {
      name: '@akashaorg/ui-widget-sidebar',
      integrationType: AkashaAppApplicationType.Widget,
      sources: [`${origin}/widgets/sidebar`],
      ...missingRequiredFields,
    },
    {
      name: '@akashaorg/ui-widget-topbar',
      integrationType: AkashaAppApplicationType.Widget,
      sources: [`${origin}/widgets/top-bar`],
      ...missingRequiredFields,
    },
    {
      name: '@akashaorg/ui-widget-mini-profile',
      integrationType: AkashaAppApplicationType.Widget,
      sources: [`${origin}/widgets/mini-profile`],
      ...missingRequiredFields,
    },
    {
      name: '@akashaorg/ui-widget-my-apps',
      integrationType: AkashaAppApplicationType.Widget,
      sources: [`${origin}/widgets/my-apps`],
      ...missingRequiredFields,
    },
  ];

  if (__DEV__ || __LOAD_LOCAL_SOURCES__) {
    registryOverrides = (await import('./registry-overrides')).default;
  }

  const loaderConfig: WorldConfig = {
    title: 'AKASHA World',
    worldIcon: {
      basePath: '/icons/world/',
      darkModeSuffix: '_dark',
      extension: '.png',
      small: 'small',
      medium: 'medium',
      large: 'large',
    },
    // main layout (shell)
    layout: '@akashaorg/ui-widget-layout',
    // define an app that will load at root '/' path
    homepageApp: '@akashaorg/app-antenna',
    // define pre-installed apps,
    // homepageApp is always loaded by default
    defaultApps: [
      '@akashaorg/app-routing',
      '@akashaorg/app-vibes',
      '@akashaorg/app-auth-ewa',
      '@akashaorg/app-extensions',
      '@akashaorg/app-search',
      '@akashaorg/app-profile',
      '@akashaorg/app-notifications',
      '@akashaorg/app-legal',
      '@akashaorg/app-settings-ewa',
      '@akashaorg/app-vibes-console',
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
    socialLinks: [
      { icon: 'Github', link: 'https://github.com/AKASHAorg' },
      { icon: 'Discord', link: '' },
      { icon: 'Telegram', link: 'https://t.me/worldofethereum' },
      { icon: 'Twitter', link: 'https://twitter.com/AKASHAworld' },
    ],
  };

  const sdk = getSDK();
  const appLoader = new AppLoader(loaderConfig);
  appLoader.start();
  // startLoader(loaderConfig);

  // tslint:disable-next-line:no-console
  console.log('initial sdk instance', sdk);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
})(globalThis.System);
