import { AkashaAppApplicationType } from '@akashaorg/typings/lib/sdk/graphql-types-new';

const origin = window.location.origin;
// config for integrations config overrides
const overrides = [
  {
    name: '@akashaorg/app-extensions',
    integrationType: AkashaAppApplicationType.App,
    sources: [`${origin}/apps/extensions`],
  },
  {
    name: '@akashaorg/app-antenna',
    integrationType: AkashaAppApplicationType.App,
    sources: [`${origin}/apps/antenna`],
  },
  {
    name: '@akashaorg/app-vibes',
    integrationType: AkashaAppApplicationType.App,
    sources: [`${origin}/apps/vibes`],
  },
  {
    name: '@akashaorg/app-vibes-console',
    integrationType: AkashaAppApplicationType.App,
    sources: [`${origin}/apps/vibes-console`],
  },
  {
    name: '@akashaorg/app-auth-ewa',
    integrationType: AkashaAppApplicationType.App,
    sources: [`${origin}/apps/auth-app`],
  },
  {
    name: '@akashaorg/app-profile',
    integrationType: AkashaAppApplicationType.App,
    sources: [`${origin}/apps/profile`],
  },
  // {
  //   name: '@akashaorg/app-notifications',
  //   integrationType: AkashaAppApplicationType.App,
  //   sources: [`${origin}/apps/notifications`],
  //
  // },
  // {
  //   name: '@akashaorg/app-legal',
  //   integrationType: AkashaAppApplicationType.App,
  //   sources: [`${origin}/apps/legal`],
  //
  // },
  {
    name: '@akashaorg/app-search',
    integrationType: AkashaAppApplicationType.App,
    sources: [`${origin}/apps/search`],
  },
  {
    name: '@akashaorg/app-settings-ewa',
    integrationType: AkashaAppApplicationType.App,
    sources: [`${origin}/apps/settings`],
  },
  {
    name: '@akashaorg/app-routing',
    integrationType: AkashaAppApplicationType.App,
    sources: [`${origin}/apps/routing`],
  },
  {
    name: '@akashaorg/ui-widget-sidebar',
    integrationType: AkashaAppApplicationType.Widget,
    sources: [`${origin}/widgets/sidebar`],
  },
  {
    name: '@akashaorg/ui-widget-topbar',
    integrationType: AkashaAppApplicationType.Widget,
    sources: [`${origin}/widgets/top-bar`],
  },
  {
    name: '@akashaorg/ui-widget-trending',
    integrationType: AkashaAppApplicationType.Widget,
    sources: [`${origin}/widgets/trending`],
  },
  {
    name: '@akashaorg/ui-widget-layout',
    integrationType: AkashaAppApplicationType.Widget,
    sources: [`${origin}/widgets/layout`],
  },
  {
    name: '@akashaorg/ui-widget-analytics',
    integrationType: AkashaAppApplicationType.Widget,
    sources: [`${origin}/widgets/analytics`],
  },
  {
    name: '@akashaorg/ui-widget-mini-profile',
    integrationType: AkashaAppApplicationType.Widget,
    sources: [`${origin}/widgets/mini-profile`],
  },
  {
    name: '@akashaorg/ui-widget-my-apps',
    integrationType: AkashaAppApplicationType.Widget,
    sources: [`${origin}/widgets/my-apps`],
  },
];

export default overrides;
