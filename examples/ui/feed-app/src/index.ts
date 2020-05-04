import { IAppEntry, MenuItemAreaType } from '@akashaproject/ui-awf-typings/lib/app-loader';

(async function bootstrap(System) {
  // tslint:disable-next-line:no-console
  console.time('loadApps');
  await System.import('single-spa');
  await System.import('single-spa-react');
  await System.import('rxjs');
  // example for loading from import map
  const sidebarWidget = await System.import('@widget/sidebar');
  const layout = await System.import('@widget/layout');
  const topbarWidget = await System.import('@widget/topbar');
  const loginWidget = await System.import('@widget/login');

  const feedPlugin = await System.import('@plugins/feed');
  const profilePlugin = await System.import('@plugins/profile');
  const searchPlugin = await System.import('@plugins/search');
  const appCenterPlugin = await System.import('@plugins/app-center');
  const notificationsPlugin = await System.import('@plugins/notifications');

  const boxApp = await System.import('@app/3box');
  // tslint:disable-next-line:no-console
  console.timeEnd('loadApps');
  const appConfig = {
    rootNodeId: 'root',
    layout: layout.application,
  };

  const registeredPlugins: IAppEntry[] = [
    {
      app: feedPlugin.application,
      config: {
        area: MenuItemAreaType.AppArea,
      },
    },
    {
      app: profilePlugin.application,
      config: {
        area: MenuItemAreaType.QuickAccessArea,
      },
    },
    {
      app: searchPlugin.application,
      config: {
        area: MenuItemAreaType.QuickAccessArea,
      },
    },
    {
      app: notificationsPlugin.application,
      config: {
        area: MenuItemAreaType.QuickAccessArea,
      },
    },
    {
      app: appCenterPlugin.application,
      config: {
        area: MenuItemAreaType.BottomArea,
      },
    },
  ];

  const registeredApps = [
    {
      app: boxApp.application,
      config: {
        area: MenuItemAreaType.AppArea,
      },
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
      config: { slot: layout.application.widgetSlotId },
    },
  ];
  const ipfs = await System.import('ipfs');
  const sdk = await System.import('@akashaproject/sdk');

  const world = sdk.init({
    config: appConfig,
    initialApps: { plugins: registeredPlugins, widgets: registeredWidgets, apps: registeredApps },
  });

  // tslint:disable-next-line:no-console
  console.log('initial sdk instance', world);

  Object.defineProperty(window, 'Ipfs', {
    value: ipfs,
    writable: false,
  });

  // example loading an extra plugin after start
  // coming soon

  // @ts-ignore
})(window.System);
