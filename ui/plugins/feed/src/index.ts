import { initReactI18next } from 'react-i18next';
import routes, { rootRoute } from './routes';

export interface Application {
  activeWhen: { path: string; exact?: boolean };
  i18nConfig: { use: any[]; loadNS: any[] };
  loadingFn: () => Promise<any>;
  name: string;
  sdkModules: any[];
  title: string;
  menuItems?: { [p: string]: string };
}
/**
 * All the plugins must export an object like this:
 */
export const application: Application = {
  // This is the root route in which the plugin will render.
  // Make sure to change it as it fits.
  activeWhen: {
    path: rootRoute,
    exact: true,
  },
  // translation config
  i18nConfig: {
    // namespaces that this plugin requires.
    // The ns is loaded automatically, you need to specify it only if changed
    // Example: i have changed the name of this plugin and the created ns was the old plugin name,
    // In this case I will preserve the old ns instead loading a possibly undefined ns.
    loadNS: [],
    // translation namespace. defaults to plugin.name
    // ns: 'ui-plugin-events',
    // i18next.use(arr[0]).use(arr[1]).use(arr[n])
    use: [initReactI18next],
  },
  loadingFn: (): Promise<any> =>
    import(
      /* webpackChunkName: "feedChunk" */
      /* webpackMode: "lazy" */
      './components'
    ),
  name: 'ui-plugin-feed',
  sdkModules: [],
  title: 'AKASHA Feed',
  menuItems: routes,
};
