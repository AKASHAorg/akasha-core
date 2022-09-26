import * as React from 'react';
import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';

import DS from '@akashaorg/design-system';
import { useGetLogin } from '@akashaorg/ui-awf-hooks';
import { ModalNavigationOptions, RootComponentProps } from '@akashaorg/typings/ui';
import { useTranslation } from 'react-i18next';
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

import NavButton from './nav-button';
import { hiddenIntegrations } from '../hidden-integrations';
import routes, { EXPLORE, MY_APPS, MY_WIDGETS, INFO } from '../routes';

const { Box, Text, BasicCardBox } = DS;

const AppRoutes: React.FC<RootComponentProps> = props => {
  const { worldConfig } = props;
  const { t } = useTranslation('app-integration-center');
  const navigateTo = props.plugins['@akashaorg/app-routing']?.routing?.navigateTo;

  const loginQuery = useGetLogin();

  const isLoggedIn = React.useMemo(() => {
    return !!loginQuery.data.pubKey && loginQuery.data.isReady;
  }, [loginQuery.data]);

  const showLoginModal = (redirectTo?: { modal: ModalNavigationOptions }) => {
    props.navigateToModal({ name: 'login', redirectTo });
  };

  const handleSignedOutUser = () => {
    if (!isLoggedIn) {
      showLoginModal();
    }
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
            <BasicCardBox style={{ maxHeight: '92vh' }} onClick={handleSignedOutUser}>
              <Box height="6rem" alignContent="stretch" flex={{ shrink: 0 }}>
                <Box pad="medium">
                  <Text size="xlarge" weight={'bold'}>
                    {t('Integration Center')}
                  </Text>
                </Box>
                <Box direction="row" justify="between" pad={{ top: 'small' }}>
                  <NavButton
                    path={routes[EXPLORE]}
                    label={t('Explore')}
                    icon={'explore'}
                    onClick={() => {
                      if (isLoggedIn) {
                        navigateTo?.({
                          appName: '@akashaorg/app-integration-center',
                          getNavigationUrl: routes => routes[EXPLORE],
                        });
                      }
                    }}
                  />
                  <NavButton
                    path={routes[MY_APPS]}
                    label={t('My Apps')}
                    icon={'integrationAppSmallFill'}
                    onClick={() => {
                      if (isLoggedIn) {
                        navigateTo?.({
                          appName: '@akashaorg/app-integration-center',
                          getNavigationUrl: routes => routes[MY_APPS],
                        });
                      }
                    }}
                  />
                  <NavButton
                    path={routes[MY_WIDGETS]}
                    label={t('My Widgets')}
                    icon={'integrationWidgetSmall'}
                    onClick={() => {
                      if (isLoggedIn) {
                        navigateTo?.({
                          appName: '@akashaorg/app-integration-center',
                          getNavigationUrl: routes => routes[MY_WIDGETS],
                        });
                      }
                    }}
                  />
                  {/* <NavButton
                  path={routes[APPS]}
                  label={t('Apps')}
                  icon={'integrationAppSmall'}
                  onClick={() => {
                    if (isLoggedIn) {
                      navigateTo?.({
                        appName: '@akashaorg/app-integration-center',
                        getNavigationUrl: routes => routes[APPS],
                      });
                    }
                  }}
                /> */}
                </Box>
              </Box>

              <Box overflow={'auto'}>
                <Routes>
                  <Route
                    path={routes[EXPLORE]}
                    element={
                      <ExplorePage
                        installableApps={installableApps}
                        installedAppsInfo={installedAppsReq.data}
                        isFetching={integrationsInfoReq.isFetching}
                        reqError={integrationsInfoReq.error}
                        isUserLoggedIn={isLoggedIn}
                        {...props}
                      />
                    }
                  />
                  <Route
                    path={routes[MY_APPS]}
                    element={
                      <MyAppsPage
                        latestReleasesInfo={latestReleasesInfo}
                        defaultIntegrations={defaultIntegrations}
                        installedAppsInfo={installedAppsReq.data}
                        isFetching={integrationsInfoReq.isFetching}
                        {...props}
                      />
                    }
                  />
                  {/*<Route path={routes[APPS]} element={<AppsPage {...props} />} />*/}
                  <Route
                    path={routes[MY_WIDGETS]}
                    element={
                      <MyWidgetsPage
                        latestReleasesInfo={latestReleasesInfo}
                        isFetching={integrationsInfoReq.isFetching}
                        {...props}
                      />
                    }
                  />
                </Routes>
              </Box>
            </BasicCardBox>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
