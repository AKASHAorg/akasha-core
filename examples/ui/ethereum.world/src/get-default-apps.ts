import { MenuItemAreaType } from '@akashaproject/ui-awf-typings/lib/app-loader';

export const getDefaultApps = async (appsPublicPath, pluginsPublicPath, _widgetsPublicPath) => {
  // get default apps and widgets from somewhere
  const appSources = [
    {
      src: `${appsPublicPath}/moderation/index.js`,
      name: 'akashaproject__app_moderation_ewa',
      moduleName: './app',
      config: {
        area: MenuItemAreaType.AppArea,
      },
    },
  ];
  // plugins
  const pluginSources = [
    {
      src: `${pluginsPublicPath}/profile/index.js`,
      name: 'akashaproject__ui_plugin_profile',
      moduleName: './app',
      config: {
        area: MenuItemAreaType.QuickAccessArea,
      },
    },
    {
      src: `${pluginsPublicPath}/bookmarks/index.js`,
      name: 'akashaproject__ui_plugin_bookmarks',
      moduleName: './app',
      config: {
        area: MenuItemAreaType.QuickAccessArea,
      },
    },
    {
      src: `${pluginsPublicPath}/search/index.js`,
      name: 'akashaproject__ui_plugin_search',
      moduleName: './app',
      config: {
        area: MenuItemAreaType.SearchArea,
      },
    },
    {
      src: `${pluginsPublicPath}/notifications/index.js`,
      name: 'akashaproject__ui_plugin_notifications',
      moduleName: './app',
      config: {
        area: MenuItemAreaType.QuickAccessArea,
      },
    },
    {
      src: `${pluginsPublicPath}/app-center/index.js`,
      name: 'akashaproject__ui_plugin_app_center',
      moduleName: './app',
      config: {
        area: MenuItemAreaType.BottomArea,
      },
    },
  ];
  // widgets
  const widgetSources = [];

  return {
    apps: appSources,
    plugins: pluginSources,
    widgets: widgetSources,
  };
};
