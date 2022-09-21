import * as React from 'react';
import DS from '@akashaorg/design-system';
import { useUninstallApp } from '@akashaorg/ui-awf-hooks';
import getSDK from '@akashaorg/awf-sdk';
import { APP_EVENTS } from '@akashaorg/typings/sdk';
import { RootComponentProps } from '@akashaorg/typings/ui';
import { ReleaseInfo, IntegrationInfo } from '@akashaorg/typings/sdk';
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
  installableApps: ReleaseInfo[];
  installedAppsInfo?: IntegrationInfo[];
  isFetching?: boolean;
  reqError?: Error;
  isUserLoggedIn?: boolean;
}

const ExplorePage: React.FC<IExplorePage> = props => {
  const { installableApps, isFetching, reqError, installedAppsInfo, isUserLoggedIn } = props;
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

  const handleAppClick = (app: ReleaseInfo) => {
    props.plugins['@akashaorg/app-routing']?.routing?.navigateTo?.({
      appName: '@akashaorg/app-integration-center',
      getNavigationUrl: routes => `${routes[INFO]}/${app.integrationID}`,
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
      <Box gap="small" margin="medium" flex={{ shrink: 0 }}>
        {reqError && (
          <ErrorLoader
            type="script-error"
            title={t('There was an error loading the integrations')}
            details={t('We cannot show this page right now')}
            devDetails={reqError}
          />
        )}
        {isFetching && (
          <Box>
            <Spinner />
          </Box>
        )}
        {!isFetching && (
          <>
            {(installableApps?.length === 0 || !isUserLoggedIn) && (
              <InfoCard
                icon="appCenter"
                title={t('Welcome to the Integration Centre!')}
                suggestion={t(
                  'The Integration Center is the trusted go-to place to explore, discover and experience apps, widgets, and plug-ins straight from the Ethereum World interface. These applications and integrations are thoroughly reviewed by the AKASHA Foundation so you can experience a palette of fine specimens of dsocial networking in your World.',
                )}
                noBorder={true}
              />
            )}
            {installableApps?.length !== 0 &&
              installableApps?.map((app, index) => (
                <Box key={index} direction="row" justify="between" align="center" gap="xsmall">
                  <SubtitleTextIcon
                    label={app.manifestData?.displayName}
                    subtitle={app.name}
                    gap="xxsmall"
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
                    active={installedAppsInfo?.some(installedApp => installedApp.name === app.name)}
                    activeLabel={t('Installed')}
                    inactiveLabel={t('Install')}
                    activeHoverLabel={t('Uninstall')}
                    onClickActive={() => handleAppUninstall(app.name)}
                    onClickInactive={() => handleAppInstall(app.name)}
                  />
                </Box>
              ))}
          </>
        )}
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
