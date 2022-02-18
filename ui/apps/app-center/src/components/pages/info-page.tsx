import * as React from 'react';
import { useParams } from 'react-router-dom';
import DS from '@akashaproject/design-system';

import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import {
  useGetAllInstalledApps,
  useGetAllIntegrationReleaseIds,
  useGetIntegrationsReleaseInfo,
  useGetLatestReleaseInfo,
  useGetLogin,
} from '@akashaproject/ui-awf-hooks';
import { useTranslation } from 'react-i18next';

const { Box, ICDetailCard, ErrorLoader, Spinner, BasicCardBox } = DS;

const InfoPage: React.FC<RootComponentProps> = () => {
  const { integrationId } = useParams<{ integrationId: string }>();

  const { t } = useTranslation();

  const loginQueryReq = useGetLogin();

  const isLoggedIn = React.useMemo(() => {
    return !!loginQueryReq.data.pubKey;
  }, [loginQueryReq.data]);

  const latestReleaseInfoReq = useGetLatestReleaseInfo([{ id: integrationId }]);

  const latestReleaseInfo = latestReleaseInfoReq.data?.getLatestRelease[0];

  const installedAppsReq = useGetAllInstalledApps(isLoggedIn);

  const isInstalled = React.useMemo(() => {
    if (installedAppsReq.data) {
      const installedAppsIds = installedAppsReq.data.map(app => app.id);
      return installedAppsIds.includes(integrationId);
    }
  }, [installedAppsReq.data, integrationId]);

  const releaseIdsReq = useGetAllIntegrationReleaseIds(latestReleaseInfo?.name);
  const releaseIds = releaseIdsReq.data?.releaseIds;

  const releasesInfoReq = useGetIntegrationsReleaseInfo(releaseIds);
  const releasesInfo = releasesInfoReq?.data;

  return (
    <Box>
      {latestReleaseInfoReq.error && (
        <ErrorLoader
          type="script-error"
          title={t('There was an error loading the integration info')}
          details={t('We cannot show this integration right now')}
          devDetails={latestReleaseInfoReq.error}
        />
      )}
      {latestReleaseInfoReq.isFetching && (
        <BasicCardBox>
          <Spinner />
        </BasicCardBox>
      )}
      {latestReleaseInfoReq.isSuccess && latestReleaseInfo && (
        <ICDetailCard
          integrationName={latestReleaseInfo.name}
          shareLabel={t('Share')}
          id={integrationId}
          installLabel={t('Install')}
          uninstallLabel={t('Uninstall')}
          installedLabel={t('Installed')}
          descriptionLabel={t('Description')}
          showMoreLabel={t('Show More')}
          linksLabel={t('Links')}
          releasesLabel={t('Releases')}
          latestReleaseLabel={t('Latest Release')}
          noPreviousReleasesLabel={t('No previous releases')}
          releaseVersionLabel={t('Version')}
          releaseIdLabel={t('Release Id')}
          releases={releasesInfo}
          latestRelease={latestReleaseInfo}
          versionHistoryLabel={t('Version History')}
          authorLabel={t('Author')}
          licenseLabel={t('License')}
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
