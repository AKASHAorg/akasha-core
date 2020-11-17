import { loadScripts } from './load-scripts';
import ScriptLoader from './script-loader';
import splashScreen from './splash-screen';

// const getUserApps = async (_options: { userId: string }) => {
//   const appSources = [];
//   const widgetSources = [];
//   return {
//     apps: appSources,
//     widgets: widgetSources,
//   };
// };

// const getDefaultApps = async () => {
//   // get default apps and widgets from somewhere
//   const appSources = [];
//   // plugins
//   const pluginSources = [];
//   // widgets
//   const widgetSources = [];
//   return {
//     apps: appSources,
//     plugins: pluginSources,
//     widgets: widgetSources,
//   };
// };

const dependencies = [
  { src: 'https://unpkg.com/single-spa-react@2.14.0/lib/single-spa-react.js' },
  {
    src: 'https://unpkg.com/single-spa-react@2.14.0/lib/single-spa-react.js.map',
    type: 'application/json',
  },
  { src: 'https://unpkg.com/rxjs@6.6.3/bundles/rxjs.umd.min.js' },
  { src: 'https://unpkg.com/rxjs@6.6.3/bundles/rxjs.umd.min.js.map', type: 'application/json' },
];

interface Win extends Window {
  akashaproject__sdk?: { default: ({ config, initialApps }) => void };
}

const scriptLoader = new ScriptLoader();

const bootstrap = async () => {
  const win: Win = window;
  const splashElement = splashScreen;
  // @ts-ignore
  const { default: sdkInit } = await import('akasha.sdk.js');
  // define the layout we want to load
  const layoutSrc = {
    src: 'http://localhost:48404/remoteEntry.js',
    name: 'akashaproject__ui_widget_layout',
    moduleName: './app',
  };
  // define the app we want to load at '/' path
  const rootApp = {
    src: 'http://localhost:48424/remoteEntry.js',
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
  await loadScripts(dependencies);

  const initializeSdk = async config => {
    // const defaultApps = await getDefaultApps();

    const sdk = sdkInit({
      config: config,
      initialApps: {
        plugins: [],
        widgets: [],
        // also register the default app
        apps: [{ app: config.rootLoadedApp }],
      },
    });
    console.log(sdk, 'the sdk');
  };

  scriptLoader.subscribe('layout', module => {
    appConfig.layout = module.application;
    if (appConfig.rootLoadedApp) {
      console.log('about to init sdk, in layout', appConfig);
      initializeSdk(appConfig);
    }
  });

  scriptLoader.subscribe('rootApp', module => {
    appConfig.rootLoadedApp = module.application;
    console.log('about to init sdk', appConfig);
    if (appConfig.layout) {
      initializeSdk(appConfig);
    }
  });

  scriptLoader.loadModules([layoutSrc], 'layout');
  scriptLoader.loadModules([rootApp], 'rootApp');
};

bootstrap();
