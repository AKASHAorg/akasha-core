import * as React from 'react';
import DS from '@akashaproject/design-system';
import { useGetIntegrationsInfo } from '@akashaproject/ui-awf-hooks';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import { useTranslation } from 'react-i18next';

const { Box, SubtitleTextIcon, DuplexButton, Icon } = DS;

const ExplorePage: React.FC<RootComponentProps> = props => {
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
  const integrationsInfoReq = useGetIntegrationsInfo(defaultAppsNamesNormalized);
  return (
    <Box overflow={'auto'} gap="small">
      {integrationsInfoReq.data?.getIntegrationInfo?.map((app, index) => (
        <Box key={index} direction="row" justify="between">
          <SubtitleTextIcon label={app.name} subtitle={app.id} iconType="appIC" />
          <DuplexButton
            icon={<Icon type="arrowDown" />}
            active={true}
            activeLabel={t('Installed')}
            inactiveLabel={t('Install')}
            activeHoverLabel={t('Uninstall')}
          />
        </Box>
      ))}
    </Box>
  );
};

export default ExplorePage;
