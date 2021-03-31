interface GetUserAppsOptions {
  userId: string;
  appsPublicPath: string;
  widgetsPublicPath: string;
}

export const getUserApps = async (_options: GetUserAppsOptions) => {
  const appSources = [];
  const widgetSources = [];
  return {
    apps: appSources,
    widgets: widgetSources,
  };
};
