import * as React from 'react';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import AppInfo from '@akashaorg/design-system-components/lib/components/AppInfo';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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

const InfoPage: React.FC<RootComponentProps> = props => {
  const { integrationId } = useParams<{ integrationId: string }>();

  const navigateTo = props.plugins['@akashaorg/app-routing']?.routing?.navigateTo;

  const { t } = useTranslation('app-akasha-verse');
  // @TODO replace with new hooks
  const loginQueryReq = useGetLogin();

  const isLoggedIn = React.useMemo(() => {
    return !!loginQueryReq.data?.id;
  }, [loginQueryReq.data]);

  const network = useCurrentNetwork(isLoggedIn).data;

  const integrationInfoReq = useGetIntegrationInfo(integrationId);

  const integrationInfo = integrationInfoReq.data;

  const latestReleaseId = integrationInfo?.latestReleaseId;

  const latestReleaseInfoReq = useGetIntegrationReleaseInfo(latestReleaseId);

  const latestReleaseInfo = latestReleaseInfoReq.data;

  const profileDataReq = useGetProfileByEthAddress(integrationInfo?.author);
  const authorProfileData = null;

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
          devDetails={latestReleaseInfoReq.error.message}
        />
      )}
      {!latestReleaseInfoReq.error && (
        <AppInfo
          integrationName={integrationInfo?.name}
          packageName={''}
          developers={[
            {
              profileId: '' /*TODO: connect new hooks when they are ready*/,
              avatar: null /*TODO: connect new hooks when they are ready*/,
              name: latestReleaseInfo.author,
              userName: '' /*TODO: connect new hooks when they are ready*/,
            },
          ]}
          descriptionTitle={t('Description')}
          descriptionBody={detailedDescription}
          developersTitle={t('Developers')}
          latestReleaseTitle={t('Latest Release')}
          version={t('Version') + ` ${latestReleaseInfo.version}`}
          versionInfo={t('Latest release')}
          versionDate={t('December 2022')}
          versionDescription={latestReleaseInfo.manifestData.description}
          linksAndDocumentationTitle={t('Links & Documentation')}
          licenseTitle={t('License')}
          license={t('AGPL-3.0')}
          share={{ label: 'Share', icon: 'ShareIcon' }}
          report={{
            label: 'Report',
            icon: 'FlagIcon',
            color: { light: 'errorLight', dark: 'errorDark' },
          }}
          onInstall={() => {
            /*TODO: connect new hooks when they are ready*/
          }}
          onUninstall={() => {
            /*TODO: connect new hooks when they are ready*/
          }}
          onSelectDeveloper={() => {
            /*TODO: connect new hooks when they are ready*/
          }}
          status={isInstalled ? 'installed' : 'not-installed'}
        />
      )}
    </Box>
  );
};

export default InfoPage;
