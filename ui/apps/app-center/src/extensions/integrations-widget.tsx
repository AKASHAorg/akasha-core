import * as React from 'react';
import ReactDOM from 'react-dom';
import { I18nextProvider, useTranslation } from 'react-i18next';
import singleSpaReact from 'single-spa-react';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import DS from '@akashaproject/design-system';
import {
  useGetAllInstalledApps,
  useGetIntegrationsInfo,
  withProviders,
  useGetLogin,
  ThemeWrapper,
} from '@akashaproject/ui-awf-hooks';
import routes, { INFO, rootRoute } from '../routes';

const { Box, ICWidgetCard, ErrorLoader } = DS;

const ICWidget: React.FC<RootComponentProps> = props => {
  const { t } = useTranslation('app-integration-center');

  const loginQuery = useGetLogin();

  const isLoggedIn = React.useMemo(() => {
    return !!loginQuery.data.pubKey;
  }, [loginQuery.data]);

  const defaultAppsNamesNormalized = props.worldConfig?.defaultApps.map(app => {
    if (typeof app === 'string') {
      return {
        name: app,
      };
    }
    return app;
  });

  const installedAppsReq = useGetAllInstalledApps(isLoggedIn);
  const installedIntegrationsInfoReq = useGetIntegrationsInfo(installedAppsReq.data);

  // select default apps from list of installed apps
  const filteredDefaultApps = installedIntegrationsInfoReq.data?.getIntegrationInfo.filter(app => {
    if (defaultAppsNamesNormalized?.some(defaultApp => defaultApp.name === app.name)) {
      return app;
    }
  });
  // select user installed apps from list of installed apps
  const filteredInstalledApps = installedIntegrationsInfoReq.data?.getIntegrationInfo.filter(
    app => {
      if (!defaultAppsNamesNormalized?.some(defaultApp => defaultApp.name === app.name)) {
        return app;
      }
    },
  );

  const handleAppClick = (integrationId: string) => {
    props.singleSpa.navigateToUrl(`${routes[INFO]}/${integrationId}`);
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
      <I18nextProvider i18n={props.i18next}>
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
