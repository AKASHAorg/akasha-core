import * as React from 'react';
import ReactDOM from 'react-dom';
import { I18nextProvider, useTranslation } from 'react-i18next';
import i18next, { setupI18next } from '../i18n';
import singleSpaReact from 'single-spa-react';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import DS from '@akashaproject/design-system';
import {
  useGetAllInstalledApps,
  useGetIntegrationsInfo,
  withProviders,
  useGetLogin,
} from '@akashaproject/ui-awf-hooks';
import routes, { INFO, rootRoute } from '../routes';

const { Box, ICWidgetCard, ErrorLoader } = DS;

const ICWidget: React.FC<RootComponentProps> = props => {
  // const { params } = useRouteMatch<{ postId: string }>();
  const { t } = useTranslation();

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

  const defaultIntegrationsInfoReq = useGetIntegrationsInfo(defaultAppsNamesNormalized);

  const installedAppsReq = useGetAllInstalledApps(isLoggedIn);
  const installedIntegrationsInfoReq = useGetIntegrationsInfo(installedAppsReq.data);

  const handleAppClick = (integrationId: string) => {
    props.singleSpa.navigateToUrl(`${routes[INFO]}/${integrationId}`);
  };

  return (
    <Box pad={{ bottom: 'small' }}>
      <ICWidgetCard
        worldApps={defaultIntegrationsInfoReq.data?.getIntegrationInfo}
        installedApps={installedIntegrationsInfoReq.data?.getIntegrationInfo}
        titleLabel={t('My Apps')}
        worldAppsLabel={t('World Apps')}
        installedAppsLabel={t('Installed')}
        noWorldAppsLabel={t('No World Apps. Please check later')}
        noInstalledAppsLabel={t('No Installed Apps. Please install an app')}
        onClickWorldApp={handleAppClick}
        onClickInstalledApp={handleAppClick}
      />
    </Box>
  );
};

const Wrapped = (props: RootComponentProps) => (
  <Router>
    <Route path={rootRoute}>
      <I18nextProvider i18n={i18next}>
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
      <Box>
        <ErrorLoader
          type="script-error"
          title="Error in integration center widget"
          details={err.message}
        />
      </Box>
    );
  },
});

export const bootstrap = (props: RootComponentProps) => {
  return setupI18next({
    logger: props.logger,
    // must be the same as the one in ../../i18next.parser.config.js
    namespace: 'app-integration-center',
  });
};

export const mount = reactLifecycles.mount;

export const unmount = reactLifecycles.unmount;
