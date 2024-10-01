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
import { formatRelativeTime, truncateDid } from '@akashaorg/design-system-core/lib/utils';
import {
  useGetAppReleaseByIdQuery,
  useGetAppsQuery,
} from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import {
  selectAkashaApp,
  selectLatestRelease,
} from '@akashaorg/ui-awf-hooks/lib/selectors/get-apps-query';
import { NetworkStatus } from '@apollo/client';
import { useMemo } from 'react';

type InfoPageProps = {
  appId: string;
};

export const InfoPage: React.FC<InfoPageProps> = ({ appId }) => {
  const navigate = useNavigate();
  const { t } = useTranslation('app-extensions');
  const { navigateToModal, decodeAppName } = useRootComponentProps();
  const {
    data: { authenticatedDID },
  } = useAkashaStore();
  const isLoggedIn = !!authenticatedDID;

  const appReq = useGetAppsQuery({
    variables: {
      first: 1,
      filters: { where: { name: { equalTo: decodeAppName(appId) } } },
    },
  });

  const { error, data, networkStatus } = useGetAppReleaseByIdQuery({
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

  const appData = selectAkashaApp(appReq.data);
  const latestRelease = useMemo(() => selectLatestRelease(appReq.data), [appReq.data]);

  return (
    <Stack>
      {error && (
        <ErrorLoader
          type="script-error"
          title={t('There was an error loading the app info')}
          details={t('We cannot show this app right now')}
        />
      )}
      {!error && appReq.networkStatus === NetworkStatus.ready && (
        <AppInfo
          integrationName={appData.displayName}
          integrationType={appData.applicationType}
          nsfw={appData.nsfw}
          nsfwLabel="NSFW"
          pluginLabel={t('Plugin')}
          share={{ label: t('Share'), icon: <ShareIcon /> }}
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
          packageName={appData.name}
          packageNameTitle={'Package name'}
          extensionIdTitle={'Extension Id'}
          extensionId={appData.id}
          developers={appData.contributors?.map(contrib => ({
            name: contrib.akashaProfile.name,
            profileId: contrib.id,
            avatar: contrib.akashaProfile.avatar,
          }))}
          descriptionTitle={t('Description')}
          readMore={t('Read more')}
          descriptionBody={appData.description}
          galleryTitle={t('Gallery')}
          viewAllGalleryCTA={t('View all')}
          developersTitle={t('Developer')}
          permissionTitle={t('Extension Permission')}
          collaboratorsTitle={t('Collaborators')}
          generalInfoTitle={t('General Information')}
          latestReleaseTitle={t('Latest Release')}
          languageLabel={t('Languages')}
          languages={['English', 'Spanish']}
          version={t('Version {{appVersion}}', { appVersion: latestRelease?.node?.version })}
          versionInfo={t('Latest release')}
          versionDate={formatRelativeTime(latestRelease?.node?.createdAt)}
          versionDescription={
            latestRelease?.node?.meta?.filter(metadata => metadata.property === 'changelog')[0]
              ?.value ?? t('this release has no changelog.')
          }
          goToVersionInfoPageLabel={t('View info')}
          documentationTitle={t('Documentation')}
          documentationLink={'Link 1'}
          licenseTitle={t('License')}
          license={appData.license}
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
