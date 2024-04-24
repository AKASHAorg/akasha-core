import React, { useEffect, useState } from 'react';
import getSDK from '@akashaorg/awf-sdk';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import InfoCard from '@akashaorg/design-system-core/lib/components/InfoCard';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import AppList from '@akashaorg/design-system-components/lib/components/AppList';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { useTranslation } from 'react-i18next';
import { APP_EVENTS } from '@akashaorg/typings/lib/sdk';

import { useGetLogin, useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import { useGetAppsQuery } from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import { hiddenIntegrations } from '../../hidden-integrations';

const ExplorePage: React.FC = () => {
  const { worldConfig } = useRootComponentProps();

  const { data } = useGetLogin();
  const authenticatedDID = React.useMemo(() => {
    return data?.id;
  }, [data]);

  const [, setUninstallingApps] = useState([]);
  const [, setShowNotifPill] = useState('');

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
    skip: !authenticatedDID,
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

  useEffect(() => {
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

  const sdk = getSDK();
  const { t } = useTranslation('app-extensions');

  // const uninstallAppReq = null;

  // const handleAppClick = (app: IntegrationReleaseInfo) => {
  //   getRoutingPlugin().navigateTo?.({
  //     appName: '@akashaorg/app-extensions',
  //     getNavigationUrl: routes => `${routes[INFO]}/${app.integrationID}`,
  //   });
  // };

  // const handleAppInstall = (integrationName: string) => {
  //   navigateToModal({
  //     name: 'install-modal',
  //     integrationName: integrationName,
  //   });
  // };

  // const handleAppUninstall = (integrationName: string) => {
  //   setUninstallingApps(prev => [...prev, integrationName]);
  //   uninstallAppReq.mutate(integrationName);
  // };

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
      <Stack dataTestId="akasha-verse">
        {!loading && error && (
          <ErrorLoader
            type="script-error"
            title={t('There was an error loading the integrations')}
            details={t('We cannot show this page right now')}
            devDetails={error.message}
          />
        )}
        {!loading && !error && (
          <>
            {authenticatedDID && (
              <InfoCard
                titleLabel={t('Welcome to the Integration Centre!')}
                bodyLabel={t(
                  'Here you will be able to find your installed Apps, you will be able to explore new apps & widgets to add to AKASHA World.',
                )}
                titleVariant="h4"
                bodyVariant="body1"
                assetName="akasha-verse"
              />
            )}
            {!authenticatedDID && (
              <Stack spacing="gap-y-4">
                <Text variant="h6">{t('Latest Apps')}</Text>
                <AppList
                  apps={dummyApps}
                  onAppSelected={() => {
                    /*TODO: get app id from new hooks when they are ready and navigate to info page*/
                  }}
                />
                <Text variant="h6">{t('Most Installed Apps')}</Text>
                <AppList
                  apps={dummyApps}
                  onAppSelected={() => {
                    /*TODO: get app id from new hooks when they are ready and navigate to info page*/
                  }}
                />
                <InfoCard titleLabel={t('Check out more cool apps from the Apps section')} />
              </Stack>
            )}
            {/*@TODO: Remove the lines below once the page is connected with relevant hooks */}
            {/* {installableApps?.length !== 0 &&
              installableApps?.map((app, index) => (
                <Stack key={index} direction="row" justify="between" align="center" gap="xsmall">
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
                    icon={<Icon icon={<ArrowDown />} />}
                    activeIcon={<Icon icon={<CheckSimple />} accentColor={true} />}
                    activeHoverIcon={<Icon icon={<CloseIcon />} />}
                    active={installedAppsInfo?.some(installedApp => installedApp.name === app.name)}
                    activeLabel={t('Installed')}
                    inactiveLabel={t('Install')}
                    activeHoverLabel={t('Uninstall')}
                    onClickActive={() => handleAppUninstall(app.name)}
                    onClickInactive={() => handleAppInstall(app.name)}
                  />
                </Stack>
              ))} */}
          </>
        )}
      </Stack>
    </>
  );
};

export default ExplorePage;
