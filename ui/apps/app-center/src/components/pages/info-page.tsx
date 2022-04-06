import * as React from 'react';
import { useParams } from 'react-router-dom';
import DS from '@akashaproject/design-system';

import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import {
  useGetAllInstalledApps,
  useGetAllIntegrationReleaseIds,
  useGetIntegrationInfo,
  useGetIntegrationsReleaseInfo,
  useGetIntegrationReleaseInfo,
  useGetLogin,
  useGetProfileByEthAddress,
} from '@akashaproject/ui-awf-hooks';
import { useTranslation } from 'react-i18next';

const { Box, ICDetailCard, ErrorLoader, Spinner, BasicCardBox } = DS;

const InfoPage: React.FC<RootComponentProps> = props => {
  const { integrationId } = useParams<{ integrationId: string }>();

  const navigateTo = props.plugins.routing?.navigateTo;

  const { t } = useTranslation('app-integration-center');

  const loginQueryReq = useGetLogin();

  const isLoggedIn = React.useMemo(() => {
    return !!loginQueryReq.data.pubKey;
  }, [loginQueryReq.data]);

  const integrationInfoReq = useGetIntegrationInfo(integrationId);

  const integrationInfo = integrationInfoReq.data;

  const latestReleaseId = integrationInfo?.latestReleaseId;

  const latestReleaseInfoReq = useGetIntegrationReleaseInfo(latestReleaseId);

  const latestReleaseInfo = latestReleaseInfoReq.data;

  const profileDataReq = useGetProfileByEthAddress(integrationInfo?.author);
  const authorProfileData = profileDataReq.data;

  const handleAuthorEthAddressClick = (ethAddress: string) => {
    window.open(`https://etherscan.io/address/${ethAddress}`, '_blank', 'noreferrer noopener');
  };

  const handleAuthorClick = (author: { pubKey: string }) => {
    navigateTo?.({
      appName: '@akashaproject/app-profile',
      getNavigationUrl: routes => `${routes.rootRoute}/${author.pubKey}`,
    });
  };

  const installedAppsReq = useGetAllInstalledApps(isLoggedIn);

  const isInstalled = React.useMemo(() => {
    if (installedAppsReq.data) {
      const installedAppsIds = installedAppsReq.data.map(app => app.id);
      return installedAppsIds.includes(integrationId);
    }
  }, [installedAppsReq.data, integrationId]);

  const releaseIdsReq = useGetAllIntegrationReleaseIds(integrationInfo?.name);
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
          shareLabel={t('Share')}
          id={integrationId}
          integrationName={integrationInfo?.name}
          authorEthAddress={integrationInfo?.author}
          authorProfile={authorProfileData}
          repoLinkLabel={t('Public Repository')}
          docsLinkLabel={t('Documentation')}
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
          ethereumAddressLabel={t('Ethereum Address')}
          authorLabel={t('Author')}
          licenseLabel={t('License')}
          isInstalled={isInstalled}
          onClickCTA={() => null}
          onClickShare={() => null}
          onClickInstall={() => null}
          onClickUninstall={() => null}
          handleAuthorClick={handleAuthorClick}
          handleAuthorEthAddressClick={handleAuthorEthAddressClick}
        />
      )}
    </Box>
  );
};

export default InfoPage;
