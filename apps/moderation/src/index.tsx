import { moduleName as commons } from '@akashaproject/sdk-common/lib/constants';
import { moduleName as dbModule } from '@akashaproject/sdk-db/lib/constants';
import { moduleName as auth } from '@akashaproject/sdk-auth/lib/constants';
import { moduleName as profiles } from '@akashaproject/sdk-profiles/lib/constants';

import { initReactI18next } from 'react-i18next';
import routes, { rootRoute } from './routes';
import { Application, LogoTypeSource } from '@akashaproject/ui-awf-typings';

export const application: Application = {
  activeWhen: {
    path: rootRoute,
  },
  i18nConfig: {
    loadNS: [],
    use: [initReactI18next],
  },
  loadingFn: (): Promise<any> => import('./components'),
  name: 'moderation-app',
  sdkModules: [{ module: commons }, { module: dbModule }, { module: auth }, { module: profiles }],
  menuItems: routes,
  title: 'Moderator Dashboard',
  logo: { type: LogoTypeSource.ICON, value: 'appModeration' },
  widgets: {},
};
