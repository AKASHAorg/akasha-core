import { IAppEntry, MenuItemAreaType } from '@akashaproject/ui-awf-typings/lib/app-loader';

(async function bootstrap(System) {
  // tslint:disable-next-line:no-console
  console.time('loadApps');
  await System.import('single-spa');
  await System.import('single-spa-react');
  await System.import('rxjs');
  // example for loading from import map
  // const sidebarWidget = await System.import('@widget/sidebar');
  const layout = await System.import('@widget/layout');
  const topbarWidget = await System.import('@widget/topbar');
  // const loginWidget = await System.import('@widget/login');

  const AKASHAApp = await System.import('@app/AKASHA');
  // tslint:disable-next-line:no-console
  console.timeEnd('loadApps');
  const appConfig = {
    // where to mount the ui
    rootNodeId: 'root',
    // main layout (shell)
    layout: layout.application,
    // define an app that will load at root '/' path
    rootLoadedApp: AKASHAApp.application,
    System: System,
  };

  const registeredPlugins: IAppEntry[] = [
    {
      app: AKASHAApp.application,
      config: {
        area: MenuItemAreaType.AppArea,
      },
    },
  ];

  const registeredWidgets = [
    // {
    //   app: sidebarWidget.application,
    //   config: { slot: layout.application.sidebarSlotId },
    // },
    {
      app: topbarWidget.application,
      config: { slot: layout.application.topbarSlotId },
    },
    // {
    //   app: loginWidget.application,
    //   config: { slot: layout.application.rootWidgetSlotId, notOnMobile: true },
    // },
  ];
  // const profilePlugin = await System.import('@plugins/profile');
  // const searchPlugin = await System.import('@plugins/search');
  // const appCenterPlugin = await System.import('@plugins/app-center');
  // const notificationsPlugin = await System.import('@plugins/notifications');
  // const boxApp = await System.import('@app/3box');
  // const ensApp = await System.import('@app/ens');
  // const ipfs = await System.import('ipfs');
  const sdk = await System.import('@akashaproject/sdk');
  const world = sdk.init({
    config: appConfig,
    initialApps: { plugins: registeredPlugins, widgets: registeredWidgets },
  });

  // tslint:disable-next-line:no-console
  console.log('initial sdk instance', world);

  // Object.defineProperty(window, 'Ipfs', {
  //   value: ipfs,
  //   writable: false,
  // });

  // example loading an extra plugin after start
  // world.appLoader.registerPlugin({
  //   app: notificationsPlugin.application,
  //   config: {
  //     area: MenuItemAreaType.QuickAccessArea,
  //   },
  // });
  // world.appLoader.registerPlugin({
  //   app: profilePlugin.application,
  //   config: {
  //     area: MenuItemAreaType.QuickAccessArea,
  //   },
  // });
  // world.appLoader.registerPlugin({
  //   app: searchPlugin.application,
  //   config: {
  //     area: MenuItemAreaType.SearchArea,
  //   },
  // });
  // world.appLoader.registerPlugin({
  //   app: appCenterPlugin.application,
  //   config: {
  //     area: MenuItemAreaType.BottomArea,
  //   },
  // });
  // world.appLoader.registerApp({
  //   app: boxApp.application,
  //   config: {
  //     area: MenuItemAreaType.AppArea,
  //   },
  // });
  // world.appLoader.registerApp({
  //   app: ensApp.application,
  //   config: {
  //     area: MenuItemAreaType.AppArea,
  //   },
  // });
  // @ts-ignore
})(window.System);
