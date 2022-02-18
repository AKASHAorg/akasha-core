import * as React from 'react';
import { useGetAllInstalledApps, useGetIntegrationsInfo } from '@akashaproject/ui-awf-hooks';
import DS from '@akashaproject/design-system';
import { useTranslation } from 'react-i18next';
import { IntegrationInfo, RootComponentProps } from '@akashaproject/ui-awf-typings';
import routes, { INFO } from '../../routes';

const { Box, SubtitleTextIcon, Icon, Text, ErrorLoader, Spinner } = DS;

const MyAppsPage: React.FC<RootComponentProps> = props => {
  const { worldConfig } = props;

  const { t } = useTranslation();

  const defaultAppsNamesNormalized = worldConfig?.defaultApps.map(app => {
    if (typeof app === 'string') {
      return {
        name: app,
      };
    }
    return app;
  });

  const installedAppsReq = useGetAllInstalledApps();
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

  const handleAppClick = (app: IntegrationInfo) => {
    props.navigateTo(`${routes[INFO]}/${app.id}`);
  };

  return (
    <Box gap="medium" margin="medium" flex={{ shrink: 0 }}>
      <>
        <Box gap="small" pad={{ bottom: 'small' }}>
          <Text size="large" color="secondaryText">
            {t('World Apps')}
          </Text>
          <Text>{t('These are the default apps that come in the world')}</Text>
        </Box>
        <Box gap="small">
          {installedIntegrationsInfoReq.isFetching && (
            <Box>
              <Spinner />
            </Box>
          )}
          {filteredDefaultApps?.map((app, index) => (
            <Box
              key={index}
              direction="row"
              align="center"
              justify="between"
              border={
                index !== installedIntegrationsInfoReq.data?.getIntegrationInfo.length - 1
                  ? { side: 'bottom', size: '1px', color: 'border' }
                  : null
              }
              pad={{ bottom: 'small', right: 'medium' }}
              onClick={() => handleAppClick(app)}
            >
              <SubtitleTextIcon
                label={app.name}
                subtitle={app.id}
                iconType="integrationAppLarge"
                backgroundColor={true}
              />
              <Icon type="checkSimple" accentColor={true} size="md" />
            </Box>
          ))}
        </Box>
      </>
      <>
        <Box gap="small" pad={{ bottom: 'small' }}>
          <Text size="large" color="secondaryText">
            {t('Installed Apps')}
          </Text>
          <Text>{t('These are the apps you installed in your world')}</Text>
        </Box>
        <Box gap="small">
          {installedIntegrationsInfoReq.isFetching && (
            <Box>
              <Spinner />
            </Box>
          )}
          {filteredInstalledApps?.length !== 0 &&
            filteredInstalledApps?.map((app, index) => (
              <Box
                key={index}
                direction="row"
                align="center"
                justify="between"
                border={
                  index !== installedIntegrationsInfoReq.data?.getIntegrationInfo.length - 1
                    ? { side: 'bottom', size: '1px', color: 'border' }
                    : null
                }
                pad={{ bottom: 'small', right: 'medium' }}
                onClick={() => handleAppClick(app)}
              >
                <SubtitleTextIcon
                  label={app.name}
                  subtitle={app.id}
                  iconType="integrationAppLarge"
                  backgroundColor={true}
                />
                <Icon type="moreDark" />
              </Box>
            ))}
          {filteredInstalledApps?.length === 0 && (
            <ErrorLoader
              type="no-login"
              title={t('You have no installed apps')}
              details={t('Try some out for extra functionality!')}
            />
          )}
        </Box>
      </>
    </Box>
  );
};

export default MyAppsPage;
