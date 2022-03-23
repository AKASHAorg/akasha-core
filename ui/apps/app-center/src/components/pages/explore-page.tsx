import * as React from 'react';
import DS from '@akashaproject/design-system';
import {
  useGetIntegrationsInfo,
  useGetLogin,
  useGetAllInstalledApps,
  useGetAllIntegrationsIds,
  useUninstallApp,
} from '@akashaproject/ui-awf-hooks';
import getSDK from '@akashaproject/awf-sdk';
import { APP_EVENTS } from '@akashaproject/sdk-typings/lib/interfaces/events';
import { IntegrationInfo, RootComponentProps } from '@akashaproject/ui-awf-typings';
import { useTranslation } from 'react-i18next';
import { INFO } from '../../routes';

const { Box, SubtitleTextIcon, DuplexButton, Icon, ErrorLoader, Spinner, NotificationPill } = DS;

const ExplorePage: React.FC<RootComponentProps> = props => {
  const { worldConfig } = props;
  const sdk = getSDK();
  const { t } = useTranslation('app-integration-center');

  const [uninstallingApps, setUninstallingApps] = React.useState([]);
  const [showNotifPill, setShowNotifPill] = React.useState('');

  React.useEffect(() => {
    const subSDK = sdk.api.globalChannel.subscribe({
      next: (eventData: { data: { name: string }; event: APP_EVENTS }) => {
        if (eventData.event === APP_EVENTS.REMOVED) {
          setUninstallingApps(prev =>
            prev.filter(integrationName => integrationName !== eventData.data.name),
          );
          setShowNotifPill(eventData.data.name);
        }
      },
    });

    return () => {
      subSDK.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    setUninstallingApps(prev => [...prev, integrationName]);
    uninstallAppReq.mutate(integrationName);
  };

  return (
    <>
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
          <Box key={index} direction="row" justify="between" align="center" gap="xsmall">
            <SubtitleTextIcon
              label={app.name}
              subtitle={app.id}
              iconType="integrationAppLarge"
              plainIcon={true}
              onClick={() => handleAppClick(app)}
              backgroundColor={true}
            />
            <DuplexButton
              loading={!!uninstallingApps.includes(app.name)}
              icon={<Icon type="arrowDown" />}
              activeIcon={<Icon type="checkSimple" accentColor={true} />}
              activeHoverIcon={<Icon type="close" />}
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
      {!!showNotifPill && (
        <NotificationPill
          icon={<Icon type="check" />}
          infoLabel={`${showNotifPill} ${t('has been uninstalled')}`}
          handleDismiss={() => {
            setShowNotifPill('');
          }}
        />
      )}
    </>
  );
};

export default ExplorePage;
