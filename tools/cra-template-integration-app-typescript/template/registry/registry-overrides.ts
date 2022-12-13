import { INTEGRATION_TYPES } from '@akashaorg/typings/ui';

const HOST = 'https://next.akasha-world-framework.pages.dev';
const LOCAL_HOST = '//localhost:8131';

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
    name: '@akashaorg/app-settings-ewa',
    integrationType: INTEGRATION_TYPES.APPLICATION,
    sources: [`${HOST}/apps/settings-app/index.js`],
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
    name: '@akashaorg/app-example',
    integrationType: INTEGRATION_TYPES.APPLICATION,
    sources: [`${LOCAL_HOST}/app-example/index.js`],
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
    name: '@akashaorg/ui-widget-layout',
    integrationType: INTEGRATION_TYPES.WIDGET,
    sources: [`${HOST}/widgets/layout/index.js`],
    ...missingRequiredFields,
  },
  {
    name: '@akashaorg/ui-widget-mini-profile',
    integrationType: INTEGRATION_TYPES.WIDGET,
    sources: [`${HOST}/widgets/mini-profile/index.js`],
    ...missingRequiredFields,
  },
];

export default overrides;
