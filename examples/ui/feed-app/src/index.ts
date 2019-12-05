import initSdk from './sdk-init';

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
  const profilePlugin = await System.import('@plugins/profile');
  const feedPlugin = await System.import('@plugins/feed');
  // tslint:disable-next-line:no-console
  console.timeEnd('loadApps');
  const appConfig = {
    rootNodeId: 'root',
    layout: layout.application,
  };

  const registeredPlugins = [
    {
      app: profilePlugin.application,
      sdkModules: [],
    },
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
  ];
  const world = initSdk(appConfig, { plugins: registeredPlugins, widgets: registeredWidgets });
  const eventsPlugin = await System.import('@plugins/events');
  // example loading an extra plugin after start
  world.appLoader.registerPlugin({ app: eventsPlugin.application, sdkModules: [] });
  // @ts-ignore
})(window.System);
