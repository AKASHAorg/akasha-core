import {
  IAppEntry,
  IWidgetEntry,
  MenuItemAreaType,
} from '@akashaproject/ui-awf-typings/lib/app-loader';

console.time('AppLoader:firstMount');

(async function bootstrap(System) {
  await System.import('@akashaproject/design-system');
  // example for loading from import map
  const sidebarWidget = await System.import('@widget/sidebar');
  const { default: sdkInit } = await System.import('@akashaproject/sdk');
  const layout = await System.import('@widget/layout');
  const topbarWidget = await System.import('@widget/topbar');

  const AKASHAApp = await System.import('@app/AKASHA');
  const moderationApp = await System.import('@app/moderation');
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

  const registeredApps: IAppEntry[] = [
    {
      app: AKASHAApp.application,
      config: {
        area: MenuItemAreaType.AppArea,
      },
    },
    {
      app: moderationApp.application,
      config: {
        area: MenuItemAreaType.AppArea,
      },
    },
  ];

  const registeredWidgets: IWidgetEntry[] = [
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
    initialApps: { apps: registeredApps, widgets: registeredWidgets },
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
