import React, { useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import {
  ErrorLoader,
  ErrorLoaderDescription,
  ErrorLoaderFooter,
  ErrorLoaderTitle,
} from '@akashaorg/ui/lib/akasha-components/error-loader';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import { Loader2 } from 'lucide-react';
import {
  ProfileAvatar,
  ProfileAvatarFallback,
  ProfileAvatarImage,
} from '@akashaorg/ui/lib/akasha-components/profile-avatar';
import ExtensionReviewAndPublish from '../../extension-review-and-publish';
import {
  transformSource,
  useAkashaStore,
  useProfilesList,
  useRootComponentProps,
} from '@akashaorg/ui-core-hooks';
import { Extension, NotificationEvents, NotificationTypes } from '@akashaorg/typings/lib/ui';
import getSDK from '@akashaorg/core-sdk';
import {
  useCreateAppMutation,
  useGetAppsByPublisherDidQuery,
} from '@akashaorg/ui-core-hooks/lib/generated';
import { selectAkashaApp } from '@akashaorg/ui-core-hooks/lib/selectors/get-apps-by-publisher-did-query';
import appRoutes, { SUBMIT_EXTENSION } from '../../../routes';
import { DRAFT_EXTENSIONS, DRAFT_RELEASES } from '../../../constants';
import { createAppMutationCache } from './create-app-mutation-cache';
import { StackedAvatar } from '@akashaorg/ui/lib/akasha-components/stacked-avatar';
type ExtensionPublishPageProps = {
  extensionId: string;
};
export const ExtensionPublishPage: React.FC<ExtensionPublishPageProps> = ({ extensionId }) => {
  const navigate = useNavigate();
  const { t } = useTranslation('app-extensions');
  const { uiEvents, baseRouteName, getCorePlugins, encodeAppName } = useRootComponentProps();
  const uiEventsRef = React.useRef(uiEvents);
  const navigateTo = getCorePlugins().routing.navigateTo;
  const sdk = useRef(getSDK());
  const showErrorNotification = React.useCallback((title: string, description?: string) => {
    uiEventsRef.current.next({
      event: NotificationEvents.ShowNotification,
      data: {
        type: NotificationTypes.Error,
        title,
        description,
      },
    });
  }, []);
  const {
    data: { authenticatedDID },
  } = useAkashaStore();

  // fetch the draft extensions that are saved only on local storage
  const draftExtensions: Extension[] = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem(`${DRAFT_EXTENSIONS}-${authenticatedDID}`)) || [];
    } catch (error) {
      showErrorNotification(error);
    }
  }, [authenticatedDID, showErrorNotification]);
  const extensionData = draftExtensions?.find(draftExtension => draftExtension.id === extensionId);
  const draftReleases = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem(`${DRAFT_RELEASES}-${authenticatedDID}`)) || [];
    } catch (error) {
      showErrorNotification(error);
    }
  }, [authenticatedDID, showErrorNotification]);
  const localRelease = draftReleases?.find(
    draftRelease => draftRelease.applicationID === extensionId,
  );
  const [createAppMutation, { loading: loadingAppMutation }] = useCreateAppMutation({
    context: {
      source: sdk.current.services.gql.contextSources.composeDB,
    },
    update: (
      cache,
      {
        data: {
          setAkashaApp: { document },
        },
      },
    ) => {
      createAppMutationCache({
        cache,
        authenticatedDID,
        document,
      });
    },
    onCompleted: data => {
      // after the extension has been published to the ceramic model
      // search for it in the list of local draft extensions and
      // remove the published extension from list of local extensions
      const newLocalDraftExtensions = draftExtensions.filter(
        draftExtension => draftExtension.id !== extensionId,
      );
      // save the new list of local draft extensions in local storage
      localStorage.setItem(
        `${DRAFT_EXTENSIONS}-${authenticatedDID}`,
        JSON.stringify(newLocalDraftExtensions),
      );
      // remove the local release tied to the draft extension
      const newLocalDraftReleases = draftReleases.filter(
        draftRelease => draftRelease.applicationID !== extensionId,
      );
      // update the local draft release to reflect the published app id
      const newLocalRelease = {
        ...localRelease,
        applicationID: data?.setAkashaApp?.document?.id,
      };
      // save the new list of local draft releases in local storage
      localStorage.setItem(
        `${DRAFT_RELEASES}-${authenticatedDID}`,
        JSON.stringify([...newLocalDraftReleases, newLocalRelease]),
      );
      navigate({
        to: '/post-publish/$extensionId',
        params: {
          extensionId,
        },
      });
    },
    onError: error => {
      showErrorNotification(
        `${t(`Something went wrong when publishing the extension`)}.`,
        error.message,
      );
    },
  });
  const handleConnectButtonClick = () => {
    navigateTo?.({
      appName: '@akashaorg/app-auth-ewa',
      getNavigationUrl: (routes: Record<string, string>) => {
        return `${routes.Connect}?${new URLSearchParams({
          redirectTo: `${baseRouteName}/${appRoutes[SUBMIT_EXTENSION]}/${extensionId}`,
        }).toString()}`;
      },
    });
  };
  const {
    data: appInfoName,
    loading: loadingAppInfoName,
    error: appInfoQueryErrorName,
    called: calledAppInfoName,
  } = useGetAppsByPublisherDidQuery({
    variables: {
      id: authenticatedDID,
      first: 1,
      filters: {
        where: {
          name: {
            equalTo: extensionData?.name,
          },
        },
      },
    },
    fetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
    skip: !extensionData?.name || !authenticatedDID,
  });
  const {
    profilesData,
    loading: loadingProfilesData,
    error: errorProfilesData,
  } = useProfilesList(extensionData?.contributors);
  const isDuplicatePublishedExtName = useMemo(() => !!selectAkashaApp(appInfoName), [appInfoName]);
  useEffect(() => {
    if (appInfoQueryErrorName) {
      showErrorNotification(appInfoQueryErrorName.message);
    }
  }, [appInfoQueryErrorName, showErrorNotification]);
  const contributorAvatars = useMemo(() => {
    if (profilesData?.length) {
      return profilesData
        .filter(contrib => !!contrib)
        .map(contrib => {
          return {
            ...contrib,
            avatar: transformSource(contrib.avatar?.default),
          };
        });
    }
  }, [profilesData]);
  const handleClickPublish = () => {
    if (calledAppInfoName && !loadingAppInfoName && !isDuplicatePublishedExtName) {
      const extData = {
        applicationType: extensionData?.applicationType,
        contributors: extensionData?.contributors,
        coverImage: extensionData?.coverImage,
        createdAt: new Date().toISOString(),
        description: extensionData?.description,
        displayName: extensionData?.displayName,
        gallery: extensionData?.gallery,
        keywords: extensionData?.keywords,
        license: extensionData?.license,
        links: extensionData?.links,
        logoImage: extensionData?.logoImage,
        name: extensionData?.name,
        nsfw: extensionData?.nsfw,
      };
      createAppMutation({
        variables: {
          i: {
            content: extData,
          },
        },
      });
    }
  };
  const handleClickCancel = () => {
    navigate({
      to: '/my-extensions',
    });
  };
  if (!authenticatedDID) {
    return (
      <ErrorLoader type="not-authenticated">
        <ErrorLoaderTitle>{`${t('Uh-oh')}! ${t('You are not connected')}!`}</ErrorLoaderTitle>
        <ErrorLoaderDescription>{`${t('To check your extensions you must be connected')} ⚡️`}</ErrorLoaderDescription>
        <ErrorLoaderFooter>
          <Button onClick={handleConnectButtonClick}>{t('Connect')}</Button>
        </ErrorLoaderFooter>
      </ErrorLoader>
    );
  }
  const onViewAllClick = () => {
    if (extensionData?.name) {
      navigate({
        to: '/info/$appId/contributors',
        params: {
          appId: encodeAppName(extensionData.name),
        },
      });
    }
  };
  const onEditExtensionClick = () => {
    navigate({
      to: '/edit-extension/$extensionId/step1',
      params: {
        extensionId,
      },
    });
  };
  return (
    <Card className="shadow-none p-0">
      <Stack spacing={2}>
        <Stack className="p-4">
          <Typography variant="h5" className="font-semibold text-center">
            {t('Review and Publish Extension')}
          </Typography>
        </Stack>
        <ExtensionReviewAndPublish
          extensionData={extensionData}
          title={t('Review Extension')}
          subtitle={{
            part1: 'Please note that fields marked with',
            part2: 'are required and cannot be edited once submitted.',
          }}
          extensionNameLabel={t('Extension ID')}
          extensionDisplayNameLabel={t('Extension Display Name')}
          nsfwLabel={t('Extension NSFW')}
          nsfwDescription={t('You marked it as{{nsfw}} Safe For Work', {
            nsfw: extensionData?.nsfw ? ' Not' : '',
          })}
          descriptionLabel={t('Description')}
          galleryLabel={t('Gallery')}
          imageUploadedLabel={t('images uploaded')}
          imageNotLoadedLabel={t(`Cannot load image`)}
          viewAllLabel={t('View All')}
          usefulLinksLabel={t('Useful Links')}
          licenseLabel={t('License')}
          contributorsLabel={t('Contributors')}
          tagsLabel={t('Tags')}
          backButtonLabel={t('Cancel')}
          publishButtonLabel={t('Publish')}
          duplicateExtNameErrLabel={t('An extension with this name has already been published')}
          loading={loadingAppMutation || loadingAppInfoName}
          isDuplicateExtName={isDuplicatePublishedExtName}
          contributorsUi={
            <>
              {loadingProfilesData && (
                <Stack alignItems="center" justifyContent="center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </Stack>
              )}
              {errorProfilesData && (
                <Stack>
                  <ErrorLoader type="script-error">
                    <ErrorLoaderTitle>
                      {t('There was an error loading the contributors')}
                    </ErrorLoaderTitle>
                    <ErrorLoaderDescription>{errorProfilesData.message}</ErrorLoaderDescription>
                  </ErrorLoader>
                </Stack>
              )}
              {profilesData?.length > 0 && (
                <Stack direction="row" spacing={2} alignItems="center">
                  <StackedAvatar count={contributorAvatars.length}>
                    {index => (
                      <ProfileAvatar>
                        <ProfileAvatarImage
                          src={contributorAvatars[index].avatar?.src}
                          alt={contributorAvatars[index].name}
                        />
                        <ProfileAvatarFallback />
                      </ProfileAvatar>
                    )}
                  </StackedAvatar>
                  <Stack>
                    <Typography variant="xs" bold>
                      {profilesData[0]?.name}
                    </Typography>
                    {profilesData.length > 1 && (
                      <Typography
                        variant="xs"
                        className="font-medium text-grey7 font-normal"
                      >{`and ${profilesData.length - 1} ${t('more')}`}</Typography>
                    )}
                  </Stack>
                  <Button variant="link" onClick={onViewAllClick} className="ml-auto">
                    {t('View All')}
                  </Button>
                </Stack>
              )}
            </>
          }
          needToMakeChangesLabel={t('Need to make changes?')}
          editExtension={{
            handleClick: onEditExtensionClick,
            label: t('Edit extension'),
          }}
          transformSource={transformSource}
          onClickCancel={handleClickCancel}
          onClickSubmit={handleClickPublish}
        />
      </Stack>
    </Card>
  );
};
