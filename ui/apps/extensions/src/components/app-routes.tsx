import React from 'react';
import ExplorePage from './pages/explore-page';
import InfoPage from './pages/info-page';
import MyAppsPage from './pages/my-apps-page';
import MyWidgetsPage from './pages/my-widgets-page';
import AppsPage from './pages/apps-page';
import MasterPage from './pages/master-page';
import routes, { EXPLORE, MY_APPS, MY_WIDGETS, INFO, APPS } from '../routes';
import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';
import { useGetLogin, useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import { useGetAppsQuery } from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import { hiddenIntegrations } from '../hidden-integrations';

const AppRoutes: React.FC<unknown> = () => {
  const { worldConfig, baseRouteName } = useRootComponentProps();

  const { data } = useGetLogin();
  const isLoggedIn = !!data?.id;

  const defaultIntegrations = [].concat(
    worldConfig.defaultApps,
    worldConfig.defaultWidgets,
    [worldConfig.homepageApp],
    [worldConfig.layout],
  );

  const {
    data: appsReq,
    loading,
    error,
  } = useGetAppsQuery({
    variables: {
      first: 50,
    },
    skip: !isLoggedIn,
  });

  const availableApps = appsReq?.akashaAppIndex?.edges;

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
      <MasterPage isLoggedIn={isLoggedIn}>
        <Routes>
          <Route
            path={routes[EXPLORE]}
            element={
              <ExplorePage
                installableApps={installableApps}
                installedAppsInfo={[]}
                isFetching={loading}
                reqError={error}
                isUserLoggedIn={isLoggedIn}
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
              />
            }
          />
          <Route path={routes[APPS]} element={<AppsPage />} />
          <Route
            path={routes[MY_WIDGETS]}
            element={<MyWidgetsPage availableApps={availableApps} />}
          />
          <Route path={`${routes[INFO]}/:appId`} element={<InfoPage />} />
          <Route path="/" element={<Navigate to={routes[EXPLORE]} replace />} />
        </Routes>
      </MasterPage>
    </Router>
  );
};

export default AppRoutes;
