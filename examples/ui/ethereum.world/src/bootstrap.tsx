import { IAppEntry, MenuItemAreaType } from '@akashaproject/ui-awf-typings/lib/app-loader';

(async function bootstrap(System) {
  await System.import('single-spa');
  // await System.import('single-spa-react');
  await System.import('rxjs');
  // await System.import('@akashaproject/design-system');
  // example for loading from import map
  const sidebarWidget = await System.import('@widget/sidebar');
  const { default: sdkInit } = await System.import('@akashaproject/sdk');
  const layout = await System.import('@widget/layout');
  const topbarWidget = await System.import('@widget/topbar');
  const loginWidget = await System.import('@widget/login');

  const AKASHAApp = await System.import('@app/AKASHA');
  const profilePlugin = await System.import('@plugins/profile');
  const searchPlugin = await System.import('@plugins/search');

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

  const registeredWidgets: any[] = [
    {
      app: sidebarWidget.application,
      config: { slot: layout.application.sidebarSlotId },
    },
    {
      app: topbarWidget.application,
      config: { slot: layout.application.topbarSlotId },
    },
  ];

  const appCenterPlugin = await System.import('@plugins/app-center');
  const notificationsPlugin = await System.import('@plugins/notifications');

  const world = await sdkInit({
    config: appConfig,
    initialApps: { plugins: registeredPlugins, widgets: registeredWidgets },
  });

  // tslint:disable-next-line:no-console
  console.log('initial sdk instance', world);

  // example loading an extra plugin after start
  world.appLoader.registerPlugin({
    app: notificationsPlugin.application,
    config: {
      area: MenuItemAreaType.QuickAccessArea,
    },
  });
  world.appLoader.registerPlugin({
    app: profilePlugin.application,
    config: {
      area: MenuItemAreaType.QuickAccessArea,
    },
  });
  world.appLoader.registerPlugin({
    app: searchPlugin.application,
    config: {
      area: MenuItemAreaType.SearchArea,
    },
  });
  world.appLoader.registerPlugin({
    app: appCenterPlugin.application,
    config: {
      area: MenuItemAreaType.BottomArea,
    },
  });
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
})(window.System);
