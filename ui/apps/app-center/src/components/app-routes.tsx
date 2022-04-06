import * as React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

import DS from '@akashaproject/design-system';
import { useGetLogin } from '@akashaproject/ui-awf-hooks';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import { ModalNavigationOptions } from '@akashaproject/ui-awf-typings/lib/app-loader';
import { useTranslation } from 'react-i18next';
import {
  useGetAllInstalledApps,
  useGetLatestReleaseInfo,
  useGetAllIntegrationsIds,
} from '@akashaproject/ui-awf-hooks';

import ExplorePage from './pages/explore-page';
import InfoPage from './pages/info-page';
import MyAppsPage from './pages/my-apps-page';
import AppsPage from './pages/apps-page';
import WidgetsPage from './pages/widgets-page';

import NavButton from './nav-button';
import { hiddenIntegrations } from '../hidden-integrations';
import routes, { rootRoute, EXPLORE, MY_APPS, APPS, WIDGETS, INFO } from '../routes';

const { Box, Text, BasicCardBox } = DS;

const AppRoutes: React.FC<RootComponentProps> = props => {
  const { worldConfig } = props;
  const { t } = useTranslation('app-integration-center');
  const navigateTo = props.plugins.routing?.navigateTo;

  const loginQuery = useGetLogin();

  const isLoggedIn = React.useMemo(() => {
    return !!loginQuery.data.pubKey;
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

  const filteredIntegrations = availableIntegrationsReq?.data?.filter(
    id => !hiddenIntegrations.some(hiddenInt => hiddenInt.id === id),
  );

  const integrationIdsNormalized = filteredIntegrations?.map(integrationId => {
    return { id: integrationId };
  });

  const integrationsInfoReq = useGetLatestReleaseInfo(integrationIdsNormalized);

  const installedAppsReq = useGetAllInstalledApps(isLoggedIn);

  return (
    <Router>
      <Switch>
        <Route path={`${routes[INFO]}/:integrationId`}>
          <InfoPage {...props} />
        </Route>
        <Route path="*">
          <Redirect exact={true} from={rootRoute} to={routes[EXPLORE]} />
          <BasicCardBox style={{ maxHeight: '92vh' }} onClick={handleSignedOutUser}>
            <Box height="6rem" alignContent="stretch" flex={{ shrink: 0 }}>
              <Box pad="medium">
                <Text size="large" weight={'bold'}>
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
                        appName: '@akashaproject/app-integration-center',
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
                        appName: '@akashaproject/app-integration-center',
                        getNavigationUrl: routes => routes[MY_APPS],
                      });
                    }
                  }}
                />
                <NavButton
                  path={routes[WIDGETS]}
                  label={t('Widgets')}
                  icon={'integrationWidgetSmall'}
                  onClick={() => {
                    if (isLoggedIn) {
                      navigateTo?.({
                        appName: '@akashaproject/app-integration-center',
                        getNavigationUrl: routes => routes[WIDGETS],
                      });
                    }
                  }}
                />
                <NavButton
                  path={routes[APPS]}
                  label={t('Apps')}
                  icon={'integrationAppSmall'}
                  onClick={() => {
                    if (isLoggedIn) {
                      navigateTo?.({
                        appName: '@akashaproject/app-integration-center',
                        getNavigationUrl: routes => routes[APPS],
                      });
                    }
                  }}
                />
              </Box>
            </Box>

            <Box overflow={'auto'}>
              <Switch>
                <Route path={routes[EXPLORE]}>
                  <ExplorePage
                    latestReleasesInfo={integrationsInfoReq.data?.getLatestRelease}
                    defaultIntegrations={defaultIntegrations}
                    installedAppsInfo={installedAppsReq.data}
                    isFetching={integrationsInfoReq.isFetching}
                    reqError={integrationsInfoReq.error}
                    isUserLoggedIn={isLoggedIn}
                    {...props}
                  />
                </Route>
                <Route path={routes[MY_APPS]}>
                  <MyAppsPage
                    latestReleasesInfo={integrationsInfoReq.data?.getLatestRelease}
                    defaultIntegrations={defaultIntegrations}
                    installedAppsInfo={installedAppsReq.data}
                    isFetching={integrationsInfoReq.isFetching}
                    {...props}
                  />
                </Route>
                <Route path={routes[APPS]}>
                  <AppsPage {...props} />
                </Route>
                <Route path={routes[WIDGETS]}>
                  <WidgetsPage
                    latestReleasesInfo={integrationsInfoReq.data?.getLatestRelease}
                    isFetching={integrationsInfoReq.isFetching}
                    {...props}
                  />
                </Route>
              </Switch>
            </Box>
          </BasicCardBox>
        </Route>
      </Switch>
    </Router>
  );
};

export default AppRoutes;
