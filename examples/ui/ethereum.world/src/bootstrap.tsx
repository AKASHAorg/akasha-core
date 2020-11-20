import ScriptLoader from './script-loader';
import splashScreen from './splash-screen';
import loadDependencies from './load-dependencies';

const PORT = '8131';
const HOST = 'http://localhost';

const getUserApps = async (_options: { userId: string }) => {
  const appSources = [];
  const widgetSources = [];
  return {
    apps: appSources,
    widgets: widgetSources,
  };
};

const getDefaultApps = async () => {
  // get default apps and widgets from somewhere
  const appSources = [
    {
      src: `${HOST}:${PORT}/apps/ens/index.js`,
      name: 'akashaproject__app_ens_integration',
      moduleName: './app',
    },
  ];
  // plugins
  const pluginSources = [
    {
      src: `${HOST}:${PORT}/plugins/profile/index.js`,
      name: 'akashaproject__ui_plugin_profile',
      moduleName: './app',
    },
  ];
  // widgets
  const widgetSources = [
    {
      src: `${HOST}:${PORT}/widgets/login/index.js`,
      name: 'akashaproject__ui_widget_login',
      moduleName: './app',
    },
  ];
  return {
    apps: appSources,
    plugins: pluginSources,
    widgets: widgetSources,
  };
};

interface Win extends Window {
  akashaproject__sdk?: { default: ({ config, initialApps }) => void };
}

const scriptLoader = new ScriptLoader();

const bootstrap = async () => {
  const win: Win = window;
  const splashElement = splashScreen;

  const topBarSrc = {
    src: `${HOST}:${PORT}/widgets/topbar/index.js`,
    name: 'akashaproject__ui_widget_topbar',
    moduleName: './app',
  };
  // define the layout we want to load
  const layoutSrc = {
    src: `${HOST}:${PORT}/widgets/layout/index.js`,
    name: 'akashaproject__ui_widget_layout',
    moduleName: './app',
  };
  // define the app we want to load at '/' path
  const rootApp = {
    src: `${HOST}:${PORT}/apps/akasha/index.js`,
    name: 'akashaproject__app_akasha_integration',
    moduleName: './app',
  };

  const appConfig = {
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
  await loadDependencies({
    host: HOST,
    port: PORT,
  });

  const initializeSdk = async config => {
    const defaultApps = await getDefaultApps();
    const userApps = await getUserApps({ userId: 'blablaUserId' });
    // @ts-ignore
    const { default: sdkInit } = win.akashaproject__sdk;
    const sdk = sdkInit({
      config: config,
      initialApps: {
        plugins: [],
        widgets: [],
        // also register the default app
        apps: [{ app: config.rootLoadedApp }],
      },
    });
    scriptLoader.subscribe('topbar', module => {
      sdk.appLoader.registerWidget({
        app: module.application,
        config: {
          slot: sdk.appLoader.config.layout.topbarSlotId,
        },
      });
    });
    scriptLoader.subscribe('defaultApps', module => {
      sdk.appLoader.registerApp({
        app: module.application,
      });
    });
    scriptLoader.subscribe('defaultPlugins', module => {
      sdk.appLoader.registerPlugin({
        app: module.application,
      });
    });
    scriptLoader.subscribe('defaultWidgets', module => {
      sdk.appLoader.registerWidget({
        app: module.application,
        config: {
          slot: sdk.appLoader.config.layout.rootWidgetSlotId,
        },
      });
    });
    scriptLoader.loadModules([topBarSrc], 'topbar');
    // load default installed apps/plugins and widgets
    scriptLoader.loadModules(defaultApps.apps, 'defaultApps');
    scriptLoader.loadModules(defaultApps.plugins, 'defaultPlugins');
    scriptLoader.loadModules(defaultApps.widgets, 'defaultWidgets');

    scriptLoader.loadModules(userApps.apps, 'userApps');
    // tslint:disable-next-line: no-console
    console.log('initial sdk instance', sdk);
  };

  scriptLoader.subscribe('layout', module => {
    appConfig.layout = module.application;
  });

  scriptLoader.subscribe('rootApp', module => {
    appConfig.rootLoadedApp = module.application;
    if (appConfig.layout) {
      initializeSdk(appConfig);
    }
  });

  scriptLoader.loadModules([layoutSrc], 'layout');
  scriptLoader.loadModules([rootApp], 'rootApp');
};

bootstrap();
