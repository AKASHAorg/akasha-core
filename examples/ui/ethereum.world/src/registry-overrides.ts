import { INTEGRATION_TYPES } from '@akashaorg/ui-awf-typings/lib/app-loader';

const HOST = '//localhost:8131';

// config for integrations config overrides
const overrides = [
  {
    name: '@akashaorg/app-integration-center',
    integrationType: INTEGRATION_TYPES.APPLICATION,
    sources: [`${HOST}/apps/app-center/index.js`],
  },
  {
    name: '@akashaorg/app-bookmarks',
    integrationType: INTEGRATION_TYPES.APPLICATION,
    sources: [`${HOST}/apps/bookmarks/index.js`],
  },
  {
    name: '@akashaorg/app-akasha-integration',
    integrationType: INTEGRATION_TYPES.APPLICATION,
    sources: [`${HOST}/apps/akasha/index.js`],
  },
  {
    name: '@akashaorg/app-moderation-ewa',
    integrationType: INTEGRATION_TYPES.APPLICATION,
    sources: [`${HOST}/apps/moderation/index.js`],
  },
  {
    name: '@akashaorg/app-auth-ewa',
    integrationType: INTEGRATION_TYPES.APPLICATION,
    sources: [`${HOST}/apps/auth-app/index.js`],
  },
  {
    name: '@akashaorg/app-profile',
    integrationType: INTEGRATION_TYPES.APPLICATION,
    sources: [`${HOST}/apps/profile/index.js`],
  },
  {
    name: '@akashaorg/app-notifications',
    integrationType: INTEGRATION_TYPES.APPLICATION,
    sources: [`${HOST}/apps/notifications/index.js`],
  },
  {
    name: '@akashaorg/app-legal',
    integrationType: INTEGRATION_TYPES.APPLICATION,
    sources: [`${HOST}/apps/legal/index.js`],
  },
  {
    name: '@akashaorg/app-search',
    integrationType: INTEGRATION_TYPES.APPLICATION,
    sources: [`${HOST}/apps/search/index.js`],
  },
  {
    name: '@akashaorg/app-settings-ewa',
    integrationType: INTEGRATION_TYPES.APPLICATION,
    sources: [`${HOST}/apps/settings-app/index.js`],
  },
  {
    name: '@akashaorg/app-translation',
    integrationType: INTEGRATION_TYPES.APPLICATION,
    sources: [`${HOST}/apps/translation/index.js`],
  },
  {
    name: '@akashaorg/app-routing',
    integrationType: INTEGRATION_TYPES.APPLICATION,
    sources: [`${HOST}/apps/routing/index.js`],
  },
  {
    name: '@akashaorg/app-messaging',
    integrationType: INTEGRATION_TYPES.APPLICATION,
    sources: [`${HOST}/apps/messaging/index.js`],
  },
  {
    name: '@akashaorg/ui-widget-sidebar',
    integrationType: INTEGRATION_TYPES.WIDGET,
    sources: [`${HOST}/widgets/sidebar/index.js`],
  },
  {
    name: '@akashaorg/ui-widget-topbar',
    integrationType: INTEGRATION_TYPES.WIDGET,
    sources: [`${HOST}/widgets/topbar/index.js`],
  },
  {
    name: '@akashaorg/ui-widget-trending',
    integrationType: INTEGRATION_TYPES.WIDGET,
    sources: [`${HOST}/widgets/trending/index.js`],
  },
  {
    name: '@akashaorg/ui-widget-layout',
    integrationType: INTEGRATION_TYPES.WIDGET,
    sources: [`${HOST}/widgets/layout/index.js`],
  },
  {
    name: '@akashaorg/ui-widget-analytics',
    integrationType: INTEGRATION_TYPES.WIDGET,
    sources: [`${HOST}/widgets/analytics/index.js`],
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

export default overrides;
