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
import { transformSource, useAkashaStore, useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import { useGetAppReleaseByIdQuery } from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import { Developer } from '@akashaorg/typings/lib/ui';
import Button from '@akashaorg/design-system-core/lib/components/Button';

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
  const { navigateToModal } = useRootComponentProps();
  const {
    data: { authenticatedDID },
  } = useAkashaStore();
  const isLoggedIn = !!authenticatedDID;
  const { error } = useGetAppReleaseByIdQuery({
    variables: { id: appId },
    skip: !isLoggedIn || true,
  });

  const handleInstallClick = () => {
    if (!authenticatedDID) {
      return navigateToModal({
        name: 'login',
        redirectTo: location.pathname,
      });
    }

    navigate({
      to: '/install/$appId',
      params: {
        appId: appId,
      },
    }).catch(err => console.error('cannot navigate to /install/$appId', err));
  };

  return (
    <Stack>
      {error && (
        <ErrorLoader
          type="script-error"
          title={t('There was an error loading the app info')}
          details={t('We cannot show this app right now')}
        />
      )}
      {!error && (
        <AppInfo
          integrationName="Extension Name"
          integrationType="plugin"
          nsfw={true}
          nsfwLabel="NSFW"
          pluginLabel={t('Plugin')}
          share={{ label: 'Share', icon: <ShareIcon /> }}
          report={{
            label: t('Flag'),
            icon: <FlagIcon />,
            onClick: () => ({}),
            color: { light: 'errorLight', dark: 'errorDark' },
          }}
          status="not-installed"
          notification={{
            title: t('Notification'),
            message: t('Some important information will appear here'),
            action: (
              <Button
                size="md"
                variant="text"
                label={t('Button')}
                onClick={null}
                customStyle="self-start"
              />
            ),
          }}
          versionLabel={t('is available')}
          updateButtonLabel={t('Update')}
          packageName="TBD package name"
          packageNameTitle={'Package name'}
          extensionIdTitle={'Extension Id'}
          extensionId="zhzhahdhaskdh"
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
          permissionTitle={t('Extension Permission')}
          collaboratorsTitle={t('Collaborators')}
          generalInfoTitle={t('General Information')}
          latestReleaseTitle={t('Latest Release')}
          languageLabel={t('Languages')}
          languages={['English', 'Spanish']}
          version={t('Version 2.8.10')}
          versionInfo={t('Latest release')}
          versionDate={t('December 2022')}
          versionDescription={
            'Only two lines of text will be displayed here then if you go to View info aaaa...' /* appReleaseInfo?.application?.description */
          }
          goToVersionInfoPageLabel={t('View info')}
          documentationTitle={t('Documentation')}
          documentationLink={'Link 1'}
          licenseTitle={t('License')}
          license={'License A' /* appReleaseInfo?.application?.license */}
          contactSupportTitle={t('Contact Support')}
          onInstall={handleInstallClick}
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
          onLatestUpdateClick={() => {
            navigate({
              to: '/info/$appId/audit-log',
              params: {
                appId,
              },
            });
          }}
          onPermissionInfoClick={() => {
            navigate({
              to: '/info/$appId/permissions',
              params: {
                appId,
              },
            });
          }}
          onLicenseClick={() => {
            navigate({
              to: '/info/$appId/license',
              params: {
                appId,
              },
            });
          }}
          onContactSupportClick={() => {
            navigate({
              to: '/info/$appId/contact',
              params: {
                appId,
              },
            });
          }}
          onAppDescriptionClick={() => {
            navigate({
              to: '/info/$appId/description',
              params: {
                appId,
              },
            });
          }}
          transformSource={transformSource}
        />
      )}
    </Stack>
  );
};
