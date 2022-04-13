import * as React from 'react';
import ReactDOM from 'react-dom';
import { I18nextProvider, useTranslation } from 'react-i18next';
import singleSpaReact from 'single-spa-react';
import { ModalNavigationOptions } from '@akashaproject/ui-awf-typings/lib/app-loader';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import DS from '@akashaproject/design-system';
import {
  useGetAllInstalledApps,
  useGetAllIntegrationsIds,
  useGetLatestReleaseInfo,
  withProviders,
  useGetLogin,
  ThemeWrapper,
} from '@akashaproject/ui-awf-hooks';
import { hiddenIntegrations } from '../hidden-integrations';
import routes, { INFO, rootRoute } from '../routes';

const { Box, ICWidgetCard, ErrorLoader } = DS;

const ICWidget: React.FC<RootComponentProps> = props => {
  const { t } = useTranslation('app-integration-center');

  const { worldConfig } = props;

  const loginQuery = useGetLogin();

  const isLoggedIn = React.useMemo(() => {
    return !!loginQuery.data.pubKey;
  }, [loginQuery.data]);

  const showLoginModal = (redirectTo?: { modal: ModalNavigationOptions }) => {
    props.navigateToModal({ name: 'login', redirectTo });
  };

  const availableIntegrationsReq = useGetAllIntegrationsIds(isLoggedIn);

  const filteredIntegrations = availableIntegrationsReq?.data?.filter(
    id => !hiddenIntegrations.some(hiddenInt => hiddenInt.id === id),
  );

  const defaultIntegrations = [].concat(
    worldConfig.defaultApps,
    worldConfig.defaultWidgets,
    [worldConfig.homepageApp],
    [worldConfig.layout],
  );

  const integrationIdsNormalized = React.useMemo(() => {
    if (filteredIntegrations) {
      return filteredIntegrations.map(integrationId => {
        return { id: integrationId };
      });
    }
    return worldConfig.defaultApps
      .map(integrationName => {
        if (!hiddenIntegrations.some(hiddenInt => hiddenInt.name === integrationName))
          return { name: integrationName };
      })
      .filter(Boolean);
  }, [filteredIntegrations, worldConfig.defaultApps]);

  const installedAppsReq = useGetAllInstalledApps(isLoggedIn);
  const integrationsInfoReq = useGetLatestReleaseInfo(integrationIdsNormalized);

  const { filteredDefaultApps, filteredInstalledApps } = React.useMemo(() => {
    if (integrationsInfoReq.data?.getLatestRelease) {
      return integrationsInfoReq.data?.getLatestRelease.reduce(
        (acc, app) => {
          // select default apps from list of apps
          if (defaultIntegrations.includes(app.name)) {
            acc.filteredDefaultApps.push(app);
          } else {
            // select user installed apps from list of installed apps
            if (installedAppsReq.data?.some(installedApp => installedApp.id === app.id)) {
              acc.filteredInstalledApps.push(app);
            }
          }
          return acc;
        },
        { filteredDefaultApps: [], filteredInstalledApps: [] },
      );
    }
    return { filteredDefaultApps: [], filteredInstalledApps: [] };
  }, [defaultIntegrations, installedAppsReq.data, integrationsInfoReq.data?.getLatestRelease]);

  const handleAppClick = (integrationId: string) => {
    if (!isLoggedIn) {
      return showLoginModal();
    }
    props.plugins?.routing?.navigateTo?.({
      appName: '@akashaproject/app-integration-center',
      getNavigationUrl: navRoutes => `${navRoutes[INFO]}/${integrationId}`,
    });
  };

  return (
    <Box pad={{ bottom: 'small' }}>
      <ICWidgetCard
        worldApps={filteredDefaultApps}
        installedApps={filteredInstalledApps}
        titleLabel={t('My Apps')}
        worldAppsLabel={t('World Apps')}
        installedAppsLabel={t('Installed')}
        noWorldAppsLabel={t('No World Apps. Please check later')}
        noInstalledAppsLabel={t('You have no installed apps')}
        noInstalledAppsSubLabel={t('Try some out for extra functionality!')}
        onClickWorldApp={handleAppClick}
        onClickInstalledApp={handleAppClick}
      />
    </Box>
  );
};

const Wrapped = (props: RootComponentProps) => (
  <Router>
    <Route path={rootRoute}>
      <I18nextProvider i18n={props.plugins?.translation?.i18n}>
        <ICWidget {...props} />
      </I18nextProvider>
    </Route>
  </Router>
);

const reactLifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: withProviders(Wrapped),
  errorBoundary: (err, errorInfo, props: RootComponentProps) => {
    if (props.logger) {
      props.logger.error(`${JSON.stringify(errorInfo)}, ${errorInfo}`);
    }
    return (
      <ThemeWrapper {...props}>
        <ErrorLoader
          type="script-error"
          title="Error in integration center widget"
          details={err.message}
        />
      </ThemeWrapper>
    );
  },
});

export const bootstrap = reactLifecycles.bootstrap;

export const mount = reactLifecycles.mount;

export const unmount = reactLifecycles.unmount;
