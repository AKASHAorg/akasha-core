import { INTEGRATION_TYPES } from '@akashaorg/typings/ui';

const HOST = '//localhost:8131';

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
    sources: [`${HOST}/apps/app-center/index.js`],
    ...missingRequiredFields,
  },
  {
    name: '@akashaorg/app-bookmarks',
    integrationType: INTEGRATION_TYPES.APPLICATION,
    sources: [`${HOST}/apps/bookmarks/index.js`],
    ...missingRequiredFields,
  },
  {
    name: '@akashaorg/app-akasha-integration',
    integrationType: INTEGRATION_TYPES.APPLICATION,
    sources: [`${HOST}/apps/akasha/index.js`],
    ...missingRequiredFields,
  },
  {
    name: '@akashaorg/app-moderation-ewa',
    integrationType: INTEGRATION_TYPES.APPLICATION,
    sources: [`${HOST}/apps/moderation/index.js`],
    ...missingRequiredFields,
  },
  {
    name: '@akashaorg/app-auth-ewa',
    integrationType: INTEGRATION_TYPES.APPLICATION,
    sources: [`${HOST}/apps/auth-app/index.js`],
    ...missingRequiredFields,
  },
  {
    name: '@akashaorg/app-profile',
    integrationType: INTEGRATION_TYPES.APPLICATION,
    sources: [`${HOST}/apps/profile/index.js`],
    ...missingRequiredFields,
  },
  {
    name: '@akashaorg/app-notifications',
    integrationType: INTEGRATION_TYPES.APPLICATION,
    sources: [`${HOST}/apps/notifications/index.js`],
    ...missingRequiredFields,
  },
  {
    name: '@akashaorg/app-legal',
    integrationType: INTEGRATION_TYPES.APPLICATION,
    sources: [`${HOST}/apps/legal/index.js`],
    ...missingRequiredFields,
  },
  {
    name: '@akashaorg/app-search',
    integrationType: INTEGRATION_TYPES.APPLICATION,
    sources: [`${HOST}/apps/search/index.js`],
    ...missingRequiredFields,
  },
  {
    name: '@akashaorg/app-settings-ewa',
    integrationType: INTEGRATION_TYPES.APPLICATION,
    sources: [`${HOST}/apps/settings-app/index.js`],
    ...missingRequiredFields,
  },
  {
    name: '@akashaorg/app-articles',
    integrationType: INTEGRATION_TYPES.APPLICATION,
    sources: [`${HOST}/apps/articles/index.js`],
    ...missingRequiredFields,
  },
  {
    name: '@akashaorg/app-dev-dashboard',
    integrationType: INTEGRATION_TYPES.APPLICATION,
    sources: [`${HOST}/apps/dev-dashboard/index.js`],
    ...missingRequiredFields,
  },
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
    name: '@akashaorg/app-messaging',
    integrationType: INTEGRATION_TYPES.APPLICATION,
    sources: [`${HOST}/apps/messaging/index.js`],
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
    name: '@akashaorg/ui-widget-trending',
    integrationType: INTEGRATION_TYPES.WIDGET,
    sources: [`${HOST}/widgets/trending/index.js`],
    ...missingRequiredFields,
  },
  {
    name: '@akashaorg/ui-widget-layout',
    integrationType: INTEGRATION_TYPES.WIDGET,
    sources: [`${HOST}/widgets/layout/index.js`],
    ...missingRequiredFields,
  },
  {
    name: '@akashaorg/ui-widget-analytics',
    integrationType: INTEGRATION_TYPES.WIDGET,
    sources: [`${HOST}/widgets/analytics/index.js`],
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
