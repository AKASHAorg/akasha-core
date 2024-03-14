import 'systemjs-webpack-interop/auto-public-path';
import {
  IAppConfig,
  IntegrationRegistrationOptions,
  MenuItemAreaType,
  MenuItemType,
  LogoTypeSource,
} from '@akashaorg/typings/lib/ui';
import React from 'react';
import { SparklesIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';

/**
 * All apps must export an object like this:
 */
export const register: (opts: IntegrationRegistrationOptions) => IAppConfig = opts => ({
  loadingFn: () => import('./components'),
  mountsIn: opts.layoutConfig?.applicationSlotId,
  i18nNamespace: ['app-lists'],
  extensions: [
    {
      mountsIn: 'entry-card-actions-right_*',
      loadingFn: () => import('./extensions/entry-card-save-button'),
    },
  ],
  title: 'List | AKASHA World',
  menuItems: {
    label: 'List',
    type: MenuItemType.App,
    logo: { type: LogoTypeSource.ICON, value: <SparklesIcon /> },
    area: [MenuItemAreaType.AppArea],
    subRoutes: [],
  },
});
