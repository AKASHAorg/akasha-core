import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import singleSpaReact from 'single-spa-react';
import { I18nextProvider, useTranslation } from 'react-i18next';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import { ModalNavigationOptions, RootComponentProps } from '@akashaorg/typings/ui';
import { withProviders, useGetLogin } from '@akashaorg/ui-awf-hooks';
import { hiddenIntegrations } from './hidden-integrations';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import TabList from '@akashaorg/design-system-core/lib/components/TabList';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import AppsList from './apps-list';

import NoAppsMessage from './no-apps-message';

const ICWidget: React.FC<RootComponentProps> = props => {
  const { t } = useTranslation('app-akasha-verse');

  const { worldConfig, plugins } = props;

  const loginQuery = useGetLogin();
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const isLoggedIn = React.useMemo(() => {
    return !!loginQuery.data?.id;
  }, [loginQuery.data]);

  const showLoginModal = (redirectTo?: { modal: ModalNavigationOptions }) => {
    props.navigateToModal({ name: 'login', redirectTo });
  };

  const availableIntegrationsReq = null;

  const filteredIntegrations = React.useMemo(() => {
    return availableIntegrationsReq?.data?.filter(
      id => !hiddenIntegrations.some(hiddenInt => hiddenInt.id === id),
    );
  }, [availableIntegrationsReq?.data]);

  const defaultIntegrations = [].concat(
    worldConfig.defaultApps,
    worldConfig.defaultWidgets,
    [worldConfig.homepageApp],
    [worldConfig.layout],
  );

  const filteredDefaultIntegrations = React.useMemo(() => {
    return defaultIntegrations?.filter(
      id => !hiddenIntegrations.some(hiddenInt => hiddenInt.id === id),
    );
  }, [defaultIntegrations]);

  const defaultApps = [].concat(worldConfig.defaultApps, [worldConfig.homepageApp]);

  const integrationIdsNormalized = React.useMemo(() => {
    if (filteredIntegrations) {
      return filteredIntegrations.map(integrationId => {
        return { id: integrationId };
      });
    }
    return filteredDefaultIntegrations
      .map(integrationName => {
        if (!hiddenIntegrations.some(hiddenInt => hiddenInt.name === integrationName))
          return { name: integrationName };
      })
      .filter(Boolean);
  }, [filteredIntegrations, filteredDefaultIntegrations]);

  const installedAppsReq = null;
  const integrationsInfoReq = null;

  const { filteredDefaultApps, filteredInstalledApps } = React.useMemo(() => {
    if (integrationsInfoReq?.data?.getLatestRelease) {
      return integrationsInfoReq.data?.getLatestRelease.reduce(
        (acc, app) => {
          // select default apps from list of apps
          if (defaultApps.includes(app.name)) {
            // prepare for AppList component
            acc.filteredDefaultApps.push({
              name: app.manifestData.displayName,
              appId: app.name,
              appIcon: 'PaperAirplaneIcon',
            });
          } else {
            // select user installed apps from list of installed apps
            if (installedAppsReq?.data?.some(installedApp => installedApp.name === app.name)) {
              acc.filteredInstalledApps.push({
                name: app.manifestData.displayName,
                appId: app.name,
                appIcon: 'PaperAirplaneIcon',
              });
            }
          }
          return acc;
        },
        { filteredDefaultApps: [], filteredInstalledApps: [] },
      );
    }
    return { filteredDefaultApps: [], filteredInstalledApps: [] };
  }, [defaultApps, installedAppsReq?.data, integrationsInfoReq?.data?.getLatestRelease]);

  const handleAppClick = (appName: string) => () => {
    if (!isLoggedIn) {
      return showLoginModal();
    }
    plugins['@akashaorg/app-routing']?.routing?.navigateTo?.({
      appName: '@akashaorg/app-akasha-verse',
      getNavigationUrl: navRoutes => `${navRoutes['info']}/${appName}`,
    });
  };

  const handleInstalledAppActionClick = (appName: string) => {
    plugins['@akashaorg/app-routing']?.routing?.navigateTo?.({
      appName: appName,
      getNavigationUrl: navRoutes => navRoutes.rootRoute,
    });
  };

  const onTabChange = (index: number, prevIndex) => {
    if (index === prevIndex) return;
    setActiveTabIndex(index);
  };

  return (
    <Stack padding="pb-4">
      <Card elevation="1">
        <Stack padding="pl-4 pt-4 pb-6">
          <Text weight="bold" variant="body1">
            {t('My Apps')}
          </Text>
        </Stack>
        <Stack>
          <TabList
            labels={[t('World Apps'), t('Installed')]}
            selected={activeTabIndex}
            onChange={onTabChange}
            tabListDivider
          />
        </Stack>
        <Stack padding="pt-4 pb-4">
          {activeTabIndex === 0 && filteredDefaultApps.length === 0 && <NoAppsMessage />}
          {activeTabIndex === 1 && filteredInstalledApps.length === 0 && <NoAppsMessage />}

          {activeTabIndex === 0 && filteredDefaultApps.length > 0 && (
            <AppsList
              apps={filteredDefaultApps.slice(0, 4)}
              onAppClick={handleAppClick}
              appAction={<Icon type="CheckIcon" />}
            />
          )}

          {activeTabIndex === 1 && filteredInstalledApps.length > 0 && (
            <Stack direction="column" spacing="gap-y-4">
              <AppsList
                apps={filteredInstalledApps.slice(0, 4)}
                onAppClick={handleAppClick}
                appAction={<Button>{t('Open')}</Button>}
                onAppActionClick={handleInstalledAppActionClick}
              />
            </Stack>
          )}
        </Stack>
      </Card>
    </Stack>
  );
};

const Wrapped = (props: RootComponentProps) => (
  <I18nextProvider i18n={props.plugins['@akashaorg/app-translation']?.translation?.i18n}>
    <ICWidget {...props} />
  </I18nextProvider>
);

const reactLifecycles = singleSpaReact({
  React,
  ReactDOMClient: ReactDOM,
  rootComponent: withProviders(Wrapped),
  errorBoundary: (err, errorInfo, props: RootComponentProps) => {
    if (props.logger) {
      props.logger.error(`${JSON.stringify(errorInfo)}, ${errorInfo}`);
    }
    return (
      <ErrorLoader type="script-error" title="Error in AKASHAVerse widget" details={err.message} />
    );
  },
});

export const bootstrap = reactLifecycles.bootstrap;

export const mount = reactLifecycles.mount;

export const unmount = reactLifecycles.unmount;
