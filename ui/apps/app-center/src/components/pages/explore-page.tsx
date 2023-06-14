import React from 'react';
import getSDK from '@akashaorg/awf-sdk';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import InfoCard from '@akashaorg/design-system-core/lib/components/InfoCard';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import AppList from '@akashaorg/design-system-components/lib/components/AppList';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { useTranslation } from 'react-i18next';
import { APP_EVENTS } from '@akashaorg/typings/sdk';
import { useUninstallApp } from '@akashaorg/ui-awf-hooks';
import { RootComponentProps } from '@akashaorg/typings/ui';
import { IntegrationReleaseInfoFragmentFragment } from '@akashaorg/typings/sdk/graphql-operation-types';
import { IntegrationReleaseInfo } from '@akashaorg/typings/sdk/graphql-types';
import { INFO } from '../../routes';

export interface IExplorePage extends RootComponentProps {
  installableApps: IntegrationReleaseInfoFragmentFragment[];
  installedAppsInfo?: IntegrationReleaseInfo[];
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

  const handleAppClick = (app: IntegrationReleaseInfo) => {
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

  /*@TODO: replace with the relevant hook once it's ready */
  const dummyApps = [
    {
      name: 'Supercarts',
      description:
        'Play with your friends in AKASHA World and enjoy a couple of puzzle games or drawing games or any kind of game!',
      action: <Button label="Install" variant="primary" />,
    },
    {
      name: 'Articles App',
      description:
        'Read articles written by AKASHA community you can also write your own articles or collaborate with other authors!',
      action: <Button label="Install" variant="primary" />,
    },
  ];

  return (
    <>
      <Stack direction="column" testId="akasha-verse">
        {!isFetching && reqError && (
          <ErrorLoader
            type="script-error"
            title={t('There was an error loading the integrations')}
            details={t('We cannot show this page right now')}
            devDetails={reqError.message}
          />
        )}
        {!isFetching && !reqError && (
          <>
            {isUserLoggedIn && (
              <InfoCard
                titleLabel={t('Welcome to the Integration Centre!')}
                bodyLabel={t(
                  'Here you will be able to find your installed Apps, you will be able to explore new apps & widgets to add to Ethereum World.',
                )}
                titleVariant="h4"
                bodyVariant="body1"
                assetName="akasha-verse"
              />
            )}
            {!isUserLoggedIn && (
              <Stack direction="column" spacing="gap-y-4">
                <Text variant="h6">{t('Latest Apps')}</Text>
                <AppList apps={dummyApps} />
                <Text variant="h6">{t('Most Installed Apps')}</Text>
                <AppList apps={dummyApps} />
                <InfoCard titleLabel={t('Check out more cool apps from the Apps section')} />
              </Stack>
            )}
            {/*@TODO: Remove the lines below once the page is connected with relevant hooks */}
            {/* {installableApps?.length !== 0 &&
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
              ))} */}
          </>
        )}
      </Stack>
    </>
  );
};

export default ExplorePage;
