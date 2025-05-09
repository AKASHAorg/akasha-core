import 'systemjs-webpack-interop/auto-public-path';
import routes, { COC, DG, HOME, PP, TOS, TOU } from './routes';
import {
  IAppConfig,
  MenuItemAreaType,
  MenuItemType,
  IntegrationRegistrationOptions,
  LogoTypeSource,
} from '@akashaorg/typings/lib/ui';
import React from 'react';
import { FileTextIcon } from 'lucide-react';

export const register = (opts: IntegrationRegistrationOptions): IAppConfig => ({
  mountsIn: opts.layoutSlots?.applicationSlotId,
  routes: {
    legal: routes[HOME],
    devGuidelines: routes[DG],
    codeOfConduct: routes[COC],
    privacyPolicy: routes[PP],
    termsOfService: routes[TOS],
    termsOfUse: routes[TOU],
  },
  rootComponent: () => import('./components'),
  i18nNamespace: ['app-legal'],
  menuItems: {
    label: 'Legal',
    type: MenuItemType.App,
    logo: { type: LogoTypeSource.ICON, value: <FileTextIcon className="h-5 w-5 [&>*]:stroke-secondaryLight dark:[&>*]:stroke-secondaryDark" /> },
    area: [MenuItemAreaType.OtherArea],
    subRoutes: Object.keys(routes).map((routeLabel, idx) => ({
      label: routeLabel,
      index: idx,
      route: routes[routeLabel],
      type: MenuItemType.Internal,
    })),
  },
});
