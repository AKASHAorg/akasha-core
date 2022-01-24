import { INTEGRATION_TYPES } from '@akashaproject/ui-awf-typings/lib/app-loader';

const HOST = '//localhost:8131';

// config for integrations config overrides
const overrides = [
  {
    name: '@akashaproject/app-integration-center',
    integrationType: INTEGRATION_TYPES.APPLICATION,
    sources: [`${HOST}/apps/app-center/index.js`],
  },
  {
    name: '@akashaproject/app-bookmarks',
    integrationType: INTEGRATION_TYPES.APPLICATION,
    sources: [`${HOST}/apps/bookmarks/index.js`],
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
    name: '@akashaproject/app-profile',
    integrationType: INTEGRATION_TYPES.APPLICATION,
    sources: [`${HOST}/apps/profile/index.js`],
  },
  {
    name: '@akashaproject/app-notifications',
    integrationType: INTEGRATION_TYPES.APPLICATION,
    sources: [`${HOST}/apps/notifications/index.js`],
  },
  {
    name: '@akashaproject/app-legal',
    integrationType: INTEGRATION_TYPES.APPLICATION,
    sources: [
      '${HOST}/apps/legal/index.js',
      `https://bafybeigpnpgbi4euh4bl2d7jbaksdf7kzpmpnft3edtdve66cuypepzwuu.ipfs.infura-ipfs.io/index.js`,
    ],
  },
  {
    name: '@akashaproject/app-search',
    integrationType: INTEGRATION_TYPES.APPLICATION,
    sources: [`${HOST}/apps/search/index.js`],
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
  {
    name: '@akashaproject/ui-widget-analytics',
    integrationType: INTEGRATION_TYPES.WIDGET,
    sources: [`${HOST}/widgets/analytics/index.js`],
  },
];

export default overrides;
