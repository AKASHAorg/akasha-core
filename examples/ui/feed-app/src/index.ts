// const publicPath = 'http://localhost:8131';
// const resourcePath = (pkg: string) => {
//   return `${publicPath}${pkg}`;
// };

(async function bootstrap(System) {
  // tslint:disable-next-line:no-console
  console.time('loadApps');
  // example for loading from import map
  const sidebarWidget = await System.import('@widget/sidebar');
  const layout = await System.import('@widget/layout');
  const topbarWidget = await System.import('@widget/topbar');
  const loginWidget = await System.import('@widget/login');

  const feedPlugin = await System.import('@plugins/feed');
  // tslint:disable-next-line:no-console
  console.timeEnd('loadApps');
  const appConfig = {
    rootNodeId: 'root',
    layout: layout.application,
  };

  const registeredPlugins = [
    {
      app: feedPlugin.application,
      sdkModules: [],
    },
  ];

  const registeredWidgets = [
    {
      app: sidebarWidget.application,
      config: { slot: layout.application.sidebarSlotId },
    },
    {
      app: topbarWidget.application,
      config: { slot: layout.application.topbarSlotId },
    },
    {
      app: loginWidget.application,
      config: {}
    }
  ];
  const profilePlugin = await System.import('@plugins/profile');
  const boxApp = await System.import('@app/3box');
  const ipfs = await System.import('ipfs');
  const sdk = await System.import('@akashaproject/sdk');
  const world = sdk.init({
    config: appConfig,
    initialApps: { plugins: registeredPlugins, widgets: registeredWidgets },
  });

  // tslint:disable-next-line:no-console
  console.log('initial sdk instance', world);

  Object.defineProperty(window, 'Ipfs', {
    value: ipfs,
    writable: false,
  });

  // example loading an extra plugin after start
  world.appLoader.registerPlugin({
    app: profilePlugin.application,
    sdkModules: [],
  });

  world.appLoader.registerApp({
    app: boxApp.application,
  });
  // @ts-ignore
})(window.System);
