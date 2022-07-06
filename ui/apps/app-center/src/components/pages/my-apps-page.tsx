import * as React from 'react';

import DS from '@akashaorg/design-system';
import { useTranslation } from 'react-i18next';
import { IntegrationInfo, ReleaseInfo, RootComponentProps } from '@akashaorg/ui-awf-typings';
import { INFO } from '../../routes';

const { Box, SubtitleTextIcon, Icon, Text, InfoCard, Spinner } = DS;

export interface IMyAppsPage extends RootComponentProps {
  latestReleasesInfo?: ReleaseInfo[];
  installedAppsInfo?: IntegrationInfo[];
  defaultIntegrations?: string[];
  isFetching?: boolean;
}

const MyAppsPage: React.FC<IMyAppsPage> = props => {
  const { worldConfig, latestReleasesInfo, installedAppsInfo, defaultIntegrations, isFetching } =
    props;

  const { t } = useTranslation('app-integration-center');

  const defaultApps = [].concat(worldConfig.defaultApps, [worldConfig.homepageApp]);

  const defaultAppsNamesNormalized = React.useMemo(() => {
    return defaultApps.map(app => {
      if (typeof app === 'string') {
        return {
          name: app,
        };
      }
      return app;
    });
  }, [defaultApps]);

  // select default apps from list of installed apps
  const filteredDefaultApps = latestReleasesInfo?.filter(app => {
    if (defaultAppsNamesNormalized?.some(defaultApp => defaultApp.name === app.name)) {
      return app;
    }
  });
  // select user installed apps from list of installed apps
  const filteredInstalledApps = latestReleasesInfo
    ?.filter(app => {
      if (!installedAppsInfo?.length) {
        return null;
      }
      if (defaultIntegrations?.some(defaultApp => defaultApp !== app.name)) {
        return app;
      }
    })
    .filter(Boolean);

  const handleAppClick = (app: ReleaseInfo) => {
    props.plugins.routing?.navigateTo?.({
      appName: '@akashaorg/app-integration-center',
      getNavigationUrl: routes => `${routes[INFO]}/${app.integrationID}`,
    });
  };

  return (
    <Box gap="medium" margin="medium" flex={{ shrink: 0 }}>
      <>
        <Box gap="small" pad={{ bottom: 'medium' }}>
          <Text size="large" color="secondaryText">
            {t('World Apps')}
          </Text>
          <Text>
            {t(
              'The World needs love. These are a handful of essential apps to get this World spinning',
            )}
          </Text>
        </Box>
        <Box gap="small">
          {filteredDefaultApps?.map((app, index) => (
            <Box
              key={index}
              direction="row"
              align="center"
              justify="between"
              border={
                index !== filteredDefaultApps.length - 1
                  ? { side: 'bottom', size: '1px', color: 'border' }
                  : null
              }
              pad={{ bottom: 'small', right: 'medium' }}
              onClick={() => handleAppClick(app)}
            >
              <SubtitleTextIcon
                label={app.manifestData.displayName}
                subtitle={app.name}
                gap="xxsmall"
                iconType="integrationAppLarge"
                plainIcon={true}
                backgroundColor={true}
              />
              <Icon type="checkSimple" accentColor={true} size="md" />
            </Box>
          ))}
          {isFetching && (
            <Box>
              <Spinner />
            </Box>
          )}
        </Box>
      </>
      <>
        <Box gap="small" pad={{ bottom: 'medium' }}>
          <Text size="large" color="secondaryText">
            {t('Installed Apps')}
          </Text>
          <Text>{t('These are the apps you installed in your World')}</Text>
        </Box>
        <Box gap="small">
          {filteredInstalledApps?.length !== 0 &&
            filteredInstalledApps?.map((app, index) => (
              <Box
                key={index}
                direction="row"
                align="center"
                justify="between"
                border={
                  index !== filteredInstalledApps?.length - 1
                    ? { side: 'bottom', size: '1px', color: 'border' }
                    : null
                }
                pad={{ bottom: 'small', right: 'medium' }}
                onClick={() => handleAppClick(app)}
              >
                <SubtitleTextIcon
                  label={app.manifestData.displayName}
                  subtitle={app.name}
                  gap="xxsmall"
                  iconType="integrationAppLarge"
                  plainIcon={true}
                  backgroundColor={true}
                />
                <Icon type="moreDark" plain={true} />
              </Box>
            ))}
          {filteredInstalledApps?.length === 0 && (
            <InfoCard
              icon="appCenter"
              title={t('You have no installed apps')}
              suggestion={t('Try some out for extra functionality!')}
              noBorder={true}
            />
          )}
          {isFetching && (
            <Box>
              <Spinner />
            </Box>
          )}
        </Box>
      </>
    </Box>
  );
};

export default MyAppsPage;
