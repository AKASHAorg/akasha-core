// "@akashaproject/app-loader": "/app-loader/index.js",
// "@akashaproject/sdk": "/akasha.sdk.js",
// "@akashaproject/design-system": "/design/index.js",
// "@akashaproject/ui-widget-sidebar": "/widgets/sidebar/index.js",
// "@akashaproject/ui-widget-layout": "/widgets/layout/index.js",
// "@widget/topbar": "/widgets/topbar/index.js",
// "@widget/login": "/widgets/login/index.js",
// "@plugins/profile": "/plugins/profile/index.js",
// "@plugins/notifications": "/plugins/notifications//index.js",
// "@plugins/app-center": "/plugins/app-center/index.js",
// "@plugins/search": "/plugins/search/index.js",
// "@akashaproject/app-akasha-integration": "/apps/akasha/index.js",
// "@akashaproject/app-moderation-ewa": "/apps/moderation/index.js"
// "@akashaproject/app-auth-ewa": "/apps/auth-app/index.js"

export const integrationsData = {
  '@akashaproject/ui-widget-layout': {
    name: '@akashaproject/ui-widget-layout',
    lastVersion: '0.0.1',
    description: 'EWA base layout. Powered by AKASHA.',
    versions: {
      '0.0.1': '/widgets/layout/index.js',
    },
    type: 'widget',
  },
  '@akashaproject/app-integration-center': {
    name: '@akashaproject/app-integration-center',
    lastVersion: '0.1.0',
    description: 'Integration Center App',
    type: 'app',
    versions: {
      '0.1.0': '/ui/apps/app-center/index.js',
    },
  },
  '@akashaproject/app-bookmarks': {
    name: '@akashaproject/app-bookmarks',
    lastVersion: '0.1.0',
    description: 'Bookmarks App',
    type: 'app',
    versions: {
      '0.1.0': '/ui/apps/bookmarks/index.js',
    },
  },
  '@akashaproject/app-akasha-integration': {
    name: '@akashaproject/app-akasha-integration',
    lastVersion: '0.0.1',
    description: 'AKASHA Integration',
    type: 'app',
    versions: {
      '0.0.1': '/ui/apps/akasha/index.js',
    },
  },
  '@akashaproject/app-moderation-ewa': {
    name: '@akashaproject/app-moderation-ewa',
    lastVersion: '0.0.1',
    description: 'Moderation app',
    versions: {
      // we can have something like //gateway.ipfs.io/ipfs/Qem123dfea1234
      '0.0.1': '/ui/apps/moderation/index.js',
    },
    type: 'app',
  },
  '@akashaproject/app-auth-ewa': {
    name: '@akashaproject/app-auth-ewa',
    lastVersion: '0.0.1',
    description: 'Auth app',
    versions: {
      '0.0.1': '/ui/apps/auth-app/index.js',
    },
    type: 'app',
  },
  '@akashaproject/app-settings-ewa': {
    name: '@akashaproject/app-settings-ewa',
    lastVersion: '0.0.1',
    description: 'Settings App',
    versions: {
      // we can have something like //gateway.ipfs.io/ipfs/Qem123dfea1234
      '0.0.1': '/ui/apps/settings-app/index.js',
    },
    type: 'app',
  },
  '@akashaproject/app-search': {
    name: '@akashaproject/app-search',
    lastVersion: '0.0.1',
    description: 'Search App',
    versions: {
      // we can have something like //gateway.ipfs.io/ipfs/Qem123dfea1234
      '0.0.1': '/ui/apps/search/index.js',
    },
    type: 'app',
  },
  '@akashaproject/ui-widget-sidebar': {
    name: '@akashaproject/ui-widget-sidebar',
    lastVersion: '0.0.2',
    description: 'Sidebar Widget',
    versions: {
      '0.0.2': '/widgets/sidebar/index.js',
      '0.0.1': '/widgets/sidebar/index.js',
    },
    type: 'widget',
  },
  '@akashaproject/ui-widget-topbar': {
    name: '@akashaproject/ui-widget-topbar',
    lastVersion: '0.0.2',
    description: 'Topbar Widget',
    versions: {
      '0.0.2': '/widgets/topbar/index.js',
      '0.0.1': '/widgets/topbar/index.js',
    },
    type: 'widget',
  },
  '@akashaproject/ui-widget-trending': {
    name: '@akashaproject/ui-widget-trending',
    lastVersion: '0.0.2',
    description: 'Trending Widget',
    versions: {
      '0.0.2': '/widgets/trending/index.js',
      '0.0.1': '/widgets/trending/index.js',
    },
    type: 'widget',
  },
  '@akashaproject/app-profile': {
    name: '@akashaproject/app-profile',
    lastVersion: '0.0.1',
    description: 'Profile App. Powered by AKASHA',
    versions: {
      '0.0.1': '/ui/apps/profile/index.js',
    },
    type: 'app',
  },
  '@akashaproject/app-notifications': {
    name: '@akashaproject/app-notifications',
    lastVersion: '0.0.1',
    description: 'Notifications App. Powered by AKASHA',
    versions: {
      '0.0.1': '/ui/apps/notifications/index.js',
    },
    type: 'app',
  },
  '@akashaproject/app-legal': {
    name: '@akashaproject/app-legal',
    lastVersion: '0.0.1',
    description: 'Legal App. Powered by AKASHA',
    versions: {
      '0.0.1': '/ui/apps/legal/index.js',
    },
    type: 'app',
  },
};
