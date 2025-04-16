import React, { useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import AppList from '@akashaorg/design-system-components/lib/components/AppList';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { ProfileImageVersions } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { transformSource, useRootComponentProps } from '@akashaorg/ui-core-hooks';
import { useGetAppsByPublisherDidQuery } from '@akashaorg/ui-core-hooks/lib/generated';
import getSDK from '@akashaorg/core-sdk';
import {
  selectApps,
  selectPageInfo,
} from '@akashaorg/ui-core-hooks/lib/selectors/get-apps-by-publisher-did-query';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import Spinner from '@akashaorg/design-system-core/lib/components/Spinner';
import { NetworkStatus } from '@apollo/client';
import {
  ErrorLoader,
  ErrorLoaderDescription,
  ErrorLoaderTitle,
} from '@akashaorg/ui/lib/akasha-components/error-loader';
import DefaultEmptyCard from '@akashaorg/design-system-components/lib/components/DefaultEmptyCard';
import { getExtensionTypeLabel } from '../../../../utils/extension-utils';
import {
  ProfileAvatarButton,
  ProfileAvatarButtonAvatar,
  ProfileAvatarButtonAvatarFallback,
  ProfileAvatarButtonAvatarImage,
  ProfileDidField,
  ProfileName,
} from '@akashaorg/ui/lib/akasha-components/profile-avatar-button';

type DevInfoPageProps = {
  devDid: string;
  name: string;
  avatar: ProfileImageVersions;
  error?: string;
};

export const DevInfoPage = (props: DevInfoPageProps) => {
  const { devDid, name, avatar } = props;
  const navigate = useNavigate();
  const { getCorePlugins, encodeAppName } = useRootComponentProps();
  const { t } = useTranslation('app-extensions');
  const navigateTo = useRef(getCorePlugins().routing.navigateTo);
  const sdk = useRef(getSDK());

  const appsReq = useGetAppsByPublisherDidQuery({
    variables: {
      id: devDid,
      first: 5,
    },
    context: { source: sdk.current.services.gql.contextSources.default },
  });
  const pageInfo = selectPageInfo(appsReq.data);

  /*
    @todo: the followings will be required to filter curated apps

    const appIds = useMemo(() => {
    if (appsReq.networkStatus === NetworkStatus.ready) {
      return selectApps(appsReq.data)?.map(app => app.id) || [];
    }
  }, [appsReq]);

    const appStreamReq = useGetAppsStreamSuspenseQuery({
     variables: {
       indexer: sdk.current.services.common.misc.getIndexingDID(),
       first: appIds?.length,
       filters: {
         where: { applicationID: { in: appIds } },
       },
     },
     skip: !appIds || appIds.length === 0,
   });

   */

  const handleProfileClick = () => {
    navigateTo.current({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: () => `/${devDid}`,
    });
  };

  const handleAppOpen = React.useCallback(
    (appName: string) => () => {
      navigate({
        to: '/info/$appId',
        params: {
          appId: encodeAppName(appName),
        },
      });
    },
    [encodeAppName, navigate],
  );

  const handleLoadMoreApps = () => {
    if (pageInfo?.hasNextPage) {
      appsReq.fetchMore({
        variables: {
          after: pageInfo?.endCursor,
        },
      });
    }
  };

  const apps = useMemo(
    () =>
      selectApps(appsReq.data)
        // @todo: we'll need to show the curated apps only. filtering will be made here
        ?.filter(() => true)
        .map(app => ({
          coverImageSrc: app?.coverImage?.src,
          displayName: app?.displayName,
          applicationType: app?.applicationType,
          extensionTypeLabel: t('{{extensionTypeLabel}}', {
            extensionTypeLabel: getExtensionTypeLabel(app?.applicationType),
          }),
          author: app.author
            ? {
                profileDID: app.author?.akashaProfile?.did?.id,
                name: app.author?.akashaProfile?.name,
                avatar: transformSource(app.author?.akashaProfile?.avatar?.default),
                alternativeAvatars: app.author?.akashaProfile?.avatar.alternatives?.map(alt =>
                  transformSource(alt),
                ),
                nsfw: app.author?.akashaProfile?.nsfw,
              }
            : null,
          description: app?.description,
          defaultLabel: t('Default'),
          nsfwLabel: t('NSFW'),
          nsfw: app?.nsfw,
          action: <Button onClick={handleAppOpen(app.name)}>{t('Open')}</Button>,
        })),
    [appsReq.data, handleAppOpen, t],
  );

  return (
    <>
      <Card className="p-4">
        <Stack spacing={4}>
          <Text variant="h5">{t('Developer')}</Text>
          <ProfileAvatarButton profileDID={devDid} onClick={handleProfileClick}>
            <ProfileAvatarButtonAvatar>
              <ProfileAvatarButtonAvatarImage
                src={
                  transformSource(avatar?.default)?.src ||
                  avatar?.alternatives?.map(alternative => transformSource(alternative))?.[0]?.src
                }
                alt="Developer Avatar"
              />
              <ProfileAvatarButtonAvatarFallback />
            </ProfileAvatarButtonAvatar>
            <ProfileName>{name}</ProfileName>
            <ProfileDidField />
          </ProfileAvatarButton>
          {appsReq.error && (
            <>
              <Divider />
              <ErrorLoader type="list-not-available" className="border-none">
                <ErrorLoaderTitle>{`${t('Uh-oh')}!${t("We couldn't load the extension list")}!`}</ErrorLoaderTitle>
                <ErrorLoaderDescription>{`${t('It seems there is a problem retreving the list of extensions')}. ${t('Please try again later')}!`}</ErrorLoaderDescription>
              </ErrorLoader>
            </>
          )}
          {appsReq.networkStatus === NetworkStatus.ready && !apps?.length && (
            <>
              <Divider />
              <DefaultEmptyCard
                noBorder={true}
                assetName="longbeam-notfound"
                infoText={t('There are no releases for this extension yet')}
              />
            </>
          )}
          {apps && apps.length > 0 && (
            <>
              <Divider />
              <AppList
                hasNextPage={pageInfo?.hasNextPage}
                loading={appsReq.loading}
                apps={apps}
                onLoadMore={handleLoadMoreApps}
              />
            </>
          )}
          {appsReq.loading && (
            <Stack direction="column" alignItems="center">
              <Spinner />
            </Stack>
          )}
        </Stack>
      </Card>
    </>
  );
};
