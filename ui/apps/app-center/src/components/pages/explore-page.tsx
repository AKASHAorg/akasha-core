import * as React from 'react';
import DS from '@akashaproject/design-system';
import {
  useGetIntegrationsInfo,
  useGetLogin,
  useGetAllInstalledApps,
  useGetAllIntegrationsIds,
  useUninstallApp,
} from '@akashaproject/ui-awf-hooks';
import { IntegrationInfo, RootComponentProps } from '@akashaproject/ui-awf-typings';
import { useTranslation } from 'react-i18next';
import { INFO } from '../../routes';

const { Box, SubtitleTextIcon, DuplexButton, Icon, ErrorLoader, Spinner } = DS;

const ExplorePage: React.FC<RootComponentProps> = props => {
  const { worldConfig } = props;

  const { t } = useTranslation('app-integration-center');

  const loginQuery = useGetLogin();

  const isLoggedIn = React.useMemo(() => {
    return !!loginQuery.data.pubKey;
  }, [loginQuery.data]);

  const uninstallAppReq = useUninstallApp();

  const availableIntegrationsReq = useGetAllIntegrationsIds();

  const defaultIntegrations = [].concat(
    worldConfig.defaultApps,
    worldConfig.defaultWidgets,
    [worldConfig.homepageApp],
    [worldConfig.layout],
  );

  const integrationIdsNormalized = availableIntegrationsReq?.data?.integrationIds.map(
    integrationId => {
      return { id: integrationId };
    },
  );

  const integrationsInfoReq = useGetIntegrationsInfo(integrationIdsNormalized);

  const installableApps = integrationsInfoReq.data?.getIntegrationInfo?.filter(appInfo => {
    if (defaultIntegrations?.includes(appInfo.name)) {
      return null;
    }
    return appInfo;
  });

  const installedAppsReq = useGetAllInstalledApps(isLoggedIn);

  const handleAppClick = (app: IntegrationInfo) => {
    props.plugins.routing?.navigateTo?.({
      appName: '@akashaproject/app-integration-center',
      getNavigationUrl: routes => `${routes[INFO]}/${app.id}`,
    });
  };

  const handleAppInstall = (integrationName: string) => {
    props.navigateToModal({
      name: 'install-modal',
      integrationName: integrationName,
    });
  };

  const handleAppUninstall = (integrationName: string) => {
    uninstallAppReq.mutate(integrationName);
  };

  return (
    <Box gap="small" margin="medium">
      {integrationsInfoReq.error && (
        <ErrorLoader
          type="script-error"
          title={t('There was an error loading the integrations')}
          details={t('We cannot show this page right now')}
          devDetails={integrationsInfoReq.error}
        />
      )}
      {integrationsInfoReq.isFetching && (
        <Box>
          <Spinner />
        </Box>
      )}
      {installableApps?.map((app, index) => (
        <Box key={index} direction="row" justify="between" align="center">
          <SubtitleTextIcon
            label={app.name}
            subtitle={app.id}
            iconType="integrationAppLarge"
            plainIcon={true}
            onClick={() => handleAppClick(app)}
            backgroundColor={true}
          />
          <DuplexButton
            icon={<Icon type="arrowDown" />}
            active={installedAppsReq.data?.some(installedApp => installedApp.id === app.id)}
            activeLabel={t('Installed')}
            inactiveLabel={t('Install')}
            activeHoverLabel={t('Uninstall')}
            onClickActive={() => handleAppUninstall(app.name)}
            onClickInactive={() => handleAppInstall(app.name)}
          />
        </Box>
      ))}
    </Box>
  );
};

export default ExplorePage;
