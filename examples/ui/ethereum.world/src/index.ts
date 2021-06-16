import { ILoaderConfig, ISdkConfig, LogLevels } from '@akashaproject/ui-awf-typings/lib/app-loader';

console.time('AppLoader:firstMount');

(async function bootstrap(System) {
  const { default: sdkInit } = await System.import('@akashaproject/sdk');

  console.log('sdkInit', sdkInit);
  const { default: Loader } = await System.import('@akashaproject/app-loader');
  const sdkConfig: ISdkConfig = {
    logLevel: LogLevels.DEBUG,
  };

  const loaderConfig: ILoaderConfig = {
    title: 'Ethereum World',
    // main layout (shell)
    layout: '@akashaproject/ui-widget-layout',
    // define an app that will load at root '/' path
    homepageApp: '@akashaproject/app-akasha-integration',
    // define pre-installed apps,
    // homepageApp is always loaded by default
    defaultApps: [
      '@akashaproject/app-moderation-ewa',
      '@akashaproject/app-search',
      '@akashaproject/ui-plugin-app-center',
      '@akashaproject/ui-plugin-profile',
    ],
    // pre-installed widgets;
    // layout widget is always loaded by default
    defaultWidgets: [
      { name: '@akashaproject/ui-widget-topbar', version: '0.0.1' },
      '@akashaproject/ui-widget-trending',
      '@akashaproject/ui-widget-sidebar',
    ],
  };

  const sdk = await sdkInit(sdkConfig);

  const loader = new Loader({ ...loaderConfig, ...sdkConfig }, sdk);
  await loader.start();

  // tslint:disable-next-line:no-console
  console.log('initial sdk instance', sdk);
})(globalThis.System);
