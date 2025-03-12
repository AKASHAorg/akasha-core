import { WorldConfig } from '@akashaorg/typings/lib/ui';

/**
 * Default config for akasha.world
 **/
export const akashaWorldConfig: WorldConfig = {
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
  // define the extensions app for this world
  extensionsApp: '@akashaorg/app-extensions',
  // define pre-installed apps,
  // homepageApp is always loaded by default
  defaultApps: [
    '@akashaorg/app-vibes',
    '@akashaorg/app-auth-ewa',
    '@akashaorg/app-search',
    '@akashaorg/app-profile',
    '@akashaorg/app-notifications',
    '@akashaorg/app-settings-ewa',
    '@akashaorg/app-legal',
    '@akashaorg/app-world-builder',
    // '@akashaorg/app-vibes-console',
  ],
  // pre-installed widgets;
  // layout widget is always loaded by default
  defaultWidgets: [
    '@akashaorg/ui-widget-topbar',
    '@akashaorg/ui-widget-trending',
    '@akashaorg/ui-widget-analytics',
    '@akashaorg/ui-widget-sidebar',
    '@akashaorg/ui-widget-mini-profile',
    '@akashaorg/ui-widget-test-mode-notifier',
  ],
  analytics: {
    trackerUrl: process.env.MATOMO_TRACKER_URL || '',
    siteId: process.env.MATOMO_SITE_ID || '',
  },
  socialLinks: [
    { icon: 'Github', link: 'https://github.com/AKASHAorg' },
    { icon: 'Discord', link: '' },
    { icon: 'Telegram', link: 'https://t.me/worldofethereum' },
    { icon: 'Twitter', link: 'https://twitter.com/AKASHAworld' },
  ],
};
