import 'systemjs-webpack-interop/auto-public-path';
import {
  IAppConfig,
  MenuItemAreaType,
  IntegrationRegistrationOptions,
  LogoTypeSource,
  IRootComponentProps,
  MenuItemType,
  IPlugin,
} from '@akashaorg/typings/lib/ui';
import routes, { EXTENSIONS, HOME, INSTALLED, MY_EXTENSIONS } from './routes';
import { DEV_MODE_KEY } from './constants';
import { ContentBlockStore } from './plugins/content-block-store';
import { ExtensionPointStore } from './plugins/extension-point-store';
import { WidgetStore } from './plugins/widget-store';
import { InstalledAppStore } from './plugins/installed-app-store';
import React from 'react';
import { Akasha } from '@akashaorg/design-system-core/lib/components/Icon/akasha-icons';
import { DevMode } from './components/pages';

const generateSubRoutes = () => {
  const localValue = window.localStorage.getItem(DEV_MODE_KEY);
  const baseSubRoutes = [
    {
      label: HOME,
      index: 0,
      route: routes[HOME],
      type: MenuItemType.Internal,
    },
    {
      label: EXTENSIONS,
      index: 1,
      route: routes[EXTENSIONS],
      type: MenuItemType.Internal,
    },
    {
      label: INSTALLED,
      index: 2,
      route: routes[INSTALLED],
      type: MenuItemType.Internal,
    },
  ];

  return localValue === DevMode.ENABLED
    ? [
        ...baseSubRoutes,
        {
          label: MY_EXTENSIONS,
          index: 3,
          route: routes[MY_EXTENSIONS],
          type: MenuItemType.Internal,
        },
      ]
    : baseSubRoutes;
};

/**
 * All the plugins must export an object like this:
 */
export const register = (opts: IntegrationRegistrationOptions): IAppConfig => ({
  loadingFn: () => import('./components'),
  mountsIn: opts.layoutSlots?.applicationSlotId,
  i18nNamespace: ['app-extensions'],
  routes: {
    ...routes,
  },
  menuItems: {
    label: 'Extensions',
    type: MenuItemType.App,
    logo: { type: LogoTypeSource.ICON, solidIcon: true, value: <Akasha /> },
    area: [MenuItemAreaType.AppArea],
    subRoutes: generateSubRoutes(),
  },
  extensionPoints: [
    {
      mountsIn: 'install-app',
      loadingFn: () => import('./extensions/install-app'),
    },
    {
      mountsIn: 'remove-extension-confirmation',
      loadingFn: () => import('./extensions/remove-extension-confirmation'),
    },
  ],
});

export const registerPlugin = async (
  props: IRootComponentProps & {
    encodeAppName: (name: string) => string;
    decodeAppName: (name: string) => string;
  },
): Promise<IPlugin> => {
  const contentBlockStore = ContentBlockStore.getInstance(props.uiEvents);
  const extensionPointStore = ExtensionPointStore.getInstance(props.uiEvents);
  const widgetStore = WidgetStore.getInstance(props.uiEvents);
  const installedAppStore = InstalledAppStore.getInstance(props.uiEvents);

  return {
    contentBlockStore: {
      getInfos: contentBlockStore.getContentBlockInfos,
      getMatchingBlocks: contentBlockStore.getMatchingBlocks,
    },
    extensionPointStore: {
      getExtensionPoints: extensionPointStore.getExtensions,
      getMatchingExtensionPoints: extensionPointStore.getMatchingExtensions,
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
