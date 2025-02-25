import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const appsMapping = {
  '@akashaorg/app-antenna': path.resolve(__dirname, '../../dist', 'apps/antenna'),
  '@akashaorg/app-profile': path.resolve(__dirname, '../../dist', 'apps/profile'),
  '@akashaorg/app-auth-ewa': path.resolve(__dirname, '../../dist', 'apps/auth-app'),
  '@akashaorg/app-vibes': path.resolve(__dirname, '../../dist', 'apps/vibes'),
  '@akashaorg/app-vibes-console': path.resolve(__dirname, '../../dist', 'apps/vibes-console'),
  '@akashaorg/app-search': path.resolve(__dirname, '../../dist', 'apps/search'),
  '@akashaorg/app-extensions': path.resolve(__dirname, '../../dist', 'apps/extensions'),
  '@akashaorg/app-legal': path.resolve(__dirname, '../../dist', 'apps/legal'),
  '@akashaorg/app-notifications': path.resolve(__dirname, '../../dist', 'apps/notifications'),
  '@akashaorg/app-settings-ewa': path.resolve(__dirname, '../../dist', 'apps/settings'),
  '@akashaorg/app-world-builder': path.resolve(__dirname, '../../dist', 'apps/world-builder'),
};

const widgetsMapping = {
  '@akashaorg/ui-widget-layout': path.resolve(__dirname, '../../dist', 'widgets/layout'),
  '@akashaorg/ui-widget-sidebar': path.resolve(__dirname, '../../dist', 'widgets/sidebar'),
  '@akashaorg/ui-widget-topbar': path.resolve(__dirname, '../../dist', 'widgets/top-bar'),
  '@akashaorg/ui-widget-analytics': path.resolve(__dirname, '../../dist', 'widgets/analytics'),
  '@akashaorg/ui-widget-trending': path.resolve(__dirname, '../../dist', 'widgets/trending'),
  '@akashaorg/ui-widget-mini-profile': path.resolve(__dirname, '../../dist', 'widgets/mini-profile'),
  '@akashaorg/ui-widget-test-mode-notifier': path.resolve(__dirname, '../../dist', 'widgets/test-mode-notifier'),

}

export default {
  apps: appsMapping,
  widgets: widgetsMapping
};
