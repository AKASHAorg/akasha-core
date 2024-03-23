import 'systemjs-webpack-interop/auto-public-path';
import {
  IAppConfig,
  MenuItemAreaType,
  IntegrationRegistrationOptions,
  LogoTypeSource,
  RootComponentProps,
} from '@akashaorg/typings/lib/ui';
import routes from './routes';
import { ContentBlockStore } from './plugins/content-block-store';
import { ExtensionStore } from './plugins/extension-store';
import { WidgetStore } from './plugins/widget-store';
import { InstalledAppStore } from './plugins/installed-app-store';
import React from 'react';
import { Akasha } from '@akashaorg/design-system-core/lib/components/Icon/akasha-icons';

/**
 * All the plugins must export an object like this:
 */
export const register: (opts: IntegrationRegistrationOptions) => IAppConfig = opts => ({
  mountsIn: opts.layoutConfig?.applicationSlotId,
  routes: {
    ...routes,
  },
  i18nNamespace: ['app-extensions'],
  loadingFn: () => import('./components'),
  title: 'AKASHA Core Extensions',
  menuItems: {
    label: 'Extensions',
    area: [MenuItemAreaType.OtherArea],
    logo: { type: LogoTypeSource.ICON, solidIcon: true, value: <Akasha /> },
    subRoutes: [],
  },
  extends: (matcher, loader) => {
    matcher({
      'install-app': loader(() => import('./extensions/install-app')),
    });
  },
});

export const getPlugin = (
  props: RootComponentProps & {
    encodeAppName: (name: string) => string;
    decodeAppName: (name: string) => string;
  },
) => {
  const contentBlockStore = ContentBlockStore.getInstance(props.uiEvents);
  const extensionStore = ExtensionStore.getInstance(props.uiEvents);
  const widgetStore = WidgetStore.getInstance(props.uiEvents);
  const installedAppStore = InstalledAppStore.getInstance(props.uiEvents);

  return {
    contentBlockStore: {
      getInfos: contentBlockStore.getContentBlockInfos,
      getMatchingBlocks: contentBlockStore.getMatchingBlocks,
    },
    extensionStore: {
      getExtensions: extensionStore.getExtensions,
      getMatchingExtensions: extensionStore.getMatchingExtensions,
    },
    widgetStore: {
      getWidgets: widgetStore.getWidgets,
      getMatchingWidgets: widgetStore.getMatchingWidgets,
    },
    installedAppStore: {
      getInstalledApps: installedAppStore.getInstalledApps,
    },
  };
};
