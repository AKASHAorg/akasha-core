import * as React from 'react';
import { useParams } from 'react-router-dom';
import DS from '@akashaproject/design-system';

import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import {
  useGetAllInstalledApps,
  useGetAllIntegrationReleaseIds,
  useGetIntegrationInfo,
  useGetIntegrationsReleaseInfo,
  useGetLogin,
} from '@akashaproject/ui-awf-hooks';
import { useTranslation } from 'react-i18next';

const { Box, ICDetailCard, ErrorLoader } = DS;

const InfoPage: React.FC<RootComponentProps> = () => {
  const { integrationId } = useParams<{ integrationId: string }>();

  const { t } = useTranslation();

  const loginQuery = useGetLogin();

  const isLoggedIn = React.useMemo(() => {
    return !!loginQuery.data.pubKey;
  }, [loginQuery.data]);

  const integrationInfoReq = useGetIntegrationInfo(integrationId);

  const integrationInfo = integrationInfoReq.data;

  const installedAppsReq = useGetAllInstalledApps(isLoggedIn);

  const isInstalled = React.useMemo(() => {
    if (installedAppsReq.data && integrationInfo) {
      const installedAppsIds = installedAppsReq.data.map(app => app.id);
      return installedAppsIds.includes(integrationInfo.id);
    }
  }, [installedAppsReq.data, integrationInfo]);

  const releaseIds = useGetAllIntegrationReleaseIds(integrationInfo?.name)?.data?.releaseIds;

  const releasesInfo = useGetIntegrationsReleaseInfo(releaseIds)?.data;

  const metadata = {
    avatar: '',
    coverImage: 'blue',
    description: 'Testing description',
    authors: ['@akasha'],
    tags: ['test'],
    license: 'wtfpl',
  };
  return (
    <Box margin="medium">
      {integrationInfoReq.error && (
        <ErrorLoader
          type="script-error"
          title={t('There was an error loading the integration info')}
          details={t('We cannot show this integration right now')}
          devDetails={integrationInfoReq.error}
        />
      )}
      {integrationInfoReq.isSuccess && integrationInfo && (
        <ICDetailCard
          integrationName={integrationInfo.name}
          shareLabel={t('Share')}
          id={integrationInfo.id}
          avatar={metadata.avatar}
          coverImage={metadata.coverImage}
          installLabel={t('Install')}
          uninstallLabel={t('Uninstall')}
          installedLabel={t('Installed')}
          descriptionLabel={t('Description')}
          descriptionContent={metadata.description}
          showMoreLabel={t('Show More')}
          linksLabel={t('Links')}
          releasesLabel={t('Releases')}
          releaseTypeLabel={t('Release Type')}
          releaseIdLabel={t('Release Id')}
          releases={releasesInfo}
          versionHistoryLabel={t('Version History')}
          authorsLabel={t('Authors & Contributors')}
          authors={metadata.authors}
          tags={metadata.tags}
          licenseLabel={t('License')}
          license={metadata.license}
          isInstalled={isInstalled}
          onClickCTA={() => null}
          onClickShare={() => null}
          onClickInstall={() => null}
          onClickUninstall={() => null}
        />
      )}
    </Box>
  );
};

export default InfoPage;
