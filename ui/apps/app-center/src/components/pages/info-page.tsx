import * as React from 'react';
import { useParams } from 'react-router-dom';
import DS from '@akashaorg/design-system';

import { RootComponentProps } from '@akashaorg/typings/ui';
import {
  useGetAllInstalledApps,
  useGetAllIntegrationReleaseIds,
  useGetIntegrationInfo,
  useGetIntegrationsReleaseInfo,
  useGetIntegrationReleaseInfo,
  useGetLogin,
  useGetProfileByEthAddress,
  useCurrentNetwork,
  useAppDescription,
} from '@akashaorg/ui-awf-hooks';
import { useTranslation } from 'react-i18next';

const { Box, ICDetailCard, ErrorLoader } = DS;

const InfoPage: React.FC<RootComponentProps> = props => {
  const { integrationId } = useParams<{ integrationId: string }>();

  const navigateTo = props.plugins['@akashaorg/app-routing']?.routing?.navigateTo;

  const { t } = useTranslation('app-integration-center');

  const loginQueryReq = useGetLogin();

  const isLoggedIn = React.useMemo(() => {
    return !!loginQueryReq.data.pubKey;
  }, [loginQueryReq.data]);

  const network = useCurrentNetwork(isLoggedIn).data;

  const integrationInfoReq = useGetIntegrationInfo(integrationId);

  const integrationInfo = integrationInfoReq.data;

  const latestReleaseId = integrationInfo?.latestReleaseId;

  const latestReleaseInfoReq = useGetIntegrationReleaseInfo(latestReleaseId);

  /* @Todo: fix my type */
  const latestReleaseInfo: any = latestReleaseInfoReq.data;

  const profileDataReq = useGetProfileByEthAddress(integrationInfo?.author);
  /** Todo: fix my type **/
  const authorProfileData = profileDataReq.data as any;

  const descriptionLink = latestReleaseInfo?.links?.detailedDescription;

  const detailedDescriptionReq = useAppDescription(descriptionLink);
  const detailedDescription = detailedDescriptionReq.data;

  const handleAuthorEthAddressClick = (ethAddress: string) => {
    if (network) {
      window.open(
        `https://${network}.etherscan.io/address/${ethAddress}`,
        '_blank',
        'noreferrer noopener',
      );
    } else {
      window.open(`https://etherscan.io/address/${ethAddress}`, '_blank', 'noreferrer noopener');
    }
  };

  const handleAuthorClick = (author: { pubKey: string }) => {
    navigateTo?.({
      appName: '@akashaorg/app-profile',
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
      {!latestReleaseInfoReq.error && (
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
          isFetching={latestReleaseInfoReq.isFetching}
          description={detailedDescription}
        />
      )}
    </Box>
  );
};

export default InfoPage;
