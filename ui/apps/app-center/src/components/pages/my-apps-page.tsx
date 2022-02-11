import * as React from 'react';
import { useGetAllInstalledApps, useGetIntegrationsInfo } from '@akashaproject/ui-awf-hooks';
import DS from '@akashaproject/design-system';
import { useTranslation } from 'react-i18next';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';

const { Box, SubtitleTextIcon, Icon, Text } = DS;

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

  const defaultIntegrationsInfoReq = useGetIntegrationsInfo(defaultAppsNamesNormalized);

  const installedAppsReq = useGetAllInstalledApps();
  const installedIntegrationsInfoReq = useGetIntegrationsInfo(installedAppsReq.data);

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
          {defaultIntegrationsInfoReq.data?.getIntegrationInfo?.map((app, index) => (
            <Box
              key={index}
              direction="row"
              align="center"
              justify="between"
              border={
                index !== defaultIntegrationsInfoReq.data?.getIntegrationInfo.length - 1
                  ? { side: 'bottom', size: '1px', color: 'border' }
                  : null
              }
              pad={{ bottom: 'small', right: 'medium' }}
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
          {installedIntegrationsInfoReq.data?.getIntegrationInfo?.map((app, index) => (
            <Box
              key={index}
              direction="row"
              align="center"
              justify="between"
              border={
                index !== defaultIntegrationsInfoReq.data?.getIntegrationInfo.length - 1
                  ? { side: 'bottom', size: '1px', color: 'border' }
                  : null
              }
              pad={{ bottom: 'small', right: 'medium' }}
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
        </Box>
      </>
    </Box>
  );
};

export default MyAppsPage;
