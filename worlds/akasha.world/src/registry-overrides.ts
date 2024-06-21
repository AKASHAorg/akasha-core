import { AkashaAppApplicationType } from '@akashaorg/typings/lib/sdk/graphql-types-new';

export const missingRequiredFields = {
  version: '0.0.1',
  integrationID: '1',
  author: '@akashaorg',
  enabled: true,
  manifestData: {
    mainFile: 'index.js',
  },
};
const origin = window.location.origin;
// config for integrations config overrides
const overrides = [
  {
    name: '@akashaorg/app-extensions',
    integrationType: AkashaAppApplicationType.App,
    sources: [`${origin}/apps/extensions`],
    ...missingRequiredFields,
  },
  {
    name: '@akashaorg/app-antenna',
    integrationType: AkashaAppApplicationType.App,
    sources: [`${origin}/apps/antenna`],
    ...missingRequiredFields,
  },
  {
    name: '@akashaorg/app-vibes',
    integrationType: AkashaAppApplicationType.App,
    sources: [`${origin}/apps/vibes`],
    ...missingRequiredFields,
  },
  {
    name: '@akashaorg/app-vibes-console',
    integrationType: AkashaAppApplicationType.App,
    sources: [`${origin}/apps/vibes-console`],
    ...missingRequiredFields,
  },
  {
    name: '@akashaorg/app-auth-ewa',
    integrationType: AkashaAppApplicationType.App,
    sources: [`${origin}/apps/auth-app`],
    ...missingRequiredFields,
  },
  // {
  //   name: '@akashaorg/app-profile',
  //   integrationType: AkashaAppApplicationType.App,
  //   sources: [`${origin}/apps/profile`],
  //   ...missingRequiredFields,
  // },
  // {
  //   name: '@akashaorg/app-notifications',
  //   integrationType: AkashaAppApplicationType.App,
  //   sources: [`${origin}/apps/notifications`],
  //   ...missingRequiredFields,
  // },
  {
    name: '@akashaorg/app-legal',
    integrationType: AkashaAppApplicationType.App,
    sources: [`${origin}/apps/legal`],
    ...missingRequiredFields,
  },
  {
    name: '@akashaorg/app-search',
    integrationType: AkashaAppApplicationType.App,
    sources: [`${origin}/apps/search`],
    ...missingRequiredFields,
  },
  {
    name: '@akashaorg/app-settings-ewa',
    integrationType: AkashaAppApplicationType.App,
    sources: [`${origin}/apps/settings`],
    ...missingRequiredFields,
  },
  {
    name: '@akashaorg/app-routing',
    integrationType: AkashaAppApplicationType.App,
    sources: [`${origin}/apps/routing`],
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
    name: '@akashaorg/ui-widget-trending',
    integrationType: AkashaAppApplicationType.Widget,
    sources: [`${origin}/widgets/trending`],
    ...missingRequiredFields,
  },
  {
    name: '@akashaorg/ui-widget-layout',
    integrationType: AkashaAppApplicationType.Widget,
    sources: [`${origin}/widgets/layout`],
    ...missingRequiredFields,
  },
  {
    name: '@akashaorg/ui-widget-analytics',
    integrationType: AkashaAppApplicationType.Widget,
    sources: [`${origin}/widgets/analytics`],
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

export default overrides;
