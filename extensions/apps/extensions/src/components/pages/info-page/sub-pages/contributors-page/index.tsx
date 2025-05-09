import React from 'react';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import {
  ProfileAvatarButton,
  ProfileAvatarButtonAvatar,
  ProfileAvatarButtonAvatarFallback,
  ProfileAvatarButtonAvatarImage,
  ProfileDidField,
  ProfileName,
} from '@akashaorg/ui/lib/akasha-components/profile-avatar-button';
import { Loader2 } from 'lucide-react';
import {
  ErrorLoader,
  ErrorLoaderDescription,
  ErrorLoaderTitle,
} from '@akashaorg/ui/lib/akasha-components/error-loader';
import ExtensionSubRouteHeader from '../../InfoSubroutePageHeader';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import { transformSource, useRootComponentProps } from '@akashaorg/ui-core-hooks';
import {
  AkashaAppApplicationType,
  AppImageSource,
} from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { selectExtensionContributors } from '@akashaorg/ui-core-hooks/lib/selectors/get-apps-query';
import { useContributors } from './use-contributors';
import { ChevronRightIcon } from 'lucide-react';

type ContributorsPageProps = {
  appId: string;
  extensionLogo?: AppImageSource;
  extensionName?: string;
  extensionDisplayName?: string;
  contributors?: ReturnType<typeof selectExtensionContributors>;
  extensionType?: AkashaAppApplicationType;
};

export const ContributorsPage = (props: ContributorsPageProps) => {
  const { appId, extensionLogo, extensionName, extensionDisplayName, extensionType, contributors } =
    props;
  const { t } = useTranslation('app-extensions');
  const { decodeAppName } = useRootComponentProps();
  const { localExtensionData, contributorsProfile, loading, error } = useContributors({
    appName: decodeAppName(appId),
    publishedAppContributorsProfile: contributors?.map(contributor => contributor.akashaProfile),
  });
  const navigate = useNavigate();

  return (
    <>
      <Card className="p-4">
        <Stack spacing={4}>
          <ExtensionSubRouteHeader
            pageTitle={t('Contributors')}
            appName={extensionDisplayName ?? localExtensionData?.displayName}
            packageName={extensionName ?? localExtensionData?.name}
            appType={extensionType ?? localExtensionData?.applicationType}
            appLogo={extensionLogo ?? localExtensionData?.logoImage}
          />
          <Divider />
          <Stack direction="column" spacing={4}>
            {loading && (
              <Stack alignItems="center" justifyContent="center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </Stack>
            )}
            {error && (
              <Stack>
                <ErrorLoader type="script-error">
                  <ErrorLoaderTitle>
                    {t('There was an error loading the contributors')}
                  </ErrorLoaderTitle>
                  <ErrorLoaderDescription>{error.message}</ErrorLoaderDescription>
                </ErrorLoader>
              </Stack>
            )}
            {contributorsProfile?.map((contributor, index) => (
              <Stack key={contributor.id} direction="column" spacing={4}>
                <Card
                  onClick={() => {
                    navigate({
                      to: '/info/$appId/developer/$devDid',
                      params: {
                        appId,
                        devDid: contributor?.did.id,
                      },
                    });
                  }}
                  className="p-0 shadow-noneborder-none"
                >
                  <Stack direction="row" alignItems="center">
                    <ProfileAvatarButton profileDID={contributor?.did.id}>
                      <ProfileAvatarButtonAvatar>
                        <ProfileAvatarButtonAvatarImage
                          src={transformSource(contributor?.avatar?.default)?.src}
                          alt="Contributor Avatar"
                        />
                        <ProfileAvatarButtonAvatarFallback
                          alternativeSrc={contributor?.avatar?.alternatives?.map(
                            alternative => transformSource(alternative)?.src,
                          )}
                        />
                      </ProfileAvatarButtonAvatar>
                      <ProfileName>{contributor?.name}</ProfileName>
                      <ProfileDidField />
                    </ProfileAvatarButton>
                    <ChevronRightIcon className="h-4 w-4 ml-auto [&>*]:stroke-secondaryLight dark:[&>*]:stroke-secondaryDark" />
                  </Stack>
                </Card>
                {index < contributorsProfile.length - 1 && <Divider />}
              </Stack>
            ))}
          </Stack>
        </Stack>
      </Card>
    </>
  );
};
