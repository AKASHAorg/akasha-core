import 'systemjs-webpack-interop/auto-public-path';
import {
  IAppConfig,
  IntegrationRegistrationOptions,
  LogoTypeSource,
  MenuItemAreaType,
  MenuItemType,
  type RootComponentProps,
} from '@akashaorg/typings/lib/ui';
import React from 'react';
import { GlobeAltIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';

/**
 * Optional method that will be called for every app right after the layout config and plugins are loaded
 * but before the `register` function
 * Useful to interact with the plugins before registering the app (ex. fire notification events)
 * @returns void
 */
export const initialize = (options: IntegrationRegistrationOptions): void => {
  return;
};

/**
 * The register function is called right after the `initialize` function
 * This method is required for apps and widgets
 * @returns IAppConfig
 */
export const register: (opts: IntegrationRegistrationOptions) => IAppConfig = opts => {
  return {
    loadingFn: () => import('./components'),
    mountsIn: opts.layoutConfig?.applicationSlotId,
    i18nNamespace: ['app-example'],
    logo: { type: LogoTypeSource.ICON, value: <GlobeAltIcon /> },
    menuItems: {
      label: 'Example App',
      type: MenuItemType.App,
      logo: { type: LogoTypeSource.ICON, value: <GlobeAltIcon /> },
      area: [MenuItemAreaType.AppArea],
      subRoutes: [],
    },
    contentBlocks: [
      {
        propertyType: 'text-block',
        displayName: 'Text Block',
        icon: <GlobeAltIcon />,
        loadingFn: () => {
          return () => import('./content-blocks/text-with-title');
        },
      },
    ],
  };
};

/**
 * Applications and widgets can provide additional functionalities via plugins.
 * Plugins are namespaced with the widget's or app's name.
 * Warning: plugins cannot use other plugins
 */

export const getPlugin = (props: RootComponentProps) => {
  return {
    saveLocalData(key: string, data: string) {
      localStorage.setItem(key, data);
    },
    getLocalData(key: string) {
      return localStorage.getItem(key);
    },
  };
};
