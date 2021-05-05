import {
  IAppEntry,
  IWidgetEntry,
  MenuItemAreaType,
} from '@akashaproject/ui-awf-typings/lib/app-loader';
import ScriptLoader from './script-loader';
import splashScreen from './splash-screen';
import loadDependencies from './load-dependencies';
import { getDefaultApps } from './get-default-apps';
// import { getUserApps } from './get-user-apps';

const PUBLIC_PATH = '';
const APPS_PATH = `${PUBLIC_PATH}/apps`;
const PLUGINS_PATH = `${PUBLIC_PATH}/plugins`;
const WIDGETS_PATH = `${PUBLIC_PATH}/widgets`;

interface Win extends Window {
  akashaproject__sdk?: { default: ({ config, initialApps }) => void };
}

const scriptLoader = new ScriptLoader();

const bootstrap = async () => {
  // tslint:disable-next-line:no-console
  console.time('AppLoader:firstMount');
  const win: Win = window;
  const splashElement = splashScreen;

  const topBarSrc = {
    src: `${WIDGETS_PATH}/topbar/index.js`,
    name: 'akashaproject__ui_widget_topbar',
    moduleName: './app',
  };
  // define the layout we want to load
  const layoutSrc = {
    src: `${WIDGETS_PATH}/layout/index.js`,
    name: 'akashaproject__ui_widget_layout',
    moduleName: './app',
  };
  // define the app we want to load at '/' path
  const rootApp = {
    src: `${APPS_PATH}/akasha/index.js`,
    name: 'akashaproject__app_akasha_integration',
    moduleName: './app',
    config: {
      area: MenuItemAreaType.AppArea,
    },
  };

  const appConfig: {
    rootNodeId: string;
    layout: IWidgetEntry | null;
    rootLoadedApp: IAppEntry | null;
  } = {
    // where to mount the ui
    rootNodeId: 'root',
    // main layout (shell)
    layout: null,
    // define an app that will load at root '/' path
    rootLoadedApp: null,
  };

  // load a splash screen utill the scripts are loaded and
  // sdk initializes
  if (splashElement) {
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.appendChild(splashElement);
    }
  }
  // start loading dependency scripts
  await loadDependencies(PUBLIC_PATH);

  const initializeSdk = async config => {
    const defaultApps = await getDefaultApps(APPS_PATH, PLUGINS_PATH, WIDGETS_PATH);
    // @ts-ignore
    const { default: sdkInit } = win.akashaproject__sdk;
    const sdk = await sdkInit({
      config: config,
      initialApps: {
        plugins: [],
        widgets: [],
        // also register the default app
        apps: [config.rootLoadedApp],
      },
    });

    /**
     * @TODO:
     * We can authenticate the user here (or check if it's returning user)
     * and get the installed apps and widgets
     *
     * import { getUserApps } from './get-user-apps';
     * const userApps = await getUserApps({ userId: 'theUserID' });
     *
     * // => now load the modules
     * scriptLoader.loadModules(userApps.apps, 'userApps');
     * scriptLoader.loadModules(userApps.widgets, 'userWidgets');
     */

    scriptLoader.subscribe('topbar', result => {
      sdk.appLoader.registerWidget({
        app: result.module.application,
        config: Object.assign({}, result.config, {
          slot: sdk.appLoader.config.layout.app.topbarSlotId,
        }),
      });
    });
    scriptLoader.subscribe('defaultApps', result => {
      sdk.appLoader.registerApp({
        config: result.config,
        app: result.module.application,
      });
    });
    scriptLoader.subscribe('defaultPlugins', result => {
      sdk.appLoader.registerPlugin({
        config: result.config,
        app: result.module.application,
      });
    });
    scriptLoader.subscribe('defaultWidgets', result => {
      sdk.appLoader.registerWidget({
        app: result.module.application,
        config: Object.assign({}, result.config, {
          slot: sdk.appLoader.config.layout.app.rootWidgetSlotId,
        }),
      });
    });
    await scriptLoader.loadModules([topBarSrc], 'topbar');
    // load default installed apps/plugins and widgets
    await scriptLoader.loadModules(defaultApps.apps, 'defaultApps');
    await scriptLoader.loadModules(defaultApps.plugins, 'defaultPlugins');
    await scriptLoader.loadModules(defaultApps.widgets, 'defaultWidgets');

    // tslint:disable-next-line: no-console
    console.log('initial sdk instance', sdk);
  };

  scriptLoader.subscribe('layout', result => {
    appConfig.layout = {
      app: result.module.application,
      config: result.config,
    };
  });

  scriptLoader.subscribe('rootApp', result => {
    appConfig.rootLoadedApp = {
      app: result.module.application,
      config: result.config,
    };
    if (appConfig.layout) {
      initializeSdk(appConfig);
    }
  });

  await scriptLoader.loadModules([layoutSrc], 'layout');
  await scriptLoader.loadModules([rootApp], 'rootApp');
};

// tslint:disable-next-line:no-console
bootstrap().then(() => console.log('ui apps loaded'));
