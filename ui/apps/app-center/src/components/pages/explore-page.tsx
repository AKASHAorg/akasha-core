import * as React from 'react';
import DS from '@akashaproject/design-system';
import { useUninstallApp } from '@akashaproject/ui-awf-hooks';
import getSDK from '@akashaproject/awf-sdk';
import { APP_EVENTS } from '@akashaproject/sdk-typings/lib/interfaces/events';
import { IntegrationInfo, ReleaseInfo, RootComponentProps } from '@akashaproject/ui-awf-typings';
import { useTranslation } from 'react-i18next';
import { INFO } from '../../routes';

const {
  Box,
  SubtitleTextIcon,
  DuplexButton,
  Icon,
  ErrorLoader,
  Spinner,
  NotificationPill,
  InfoCard,
} = DS;

export interface IExplorePage extends RootComponentProps {
  latestReleasesInfo?: ReleaseInfo[];
  installedAppsInfo?: IntegrationInfo[];
  defaultIntegrations?: string[];
  isFetching?: boolean;
  reqError?: Error;
  isUserLoggedIn?: boolean;
}

const ExplorePage: React.FC<IExplorePage> = props => {
  const {
    latestReleasesInfo,
    isFetching,
    defaultIntegrations,
    reqError,
    installedAppsInfo,
    isUserLoggedIn,
  } = props;
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

  const uninstallAppReq = useUninstallApp();

  const installableApps = latestReleasesInfo?.filter(releaseInfo => {
    if (defaultIntegrations?.includes(releaseInfo.name)) {
      return null;
    }
    return releaseInfo;
  });

  const handleAppClick = (app: ReleaseInfo) => {
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
        {reqError && (
          <ErrorLoader
            type="script-error"
            title={t('There was an error loading the integrations')}
            details={t('We cannot show this page right now')}
            devDetails={reqError}
          />
        )}
        {(installableApps?.length === 0 || !isUserLoggedIn) && (
          <InfoCard
            icon="appCenter"
            title={t('Welcome to the Integration Centre!')}
            suggestion={t(
              'Here you will be able to find your installed Apps, you will be able to explore new apps & widgets to add to Ethereum World.',
            )}
            noBorder={true}
          />
        )}
        {installableApps?.map((app, index) => (
          <Box key={index} direction="row" justify="between" align="center" gap="xsmall">
            <SubtitleTextIcon
              label={app.manifestData?.displayName}
              subtitle={app.name}
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
              active={installedAppsInfo?.some(installedApp => installedApp.id === app.id)}
              activeLabel={t('Installed')}
              inactiveLabel={t('Install')}
              activeHoverLabel={t('Uninstall')}
              onClickActive={() => handleAppUninstall(app.name)}
              onClickInactive={() => handleAppInstall(app.name)}
            />
          </Box>
        ))}
      </Box>
      {isFetching && (
        <Box>
          <Spinner />
        </Box>
      )}
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
