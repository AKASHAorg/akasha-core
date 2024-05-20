import * as React from 'react';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import {
  FlagIcon,
  ShareIcon,
} from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import AppInfo from '@akashaorg/design-system-components/lib/components/AppInfo';
import { useTranslation } from 'react-i18next';
import { hasOwn, transformSource, useAkashaStore } from '@akashaorg/ui-awf-hooks';
import { useGetAppReleaseByIdQuery } from '@akashaorg/ui-awf-hooks/lib/generated/apollo';

type InfoPageProps = {
  appId: string;
};

export const InfoPage: React.FC<InfoPageProps> = ({ appId }) => {
  const { t } = useTranslation('app-extensions');
  const {
    data: { authenticatedDID },
  } = useAkashaStore();
  const isLoggedIn = !!authenticatedDID;
  const { data: appReleaseInfoReq, error } = useGetAppReleaseByIdQuery({
    variables: { id: appId },
    skip: !isLoggedIn,
  });

  const appReleaseInfo =
    appReleaseInfoReq.node && hasOwn(appReleaseInfoReq?.node, 'applicationID')
      ? appReleaseInfoReq.node
      : null;

  const developers = appReleaseInfo?.application?.contributors?.map(contributor => {
    const avatarImg = contributor.akashaProfile?.avatar;
    return {
      profileId: contributor.akashaProfile.did.id,
      name: contributor.akashaProfile.name,
      avatar: avatarImg,
    };
  });

  return (
    <Stack>
      {error && (
        <ErrorLoader
          type="script-error"
          title={t('There was an error loading the app info')}
          details={t('We cannot show this app right now')}
        />
      )}
      {appReleaseInfo && (
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
          share={{ label: 'Share', icon: <ShareIcon /> }}
          report={{
            label: t('Flag'),
            icon: <FlagIcon />,
            onClick: () => {
              /** handle flag */
            },
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
          transformSource={transformSource}
        />
      )}
    </Stack>
  );
};
