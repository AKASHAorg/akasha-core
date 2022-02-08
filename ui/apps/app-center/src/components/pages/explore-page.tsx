import * as React from 'react';
import DS from '@akashaproject/design-system';
import {
  useGetIntegrationsInfo,
  useGetLogin,
  useGetAllInstalledApps,
} from '@akashaproject/ui-awf-hooks';
import { IntegrationInfo, RootComponentProps } from '@akashaproject/ui-awf-typings';
import { useTranslation } from 'react-i18next';
import routes, { INFO } from '../../routes';

const { Box, SubtitleTextIcon, DuplexButton, Icon } = DS;

const ExplorePage: React.FC<RootComponentProps> = props => {
  const { worldConfig } = props;

  const { t } = useTranslation();

  const loginQuery = useGetLogin();

  const isLoggedIn = React.useMemo(() => {
    return !!loginQuery.data.pubKey;
  }, [loginQuery.data]);

  const defaultAppsNamesNormalized = worldConfig?.defaultApps.map(app => {
    if (typeof app === 'string') {
      return {
        name: app,
      };
    }
    return app;
  });

  const integrationsInfoReq = useGetIntegrationsInfo(defaultAppsNamesNormalized);

  const installedAppsReq = useGetAllInstalledApps(isLoggedIn);

  const handleAppClick = (app: IntegrationInfo) => {
    props.navigateTo(`${routes[INFO]}/${app.id}`);
  };

  const handleAppInstall = () => {
    return;
  };

  const handleAppUninstall = () => {
    return;
  };

  return (
    <Box overflow={'auto'} gap="small">
      {integrationsInfoReq.data?.getIntegrationInfo?.map((app, index) => (
        <Box key={index} direction="row" justify="between">
          <SubtitleTextIcon
            label={app.name}
            subtitle={app.id}
            iconType="integrationAppLarge"
            onClick={() => handleAppClick(app)}
          />
          <DuplexButton
            icon={<Icon type="arrowDown" />}
            active={installedAppsReq.data?.includes(app.id)}
            activeLabel={t('Installed')}
            inactiveLabel={t('Install')}
            activeHoverLabel={t('Uninstall')}
            onClickActive={handleAppUninstall}
            onClickInactive={handleAppInstall}
          />
        </Box>
      ))}
    </Box>
  );
};

export default ExplorePage;
