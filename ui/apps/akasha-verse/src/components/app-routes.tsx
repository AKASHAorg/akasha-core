import React from 'react';
import ExplorePage from './pages/explore-page';
import InfoPage from './pages/info-page';
import MyAppsPage from './pages/my-apps-page';
import MyWidgetsPage from './pages/my-widgets-page';
import AppsPage from './pages/apps-page';
import MasterPage from './pages/master-page';
import routes, { EXPLORE, MY_APPS, MY_WIDGETS, INFO, APPS } from '../routes';
import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';
import { useGetLogin } from '@akashaorg/ui-awf-hooks';
import { RootComponentProps } from '@akashaorg/typings/ui';
import { useGetAppsQuery } from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';
import { hiddenIntegrations } from '../hidden-integrations';

const AppRoutes: React.FC<RootComponentProps> = props => {
  const { worldConfig, plugins, baseRouteName } = props;

  const loginQuery = useGetLogin();

  const isLoggedIn = React.useMemo(() => {
    return !!loginQuery.data?.id;
  }, [loginQuery.data]);

  const navigateTo = plugins['@akashaorg/app-routing']?.routing?.navigateTo;

  const defaultIntegrations = [].concat(
    worldConfig.defaultApps,
    worldConfig.defaultWidgets,
    [worldConfig.homepageApp],
    [worldConfig.layout],
  );

  const appsReq = useGetAppsQuery(
    {
      last: 50,
    },
    {
      select: response => response.akashaAppIndex.edges,
      enabled: !!isLoggedIn,
    },
  );

  const availableApps = appsReq.data;

  const filteredIntegrations = React.useMemo(() => {
    return availableApps?.filter(
      app => !hiddenIntegrations.some(hiddenInt => hiddenInt.id === app.node?.id),
    );
  }, [availableApps]);

  const installableApps = React.useMemo(() => {
    return filteredIntegrations?.filter(app => {
      if (defaultIntegrations?.includes(app.node?.name)) {
        return;
      }
      return app.node;
    });
  }, [defaultIntegrations, filteredIntegrations]);

  // @TODO update with new hooks
  // const installedAppsReq = useGetAllInstalledApps(isLoggedIn);

  return (
    <Router basename={baseRouteName}>
      <MasterPage isLoggedIn={isLoggedIn} navigateTo={navigateTo} {...props}>
        <Routes>
          <Route
            path={routes[EXPLORE]}
            element={
              <ExplorePage
                installableApps={installableApps}
                installedAppsInfo={[]}
                isFetching={appsReq.isFetching}
                reqError={appsReq.error as Error}
                isUserLoggedIn={isLoggedIn}
                {...props}
              />
            }
          />
          <Route
            path={routes[MY_APPS]}
            element={
              <MyAppsPage
                availableApps={availableApps}
                defaultIntegrations={defaultIntegrations}
                installedAppsInfo={[]}
                isFetching={appsReq.isFetching}
                {...props}
              />
            }
          />
          <Route path={routes[APPS]} element={<AppsPage {...props} />} />
          <Route
            path={routes[MY_WIDGETS]}
            element={
              <MyWidgetsPage
                availableApps={availableApps}
                isFetching={appsReq.isFetching}
                {...props}
              />
            }
          />
          <Route path={`${routes[INFO]}/:appId`} element={<InfoPage {...props} />} />
          <Route path="/" element={<Navigate to={routes[EXPLORE]} replace />} />
        </Routes>
      </MasterPage>
    </Router>
  );
};

export default AppRoutes;
