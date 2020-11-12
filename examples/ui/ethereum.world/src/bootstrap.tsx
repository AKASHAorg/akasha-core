import * as React from 'react';
import * as ReactDOM from 'react-dom';
import sdk from '@akashaproject/sdk';
import ScriptLoader from './script-loader';

const getWorldConfig = async () => {
  // get default apps and widgets from somewhere
  const appSources = [
    {
      src: 'http://localhost:48424/remoteEntry.js',
      name: 'akashaproject_appAkashaIntegration',
      moduleName: './app',
    },
  ];
  const pluginSources = [{}];
  const widgetSources = [
    {
      src: 'http://localhost:48404/remoteEntry.js',
      name: 'widget_ethereum_layout',
      moduleName: './app',
    },
  ];
  return {
    apps: appSources,
    plugins: pluginSources,
    widgets: widgetSources,
  };
};

const bootstrap = async () => {
  // get the main world config
  console.log(sdk, 'the sdk');
  const worldConfig = await getWorldConfig();
  const scriptLoader = new ScriptLoader();
  scriptLoader.subscribe('widgets', module =>
    console.log(module.application, 'widget to be fed to single-spa'),
  );
  scriptLoader.subscribe('apps', module =>
    console.log(module.application, 'app to be fed in singlespa'),
  );
  scriptLoader.subscribe('plugins', module =>
    console.log(module.application, 'plugin to be fed into single-spa'),
  );
  scriptLoader.loadModules(worldConfig.widgets, 'widgets');
  scriptLoader.loadModules(worldConfig.apps, 'apps');
};

// @ts-ignore
bootstrap();
