import { INTEGRATION_TYPES } from '@akashaorg/typings/ui';

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
    name: '@akashaorg/app-integration-center',
    integrationType: INTEGRATION_TYPES.APPLICATION,
    sources: [`/apps/app-center/index.js`],
    ...missingRequiredFields,
  },
  {
    name: '@akashaorg/app-lists',
    integrationType: INTEGRATION_TYPES.APPLICATION,
    sources: [`/apps/bookmarks/index.js`],
    ...missingRequiredFields,
  },
  {
    name: '@akashaorg/app-akasha-integration',
    integrationType: INTEGRATION_TYPES.APPLICATION,
    sources: [`/apps/akasha/index.js`],
    ...missingRequiredFields,
  },
  {
    name: '@akashaorg/app-moderation-ewa',
    integrationType: INTEGRATION_TYPES.APPLICATION,
    sources: [`/apps/moderation/index.js`],
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
    sources: [`/apps/settings-app/index.js`],
    ...missingRequiredFields,
  },
  {
    name: '@akashaorg/app-articles',
    integrationType: INTEGRATION_TYPES.APPLICATION,
    sources: [`/apps/articles/index.js`],
    ...missingRequiredFields,
  },
  {
    name: '@akashaorg/app-dev-dashboard',
    integrationType: INTEGRATION_TYPES.APPLICATION,
    sources: [`/apps/dev-dashboard/index.js`],
    ...missingRequiredFields,
  },
  {
    name: '@akashaorg/app-translation',
    integrationType: INTEGRATION_TYPES.APPLICATION,
    sources: [`/apps/translation/index.js`],
    ...missingRequiredFields,
  },
  {
    name: '@akashaorg/app-routing',
    integrationType: INTEGRATION_TYPES.APPLICATION,
    sources: [`/apps/routing/index.js`],
    ...missingRequiredFields,
  },
  {
    name: '@akashaorg/app-messaging',
    integrationType: INTEGRATION_TYPES.APPLICATION,
    sources: [`/apps/messaging/index.js`],
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
    sources: [`/widgets/topbar/index.js`],
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
