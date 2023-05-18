import * as React from 'react';
import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';

import { useGetLogin } from '@akashaorg/ui-awf-hooks';
import { ModalNavigationOptions, RootComponentProps } from '@akashaorg/typings/ui';
import {
  useGetAllInstalledApps,
  useGetLatestReleaseInfo,
  useGetAllIntegrationsIds,
} from '@akashaorg/ui-awf-hooks';

import ExplorePage from './pages/explore-page';
import InfoPage from './pages/info-page';
import MyAppsPage from './pages/my-apps-page';
// import AppsPage from './pages/apps-page';
import MyWidgetsPage from './pages/my-widgets-page';

import { hiddenIntegrations } from '../hidden-integrations';
import routes, { EXPLORE, MY_APPS, MY_WIDGETS, INFO } from '../routes';
import PageByType from './pages/page-by-type';

const AppRoutes: React.FC<RootComponentProps> = props => {
  const { worldConfig } = props;

  const loginQuery = useGetLogin();

  const isLoggedIn = React.useMemo(() => {
    return !!loginQuery.data.pubKey && loginQuery.data.isReady;
  }, [loginQuery.data]);

  const showLoginModal = (redirectTo?: { modal: ModalNavigationOptions }) => {
    props.navigateToModal({ name: 'login', redirectTo });
  };

  const defaultIntegrations = [].concat(
    worldConfig.defaultApps,
    worldConfig.defaultWidgets,
    [worldConfig.homepageApp],
    [worldConfig.layout],
  );

  const availableIntegrationsReq = useGetAllIntegrationsIds(isLoggedIn);

  const filteredIntegrations = React.useMemo(() => {
    return availableIntegrationsReq?.data?.filter(
      id => !hiddenIntegrations.some(hiddenInt => hiddenInt.id === id),
    );
  }, [availableIntegrationsReq?.data]);

  const integrationIdsNormalized = React.useMemo(() => {
    if (filteredIntegrations) {
      return filteredIntegrations.map(integrationId => {
        return { id: integrationId };
      });
    }
    return [];
  }, [filteredIntegrations]);

  const integrationsInfoReq = useGetLatestReleaseInfo(integrationIdsNormalized);

  const latestReleasesInfo = React.useMemo(() => {
    return integrationsInfoReq.data?.getLatestRelease;
  }, [integrationsInfoReq.data?.getLatestRelease]);

  const installableApps = React.useMemo(() => {
    return latestReleasesInfo?.filter(releaseInfo => {
      if (defaultIntegrations?.includes(releaseInfo.name)) {
        return;
      }
      return releaseInfo;
    });
  }, [defaultIntegrations, latestReleasesInfo]);

  const installedAppsReq = useGetAllInstalledApps(isLoggedIn);

  return (
    <Router basename={props.baseRouteName}>
      <Routes>
        <Route path="/" element={<Navigate to={routes[EXPLORE]} replace />} />
        <Route path={`${routes[INFO]}/:integrationId`} element={<InfoPage {...props} />} />
        <Route
          path="*"
          element={
            <Routes>
              <Route
                path={routes[EXPLORE]}
                element={
                  <PageByType type="explore">
                    <ExplorePage
                      installableApps={installableApps}
                      installedAppsInfo={installedAppsReq.data}
                      isFetching={integrationsInfoReq.isFetching}
                      reqError={integrationsInfoReq.error}
                      isUserLoggedIn={isLoggedIn}
                      {...props}
                    />
                  </PageByType>
                }
              />
              <Route
                path={routes[MY_APPS]}
                element={
                  <PageByType type="my-apps">
                    <MyAppsPage
                      latestReleasesInfo={latestReleasesInfo}
                      defaultIntegrations={defaultIntegrations}
                      installedAppsInfo={installedAppsReq.data}
                      isFetching={integrationsInfoReq.isFetching}
                      {...props}
                    />
                  </PageByType>
                }
              />
              <Route
                path={routes[MY_WIDGETS]}
                element={
                  <PageByType type="widgets">
                    <MyWidgetsPage
                      latestReleasesInfo={latestReleasesInfo}
                      isFetching={integrationsInfoReq.isFetching}
                      {...props}
                    />
                  </PageByType>
                }
              />
            </Routes>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
