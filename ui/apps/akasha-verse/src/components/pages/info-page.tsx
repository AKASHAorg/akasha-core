import * as React from 'react';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import AppInfo from '@akashaorg/design-system-components/lib/components/AppInfo';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGetLogin, getProfileImageVersionsWithMediaUrl } from '@akashaorg/ui-awf-hooks';
import { useGetAppReleaseByIdQuery } from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';

const InfoPage: React.FC<unknown> = () => {
  const { appId } = useParams<{ appId: string }>();

  // const { getRoutingPlugin } = useRootComponentProps();

  // const navigateTo = getRoutingPlugin().navigateTo;

  const { t } = useTranslation('app-akasha-verse');

  const loginQueryReq = useGetLogin();

  const isLoggedIn = React.useMemo(() => {
    return !!loginQueryReq.data?.id;
  }, [loginQueryReq.data]);

  // const network = useCurrentNetwork(isLoggedIn).data;

  const appReleaseInfoReq = useGetAppReleaseByIdQuery(
    { id: appId },
    {
      select: response => response.node,
      enabled: !!isLoggedIn,
    },
  );

  const appReleaseInfo = 'application' in appReleaseInfoReq.data && appReleaseInfoReq.data;

  // const author = appReleaseInfo.application.author.akashaProfile;

  // const handleAuthorEthAddressClick = (ethAddress: string) => {
  //   if (network) {
  //     window.open(
  //       `https://${network}.etherscan.io/address/${ethAddress}`,
  //       '_blank',
  //       'noreferrer noopener',
  //     );
  //   } else {
  //     window.open(`https://etherscan.io/address/${ethAddress}`, '_blank', 'noreferrer noopener');
  //   }
  // };

  // const handleAuthorClick = (author: { pubKey: string }) => {
  //   navigateTo?.({
  //     appName: '@akashaorg/app-profile',
  //     getNavigationUrl: routes => `${routes.rootRoute}/${author.pubKey}`,
  //   });
  // };

  // @TODO update with new hooks when available
  // const installedAppsReq = useGetAllInstalledApps(isLoggedIn);

  // const isInstalled = React.useMemo(() => {
  //   if (installedAppsReq.data) {
  //     const installedAppsIds = installedAppsReq.data.map(app => app.id);
  //     return installedAppsIds.includes(appId);
  //   }
  // }, [installedAppsReq.data, appId]);

  // const releasesInfoReq = useGetAppsReleasesQuery(
  //   { last: 10 },
  //   {
  //     select: resp => resp.akashaAppReleaseIndex.edges,
  //   },
  // );

  // const releases = releasesInfoReq.data.map(release => release.node);

  const developers = appReleaseInfo?.application?.contributors?.map(contributor => {
    const avatarImg = getProfileImageVersionsWithMediaUrl(contributor.akashaProfile?.avatar);
    return {
      profileId: contributor.akashaProfile.did.id,
      name: contributor.akashaProfile.name,
      avatar: avatarImg,
    };
  });

  return (
    <Stack>
      {appReleaseInfoReq.error && (
        <ErrorLoader
          type="script-error"
          title={t('There was an error loading the app info')}
          details={t('We cannot show this app right now')}
          // devDetails={appReleaseInfoReq.error.message}
        />
      )}
      {!appReleaseInfoReq.error && (
        <AppInfo
          integrationName={appReleaseInfo?.application?.displayName}
          packageName={appReleaseInfo?.application?.name}
          developers={developers}
          descriptionTitle={t('Description')}
          descriptionBody={appReleaseInfo?.application?.description}
          developersTitle={t('Developers')}
          latestReleaseTitle={t('Latest Release')}
          version={t('Version') + ` ${appReleaseInfo?.version}`}
          versionInfo={t('Latest release')}
          versionDate={t('December 2022')}
          versionDescription={appReleaseInfo?.application?.description}
          linksAndDocumentationTitle={t('Links & Documentation')}
          licenseTitle={t('License')}
          license={appReleaseInfo?.application?.licence}
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
          status={
            'installed'
            // isInstalled ? 'installed' : 'not-installed'
          }
        />
      )}
    </Stack>
  );
};

export default InfoPage;
