import React, { useState } from 'react';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@akashaorg/ui/lib/components/alert-dialog';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import {
  ErrorLoader,
  ErrorLoaderDescription,
  ErrorLoaderTitle,
} from '@akashaorg/ui/lib/akasha-components/error-loader';
import getSDK from '@akashaorg/core-sdk';
import { useTranslation } from 'react-i18next';
import {
  useCreateProfileMutation,
  useGetProfileByDidSuspenseQuery,
  useUpdateProfileMutation,
} from '@akashaorg/ui-core-hooks/lib/generated/apollo';
import { transformSource, useRootComponentProps, useSaveImage } from '@akashaorg/ui-core-hooks';
import { PartialAkashaProfileInput } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import {
  NotificationEvents,
  NotificationTypes,
  PublishProfileData,
} from '@akashaorg/typings/lib/ui';
import { getAvatarImage, getCoverImage } from './get-profile-images';
import { selectProfileData } from '@akashaorg/ui-core-hooks/lib/selectors/get-profile-by-did-query';
import EditProfile from '../../edit-profile';
type EditProfilePageProps = {
  profileDID: string;
};
const EditProfilePage: React.FC<EditProfilePageProps> = props => {
  const { profileDID } = props;
  const { t } = useTranslation('app-profile');
  const { getCorePlugins, logger, uiEvents } = useRootComponentProps();
  const {
    image: avatarImage,
    saveImage: saveAvatarImage,
    loading: isSavingAvatarImage,
  } = useSaveImage();
  const {
    image: coverImage,
    saveImage: saveCoverImage,
    loading: isSavingCoverImage,
  } = useSaveImage();
  const isSavingImage = isSavingAvatarImage || isSavingCoverImage;
  const [showNsfwModal, setShowNsfwModal] = useState(false);
  const [nsfwFormValues, setNsfwFormValues] = useState<PublishProfileData>();
  const navigateTo = getCorePlugins().routing.navigateTo;
  const { data, error } = useGetProfileByDidSuspenseQuery({
    variables: {
      id: profileDID,
    },
  });
  const profileData = selectProfileData(data);
  const background = profileData?.background;
  const avatar = profileData?.avatar;
  const sdk = getSDK();
  const onSuccess = () => {
    uiEvents.next({
      event: NotificationEvents.ShowNotification,
      data: {
        type: NotificationTypes.Success,
        title: t('Profile updated successfully.'),
      },
    });
    navigateToProfileInfoPage();
  };
  const onError = () => {
    uiEvents.next({
      event: NotificationEvents.ShowNotification,
      data: {
        type: NotificationTypes.Error,
        title: t('Profile update unsuccessful. Please try again.'),
      },
    });
    navigateToProfileInfoPage();
  };
  const onSaveImageError = () => {
    uiEvents.next({
      event: NotificationEvents.ShowNotification,
      data: {
        type: NotificationTypes.Error,
        title: t("The image wasn't uploaded correctly. Please try again!"),
      },
    });
  };
  const [createProfileMutation, { loading: createProfileProcessing }] = useCreateProfileMutation({
    context: {
      source: sdk.services.gql.contextSources.composeDB,
    },
    onCompleted: () => {
      onSuccess();
    },
    onError: error => {
      onError();
      logger.error(`error in creating a profile: ${JSON.stringify(error)}`);
    },
  });
  const [updateProfileMutation, { loading: updateProfileProcessing }] = useUpdateProfileMutation({
    context: {
      source: sdk.services.gql.contextSources.composeDB,
    },
    onCompleted: onSuccess,
    onError: error => {
      onError();
      logger.error(`error in updating a profile: ${JSON.stringify(error)}`);
    },
  });
  const isProcessing = createProfileProcessing || updateProfileProcessing;
  if (error)
    return (
      <ErrorLoader type="script-error">
        <ErrorLoaderTitle>{t('There was an error loading this profile')}</ErrorLoaderTitle>
        <ErrorLoaderDescription>
          {t('We cannot show this profile right now')}
        </ErrorLoaderDescription>
      </ErrorLoader>
    );
  const navigateToProfileInfoPage = () => {
    navigateTo({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: () => `/${profileDID}`,
    });
  };
  const createProfile = async (
    publishProfileData: PublishProfileData,
    profileImages: Pick<PartialAkashaProfileInput, 'avatar' | 'background'>,
  ) => {
    const info = await sdk.services.gql.getAPI().GetAppsByPublisherDID({
      id: sdk.services.gql.indexingDID,
      filters: {
        where: {
          name: {
            equalTo: '@akashaorg/app-profile',
          },
        },
      },
      last: 1,
    });
    if (!info.node || !('akashaAppList' in info.node)) {
      throw new Error('@akashaorg/app-profile not found');
    }
    return createProfileMutation({
      variables: {
        i: {
          content: {
            name: publishProfileData.name,
            description: publishProfileData.bio,
            links: publishProfileData.links.map(link => ({
              href: link,
            })),
            nsfw: publishProfileData.nsfw,
            appID: info.node.akashaAppList.edges[0].node.id,
            appVersionID: info.node.akashaAppList.edges[0].node.releases.edges[0].node.id,
            createdAt: new Date().toISOString(),
            ...profileImages,
          },
        },
      },
    });
  };
  const updateProfile = async (
    publishProfileData: PublishProfileData,
    profileImages: Pick<PartialAkashaProfileInput, 'avatar' | 'background'>,
  ) => {
    updateProfileMutation({
      variables: {
        i: {
          id: profileData?.id,
          content: {
            name: publishProfileData.name,
            description: publishProfileData.bio,
            links: publishProfileData.links.map(link => ({
              href: link,
            })),
            // composedDB strips immutable fields on update
            // nsfw: publishProfileData.nsfw,
            ...profileImages,
          },
        },
      },
    });
  };
  const onProfileSave = async (publishProfileData: PublishProfileData) => {
    const isNewProfile = !profileData?.id;
    const newAvatarImage = avatarImage
      ? {
          default: {
            src: avatarImage.src,
            height: avatarImage.height,
            width: avatarImage.width,
          },
        }
      : null;
    const newCoverImage = coverImage
      ? {
          default: {
            src: coverImage.src,
            height: coverImage.height,
            width: coverImage.width,
          },
        }
      : null;
    const profileImages = {
      ...getAvatarImage(newAvatarImage, isNewProfile ? false : !publishProfileData.avatar),
      ...getCoverImage(newCoverImage, isNewProfile ? false : !publishProfileData.coverImage),
    };
    if (isNewProfile) {
      await createProfile(publishProfileData, profileImages);
      return;
    }
    updateProfile(publishProfileData, profileImages);
  };
  return (
    <Stack direction="column" spacing={4} className="h-full">
      <Card className="py-4 h-full rounded-[1.25rem]">
        <EditProfile
          defaultValues={{
            avatar: profileData?.avatar ? transformSource(profileData.avatar?.default) : null,
            coverImage: profileData?.background
              ? transformSource(profileData.background?.default)
              : null,
            name: profileData?.name ?? '',
            bio: profileData?.description ?? '',
            nsfw: profileData?.nsfw ?? false,
            links: profileData?.links?.map(link => link.href) ?? [],
          }}
          header={{
            title: t('Avatar & Cover Image'),
            coverImage: background,
            avatar: avatar,
            dragToRepositionLabel: t('Drag the image to reposition'),
            cropErrorLabel: t('Unable to crop the image. Please try again!'),
            profileId: profileDID,
            cancelLabel: t('Cancel'),
            deleteLabel: t('Delete'),
            saveLabel: t('Save'),
            imageTitle: {
              avatar: {
                label: t('Edit Avatar'),
              },
              coverImage: {
                label: t('Edit Cover'),
              },
            },
            deleteTitle: {
              avatar: {
                label: t('Delete Avatar'),
              },
              coverImage: {
                label: t('Delete Cover'),
              },
            },
            confirmationLabel: {
              avatar: t('Are you sure you want to delete your avatar?'),
              coverImage: t('Are you sure you want to delete your cover?'),
            },
            isSavingImage,
            publicImagePath: '/images',
            onImageSave: (type, image) => {
              switch (type) {
                case 'avatar':
                  saveAvatarImage({
                    name: 'avatar',
                    image,
                    onError: onSaveImageError,
                  });
                  break;
                case 'cover-image':
                  saveCoverImage({
                    name: 'cover-image',
                    image,
                    onError: onSaveImageError,
                  });
                  break;
              }
            },
            transformSource,
          }}
          name={{
            label: t('Name'),
            initialValue: profileData?.name,
          }}
          bio={{
            label: t('Bio'),
            initialValue: profileData?.description,
          }}
          nsfw={{
            label: t('Select NSFW if your profile contains mature or explicit content.'),
            description: t('Note: this is an irreversible action.'),
            initialValue: profileData?.nsfw,
          }}
          nsfwFieldLabel={t('NSFW Profile')}
          linkLabel={t('External URLs')}
          addNewLinkButtonLabel={t('Add new')}
          description={t(
            'You can add your personal websites or social links to be shared on your profile',
          )}
          cancelButton={{
            label: t('Cancel'),
            disabled: isProcessing,
            handleClick: navigateToProfileInfoPage,
          }}
          saveButton={{
            label: t('Save'),
            loading: isProcessing,
            handleClick: async publishProfileData => {
              if (publishProfileData?.nsfw && !profileData?.nsfw) {
                setNsfwFormValues(publishProfileData);
                setShowNsfwModal(true);
                return;
              }
              onProfileSave(publishProfileData);
            },
          }}
        />
      </Card>
      <AlertDialog open={showNsfwModal} onOpenChange={setShowNsfwModal}>
        <AlertDialogContent className="py-4 px-6 md:px-24">
          <AlertDialogHeader>
            <AlertDialogTitle>{t('Changing to NSFW Profile')}</AlertDialogTitle>
            <AlertDialogDescription>
              <Stack direction="column" spacing={4}>
                <Typography>
                  {t('Before you proceed,')}{' '}
                  <Typography variant="h6">{t('please be aware:')}</Typography>
                </Typography>
                <Typography>
                  <Typography variant="h6" className="text-errorLight dark:text-errorDark">
                    {t('Irreversible Action:')}{' '}
                  </Typography>
                  {t('Changing your profile to NSFW (Not Safe For Work)')}
                  <br />{' '}
                  {t(
                    'means all current and future posts will be marked as NSFW. This action is',
                  )}{' '}
                  <br />
                  {t('permanent and cannot be undone')}.
                </Typography>
                <Typography>
                  <Typography variant="h6" className="text-errorLight dark:text-errorDark">
                    {t('Content Impact: ')}{' '}
                  </Typography>
                  {t('Once your profile is set to NSFW, it will affect how your')} <br />{' '}
                  {t('content is viewed and accessed by others in the community.')}
                </Typography>
              </Stack>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setShowNsfwModal(false);
              }}
            >
              {t('Cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (nsfwFormValues?.nsfw) {
                  onProfileSave(nsfwFormValues);
                  setShowNsfwModal(null);
                }
                setShowNsfwModal(false);
              }}
            >
              {t('I understand')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Stack>
  );
};
export default EditProfilePage;
