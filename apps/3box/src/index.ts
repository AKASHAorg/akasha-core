import { moduleName as commons } from '@akashaproject/sdk-common/lib/constants';
import { initReactI18next } from 'react-i18next';
import { rootRoute } from './routes';

export const application = {
  activeWhen: {
    path: rootRoute,
  },
  i18nConfig: {
    loadNS: [],
    use: [initReactI18next],
  },
  loadingFn: (): Promise<any> =>
    import(
      /* webpackChunkName: "3boxChunk" */
      /* webpackMode: "lazy" */
      './components'
    ),
  name: '3box-app',
  sdkModules: [{ module: commons }],
  title: '3box integration',
};
