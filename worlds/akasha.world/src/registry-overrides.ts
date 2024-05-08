import { INTEGRATION_TYPES } from '@akashaorg/typings/lib/ui';

export const missingRequiredFields = {
  version: '0.0.1',
  integrationID: '1',
  author: '@akashaorg',
  enabled: true,
  manifestData: {
    mainFile: 'index.js',
  },
};

// config for integrations config overrides
const overrides = [
  {
    name: '@akashaorg/app-extensions',
    integrationType: INTEGRATION_TYPES.APPLICATION,
    sources: [`/apps/extensions/index.js`],
    ...missingRequiredFields,
  },
  {
    name: '@akashaorg/app-antenna',
    integrationType: INTEGRATION_TYPES.APPLICATION,
    sources: [`/apps/antenna/index.js`],
    ...missingRequiredFields,
  },
  {
    name: '@akashaorg/app-vibes',
    integrationType: INTEGRATION_TYPES.APPLICATION,
    sources: [`/apps/vibes/index.js`],
    ...missingRequiredFields,
  },
  {
    name: '@akashaorg/app-vibes-console',
    integrationType: INTEGRATION_TYPES.APPLICATION,
    sources: [`/apps/vibes-console/index.js`],
    ...missingRequiredFields,
  },
  {
    name: '@akashaorg/app-auth-ewa',
    integrationType: INTEGRATION_TYPES.APPLICATION,
    sources: [`/apps/auth-app/index.js`],
    ...missingRequiredFields,
  },
  {
    name: '@akashaorg/app-profile',
    integrationType: INTEGRATION_TYPES.APPLICATION,
    sources: [`/apps/profile/index.js`],
    ...missingRequiredFields,
  },
  {
    name: '@akashaorg/app-notifications',
    integrationType: INTEGRATION_TYPES.APPLICATION,
    sources: [`/apps/notifications/index.js`],
    ...missingRequiredFields,
  },
  {
    name: '@akashaorg/app-legal',
    integrationType: INTEGRATION_TYPES.APPLICATION,
    sources: [`/apps/legal/index.js`],
    ...missingRequiredFields,
  },
  {
    name: '@akashaorg/app-search',
    integrationType: INTEGRATION_TYPES.APPLICATION,
    sources: [`/apps/search/index.js`],
    ...missingRequiredFields,
  },
  {
    name: '@akashaorg/app-settings-ewa',
    integrationType: INTEGRATION_TYPES.APPLICATION,
    sources: [`/apps/settings/index.js`],
    ...missingRequiredFields,
  },
  {
    name: '@akashaorg/app-routing',
    integrationType: INTEGRATION_TYPES.APPLICATION,
    sources: [`/apps/routing/index.js`],
    ...missingRequiredFields,
  },
  {
    name: '@akashaorg/ui-widget-sidebar',
    integrationType: INTEGRATION_TYPES.WIDGET,
    sources: [`/widgets/sidebar/index.js`],
    ...missingRequiredFields,
  },
  {
    name: '@akashaorg/ui-widget-topbar',
    integrationType: INTEGRATION_TYPES.WIDGET,
    sources: [`/widgets/top-bar/index.js`],
    ...missingRequiredFields,
  },
  {
    name: '@akashaorg/ui-widget-trending',
    integrationType: INTEGRATION_TYPES.WIDGET,
    sources: [`/widgets/trending/index.js`],
    ...missingRequiredFields,
  },
  {
    name: '@akashaorg/ui-widget-layout',
    integrationType: INTEGRATION_TYPES.WIDGET,
    sources: [`/widgets/layout/index.js`],
    ...missingRequiredFields,
  },
  {
    name: '@akashaorg/ui-widget-analytics',
    integrationType: INTEGRATION_TYPES.WIDGET,
    sources: [`/widgets/analytics/index.js`],
    ...missingRequiredFields,
  },
  {
    name: '@akashaorg/ui-widget-mini-profile',
    integrationType: INTEGRATION_TYPES.WIDGET,
    sources: ['/widgets/mini-profile/index.js'],
    ...missingRequiredFields,
  },
  {
    name: '@akashaorg/ui-widget-my-apps',
    integrationType: INTEGRATION_TYPES.WIDGET,
    sources: ['/widgets/my-apps/index.js'],
    ...missingRequiredFields,
  },
];

export default overrides;
