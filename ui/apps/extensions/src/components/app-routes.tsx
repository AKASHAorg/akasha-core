import React from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';
import { useGetLogin, useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import { useGetAppsQuery } from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import ErrorBoundary, {
  ErrorBoundaryProps,
} from '@akashaorg/design-system-core/lib/components/ErrorBoundary';
import ExplorePage from './pages/explore-page';
import InfoPage from './pages/info-page';
import MyAppsPage from './pages/my-apps-page';
import MyWidgetsPage from './pages/my-widgets-page';
import AppsPage from './pages/apps-page';
import MasterPage from './pages/master-page';
import routes, { EXPLORE, MY_APPS, MY_WIDGETS, INFO, APPS } from '../routes';
import { Helmet, helmetData } from '@akashaorg/design-system-core/lib/utils';
import { hiddenIntegrations } from '../hidden-integrations';

const AppRoutes: React.FC<unknown> = () => {
  const { baseRouteName, logger, worldConfig } = useRootComponentProps();
  const { t } = useTranslation('app-extensions');
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

  const errorBoundaryProps: Pick<ErrorBoundaryProps, 'errorObj' | 'logger'> = {
    errorObj: {
      type: 'script-error',
      title: t('Error in extensions app'),
    },
    logger,
  };

  return (
    <>
      <Helmet helmetData={helmetData}>
        <title>Extensions | AKASHA World</title>
      </Helmet>
      <Router basename={baseRouteName}>
        <MasterPage isLoggedIn={isLoggedIn}>
          <Routes>
            <Route
              path={routes[EXPLORE]}
              element={
                <ErrorBoundary {...errorBoundaryProps}>
                  <ExplorePage
                    installableApps={installableApps}
                    installedAppsInfo={[]}
                    isFetching={loading}
                    reqError={error}
                    isUserLoggedIn={isLoggedIn}
                  />
                </ErrorBoundary>
              }
            />
            <Route
              path={routes[MY_APPS]}
              element={
                <ErrorBoundary {...errorBoundaryProps}>
                  <MyAppsPage
                    availableApps={availableApps}
                    defaultIntegrations={defaultIntegrations}
                    installedAppsInfo={[]}
                  />
                </ErrorBoundary>
              }
            />
            <Route
              path={routes[APPS]}
              element={
                <ErrorBoundary {...errorBoundaryProps}>
                  <AppsPage />
                </ErrorBoundary>
              }
            />
            <Route
              path={routes[MY_WIDGETS]}
              element={
                <ErrorBoundary {...errorBoundaryProps}>
                  <MyWidgetsPage availableApps={availableApps} />
                </ErrorBoundary>
              }
            />
            <Route
              path={`${routes[INFO]}/:appId`}
              element={
                <ErrorBoundary {...errorBoundaryProps}>
                  <InfoPage />
                </ErrorBoundary>
              }
            />
            <Route path="/" element={<Navigate to={routes[EXPLORE]} replace />} />
          </Routes>
        </MasterPage>
      </Router>
    </>
  );
};

export default AppRoutes;
