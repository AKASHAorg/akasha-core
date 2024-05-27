import * as React from 'react';
import { useNavigate } from '@tanstack/react-router';
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
import { Developer } from '@akashaorg/typings/lib/ui';

export const mockProfile: Developer = {
  avatar: {
    default: {
      src: 'https://avatar.iran.liara.run/public',
      height: 320,
      width: 320,
    },
  },
  profileId: 'did:pkh:eip155:5:0x36c703c4d2fa2437dc883e2e0884e57404e11234',
  name: 'Tetrarcha',
};

const developers = [
  {
    profileId: mockProfile.profileId,
    name: mockProfile.name,
    avatar: mockProfile.avatar,
  },
];

type InfoPageProps = {
  appId: string;
};

export const InfoPage: React.FC<InfoPageProps> = ({ appId }) => {
  const navigate = useNavigate();
  const { t } = useTranslation('app-extensions');
  const {
    data: { authenticatedDID },
  } = useAkashaStore();
  const isLoggedIn = !!authenticatedDID;
  const { data: appReleaseInfoReq, error } = useGetAppReleaseByIdQuery({
    variables: { id: appId },
    skip: !isLoggedIn || true,
  });

  const appReleaseInfo =
    appReleaseInfoReq?.node && hasOwn(appReleaseInfoReq?.node, 'applicationID')
      ? appReleaseInfoReq.node
      : null;

  /* appReleaseInfo?.application?.contributors?.map(contributor => {
    const avatarImg = contributor.akashaProfile?.avatar;
    return {
      profileId: contributor.akashaProfile.did.id,
      name: contributor.akashaProfile.name,
      avatar: avatarImg,
    };
  }); */

  return (
    <Stack>
      {error && (
        <ErrorLoader
          type="script-error"
          title={t('There was an error loading the app info')}
          details={t('We cannot show this app right now')}
        />
      )}
      {true && (
        <AppInfo
          integrationName={'Test app' /* appReleaseInfo?.application?.displayName */}
          packageName={
            'com.companyname.productname.supercarts.racing.game' /* appReleaseInfo?.application?.name */
          }
          packageNameTitle={'Package name'}
          developers={developers}
          descriptionTitle={t('Description')}
          readMore={t('Read more')}
          descriptionBody={
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. /n Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
            /* appReleaseInfo?.application?.description */
          }
          galleryTitle={t('Gallery')}
          viewAllGalleryCTA={t('View all')}
          developersTitle={t('Developer')}
          collaboratorsTitle={t('Collaborators')}
          generalInfoTitle={t('General Information')}
          latestReleaseTitle={t('Latest Release')}
          languageLabel={t('Languages')}
          languages={['English', 'Spanish']}
          version={t('Version 2.8.10') /* + ` ${appReleaseInfo?.version}` */}
          versionInfo={t('Latest release')}
          versionDate={t('December 2022')}
          versionDescription={
            'some dummy description' /* appReleaseInfo?.application?.description */
          }
          goToVersionInfoPageLabel={t('View info')}
          documentationTitle={t('Documentation')}
          licenseTitle={t('License')}
          license={'license 1122233' /* appReleaseInfo?.application?.license */}
          contactSupportTitle={t('Contact Support')}
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
            navigate({
              to: '/info/$appId/developer/$devDid',
              params: {
                appId,
                devDid: '1',
              },
            });
          }}
          onCollaboratorsClick={() => {
            navigate({
              to: '/info/$appId/collaborators',
              params: {
                appId,
              },
            });
          }}
          onAppVersionClick={() => {
            navigate({
              to: '/info/$appId/versions',
            });
          }}
          status={
            'not-installed'
            // isInstalled ? 'installed' : 'not-installed'
          }
          transformSource={transformSource}
        />
      )}
    </Stack>
  );
};
