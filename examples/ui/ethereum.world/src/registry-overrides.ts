import { INTEGRATION_TYPES } from '@akashaproject/ui-awf-typings/lib/app-loader';

const HOST = '//localhost:8131';

// config for integrations config overrides
const overrides = [
  {
    name: '@akashaproject/ui-plugin-app-center',
    integrationType: INTEGRATION_TYPES.APPLICATION,
    sources: [`${HOST}/plugins/app-center/index.js`],
  },
  {
    name: '@akashaproject/ui-plugin-bookmarks',
    integrationType: INTEGRATION_TYPES.APPLICATION,
    sources: [`${HOST}/plugins/bookmarks/index.js`],
  },
  {
    name: '@akashaproject/app-akasha-integration',
    integrationType: INTEGRATION_TYPES.APPLICATION,
    sources: [`${HOST}/apps/akasha/index.js`],
  },
  {
    name: '@akashaproject/app-moderation-ewa',
    integrationType: INTEGRATION_TYPES.APPLICATION,
    sources: [`${HOST}/apps/moderation/index.js`],
  },
  {
    name: '@akashaproject/app-auth-ewa',
    integrationType: INTEGRATION_TYPES.APPLICATION,
    sources: [`${HOST}/apps/auth-app/index.js`],
  },
  {
    name: '@akashaproject/ui-plugin-profile',
    integrationType: INTEGRATION_TYPES.APPLICATION,
    sources: [`${HOST}/plugins/profile/index.js`],
  },
  {
    name: '@akashaproject/ui-plugin-notifications',
    integrationType: INTEGRATION_TYPES.APPLICATION,
    sources: [`${HOST}/plugins/notifications/index.js`],
  },
  {
    name: '@akashaproject/ui-plugin-legal',
    integrationType: INTEGRATION_TYPES.APPLICATION,
    sources: [`${HOST}/plugins/legal/index.js`],
  },
  {
    name: '@akashaproject/app-search',
    integrationType: INTEGRATION_TYPES.APPLICATION,
    sources: [`${HOST}/plugins/search/index.js`],
  },
  {
    name: '@akashaproject/app-settings-ewa',
    integrationType: INTEGRATION_TYPES.APPLICATION,
    sources: [`${HOST}/apps/settings-app/index.js`],
  },
  {
    name: '@akashaproject/ui-widget-sidebar',
    integrationType: INTEGRATION_TYPES.WIDGET,
    sources: [`${HOST}/widgets/sidebar/index.js`],
  },
  {
    name: '@akashaproject/ui-widget-topbar',
    integrationType: INTEGRATION_TYPES.WIDGET,
    sources: [`${HOST}/widgets/topbar/index.js`],
  },
  {
    name: '@akashaproject/ui-widget-trending',
    integrationType: INTEGRATION_TYPES.WIDGET,
    sources: [`${HOST}/widgets/trending/index.js`],
  },
  {
    name: '@akashaproject/ui-widget-layout',
    integrationType: INTEGRATION_TYPES.WIDGET,
    sources: [`${HOST}/widgets/layout/index.js`],
  },
];

export default overrides;
