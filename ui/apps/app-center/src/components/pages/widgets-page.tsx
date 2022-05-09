import * as React from 'react';
import DS from '@akashaorg/design-system';
import { useTranslation } from 'react-i18next';
import { IntegrationInfo, ReleaseInfo, RootComponentProps } from '@akashaorg/ui-awf-typings';
import { INFO } from '../../routes';

const { Box, SubtitleTextIcon, Icon, Text, Spinner } = DS;

export interface IWidgetsPage extends RootComponentProps {
  latestReleasesInfo?: ReleaseInfo[];
  installedAppsInfo?: IntegrationInfo[];
  defaultIntegrations?: string[];
  isFetching?: boolean;
}

const WidgetsPage: React.FC<IWidgetsPage> = props => {
  const { worldConfig, latestReleasesInfo, isFetching } = props;

  const { t } = useTranslation('app-integration-center');

  const defaultWidgetNamesNormalized = React.useMemo(() => {
    return worldConfig?.defaultWidgets.map(app => {
      if (typeof app === 'string') {
        return {
          name: app,
        };
      }
      return app;
    });
  }, [worldConfig.defaultWidgets]);

  // select default widgets from list of installed integrations
  const filteredDefaultWidgets = latestReleasesInfo?.filter(app => {
    if (defaultWidgetNamesNormalized?.some(defaultWidget => defaultWidget.name === app.name)) {
      return app;
    }
  });

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
            {t('World Widgets')}
          </Text>
          <Text>{t('These are the default widgets that come in the world')}</Text>
        </Box>
        <Box gap="small">
          {filteredDefaultWidgets?.map((app, index) => (
            <Box
              key={index}
              direction="row"
              align="center"
              justify="between"
              border={
                index !== filteredDefaultWidgets.length - 1
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
                iconType="integrationWidgetLarge"
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
    </Box>
  );
};

export default WidgetsPage;
