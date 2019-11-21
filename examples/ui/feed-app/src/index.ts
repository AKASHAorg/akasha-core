import initSdk from './sdk-init';

const publicPath = 'http://localhost:8131';
const resourcePath = (pkg: string) => {
  return `${publicPath}${pkg}`;
};

(async function bootstrap(System) {
  // tslint:disable-next-line:no-console
  console.time('loadApps');
  const layout = await System.import('/widgets/layout.js');
  // example for loading from absolute path
  const sidebarWidget = await System.import(resourcePath('/widgets/sidebar.js'));

  const topbarWidget = await System.import('/widgets/topbar.js');
  const profilePlugin = await System.import('/plugins/profile.js');
  const feedPlugin = await System.import('/plugins/feed.js');
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
  const eventsPlugin = await System.import('/plugins/events.js');
  // example loading an extra plugin after start
  world.appLoader.registerPlugin({ app: eventsPlugin.application, sdkModules: [] });
  // @ts-ignore
})(window.System);
