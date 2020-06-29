import { moduleName as commons } from '@akashaproject/sdk-common/lib/constants';
import { moduleName as dbModule } from '@akashaproject/sdk-db/lib/constants';
import { initReactI18next } from 'react-i18next';
import { Application, LogoTypeSource } from '@akashaproject/ui-awf-typings';
import routes, { rootRoute } from './routes';

export const application: Application = {
  activeWhen: {
    path: rootRoute,
  },
  i18nConfig: {
    loadNS: [],
    use: [initReactI18next],
  },
  loadingFn: (): Promise<any> =>
    import(
      /* webpackChunkName: "ensChunk" */
      /* webpackMode: "lazy" */
      './components'
    ),
  name: 'ens-app',
  sdkModules: [{ module: commons }, { module: dbModule }],
  menuItems: routes,
  title: 'ENS integration',
  logo: { type: LogoTypeSource.ICON, value: 'appEns' },
};
