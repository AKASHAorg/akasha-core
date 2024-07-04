import React, { useState } from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Modal from '@akashaorg/design-system-core/lib/components/Modal';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import EditProfile from '@akashaorg/design-system-components/lib/components/EditProfile';
import getSDK from '@akashaorg/awf-sdk';
import { useTranslation } from 'react-i18next';
import {
  useCreateProfileMutation,
  useGetProfileByDidSuspenseQuery,
  useUpdateProfileMutation,
} from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import { transformSource, hasOwn, useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import { useSaveImage } from './use-save-image';
import { PartialAkashaProfileInput } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { deleteImageAndGetProfileContent } from './delete-image-and-get-profile-content';
import { EditProfileFormValues } from '@akashaorg/design-system-components/lib/components/EditProfile/types';
import { NotificationEvents, NotificationTypes } from '@akashaorg/typings/lib/ui';

type EditProfilePageProps = {
  profileDID: string;
};

const EditProfilePage: React.FC<EditProfilePageProps> = props => {
  const { profileDID } = props;
  const { t } = useTranslation('app-profile');
  const { getRoutingPlugin, logger, uiEvents } = useRootComponentProps();
  const { avatarImage, coverImage, saveImage, loading: isSavingImage } = useSaveImage();
  const [showNsfwModal, setShowNsfwModal] = useState(false);
  const [nsfwFormValues, setNsfwFormValues] = useState<EditProfileFormValues>();
  const [profileContentOnImageDelete, setProfileContentOnImageDelete] =
    useState<PartialAkashaProfileInput | null>(null);
  const navigateTo = getRoutingPlugin().navigateTo;
  const { data, error } = useGetProfileByDidSuspenseQuery({
    variables: { id: profileDID },
  });

  const { akashaProfile: profileData } =
    data?.node && hasOwn(data.node, 'akashaProfile') ? data.node : { akashaProfile: null };
  const background = profileData?.background;
  const avatar = profileData?.avatar;
  const sdk = getSDK();

  const onUpdateSuccess = () => {
    uiEvents.next({
      event: NotificationEvents.ShowNotification,
      data: {
        type: NotificationTypes.Success,
        message: t('Profile updated successfully.'),
      },
    });
    navigateToProfileInfoPage();
  };

  const onUpdateError = () => {
    uiEvents.next({
      event: NotificationEvents.ShowNotification,
      data: {
        type: NotificationTypes.Error,
        message: t('Profile update unsuccessful. Please try again.'),
      },
    });
    navigateToProfileInfoPage();
  };

  const onSaveImageError = () => {
    uiEvents.next({
      event: NotificationEvents.ShowNotification,
      data: {
        type: NotificationTypes.Error,
        message: t('The image wasn’t uploaded correctly. Please try again!'),
      },
    });
  };

  const [createProfileMutation, { loading: createProfileProcessing }] = useCreateProfileMutation({
    context: { source: sdk.services.gql.contextSources.composeDB },
    onCompleted: () => {
      onUpdateSuccess();
    },
    onError: error => {
      onUpdateError();
      logger.error(`error in creating a profile: ${JSON.stringify(error)}`);
    },
  });
  const [updateProfileMutation, { loading: updateProfileProcessing }] = useUpdateProfileMutation({
    context: { source: sdk.services.gql.contextSources.composeDB },
    onCompleted: onUpdateSuccess,
    onError: error => {
      onUpdateError();
      logger.error(`error in updating a profile: ${JSON.stringify(error)}`);
    },
  });
  const isProcessing = createProfileProcessing || updateProfileProcessing;

  if (error)
    return (
      <ErrorLoader
        type="script-error"
        title={t('There was an error loading this profile')}
        details={t('We cannot show this profile right now')}
      />
    );

  const navigateToProfileInfoPage = () => {
    navigateTo({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: () => `/${profileDID}`,
    });
  };

  const createProfile = async (
    formValues: EditProfileFormValues,
    profileImages: Pick<PartialAkashaProfileInput, 'avatar' | 'background'>,
  ) => {
    createProfileMutation({
      variables: {
        i: {
          content: {
            name: formValues.name,
            description: formValues.bio,
            links: formValues.links.map(link => ({ href: link })),
            nsfw: formValues.nsfw,
            createdAt: new Date().toISOString(),
            ...profileImages,
          },
        },
      },
    });
  };

  const updateProfile = async (
    formValues: EditProfileFormValues,
    profileImages: Pick<PartialAkashaProfileInput, 'avatar' | 'background'>,
  ) => {
    updateProfileMutation({
      variables: {
        i: {
          id: profileData.id,
          content: {
            name: formValues.name,
            description: formValues.bio,
            links: formValues.links.map(link => ({ href: link })),
            nsfw: formValues.nsfw,
            ...profileImages,
          },
        },
      },
    });
  };

  const getProfileImageVersions = (
    avatarImage: PartialAkashaProfileInput['avatar'],
    coverImage: PartialAkashaProfileInput['background'],
  ) => {
    const avatarImageObj = avatarImage ? { avatar: avatarImage } : {};
    const coverImageObj = coverImage ? { background: coverImage } : {};
    return { ...avatarImageObj, ...coverImageObj };
  };

  const onProfileSave = async (formValues: EditProfileFormValues) => {
    if (!profileData?.id) {
      await createProfile(formValues, getProfileImageVersions(avatarImage, coverImage));
      return;
    }

    if (profileContentOnImageDelete) {
      updateProfileMutation({
        variables: {
          i: {
            id: profileData.id,
            content: profileContentOnImageDelete,
            options: { replace: true },
          },
        },
      });
      setProfileContentOnImageDelete(null);
      return;
    }

    updateProfile(formValues, getProfileImageVersions(avatarImage, coverImage));
  };

  return (
    <Stack direction="column" spacing="gap-y-4" customStyle="h-full">
      <Card radius={20} customStyle="py-4 h-full">
        <EditProfile
          defaultValues={{
            avatar: profileData?.avatar ? transformSource(profileData.avatar?.default) : null,
            coverImage: profileData?.background
              ? transformSource(profileData.background?.default)
              : null,
            name: profileData?.name ?? '',
            bio: profileData?.description ?? '',
            ens: '',
            userName: '',
            nsfw: profileData?.nsfw ?? false,
            links: profileData?.links?.map(link => link.href) ?? [],
          }}
          header={{
            title: t('Avatar & Cover Image'),
            coverImage: background,
            avatar: avatar,
            dragToRepositionLabel: t('Drag the image to reposition'),
            profileId: profileDID,
            cancelLabel: t('Cancel'),
            deleteLabel: t('Delete'),
            saveLabel: t('Save'),
            imageTitle: {
              avatar: { label: t('Edit Avatar') },
              coverImage: { label: t('Edit Cover') },
            },
            deleteTitle: {
              avatar: { label: t('Delete Avatar') },
              coverImage: { label: t('Delete Cover') },
            },
            confirmationLabel: {
              avatar: t('Are you sure you want to delete your avatar?'),
              coverImage: t('Are you sure you want to delete your cover?'),
            },
            isSavingImage,
            publicImagePath: '/images',
            onImageSave: (type, image) => saveImage({ type, image, onError: onSaveImageError }),
            onImageDelete: type =>
              setProfileContentOnImageDelete(
                deleteImageAndGetProfileContent({ profileData, type }),
              ),
            transformSource,
          }}
          name={{ label: t('Name'), initialValue: profileData?.name }}
          bio={{ label: t('Bio'), initialValue: profileData?.description }}
          nsfw={{
            label: t('Select NSFW if your profile contains mature or explicit content.'),
            description: t('Note: this is an irreversible action.'),
            initialValue: profileData?.nsfw,
          }}
          nsfwFormLabel={t('NSFW Profile')}
          linkLabel={t('External URLs')}
          addNewLinkButtonLabel={t('Add new')}
          description={t(
            'You can add your personal websites or social links to be shared on your profile',
          )}
          socialLinks={profileData?.links || []}
          cancelButton={{
            label: t('Cancel'),
            disabled: isProcessing,
            handleClick: () => {
              navigateToProfileInfoPage();
            },
          }}
          saveButton={{
            label: t('Save'),
            loading: isProcessing,
            handleClick: async formValues => {
              if (formValues?.nsfw && !profileData?.nsfw) {
                setNsfwFormValues(formValues);
                setShowNsfwModal(true);
                return;
              }
              onProfileSave(formValues);
            },
          }}
        />
      </Card>
      <Modal
        title={{ label: t('Changing to NSFW Profile') }}
        show={showNsfwModal}
        onClose={() => {
          setShowNsfwModal(false);
        }}
        actions={[
          {
            variant: 'text',
            label: t('Cancel'),
            onClick: () => {
              setShowNsfwModal(false);
            },
          },
          {
            variant: 'primary',
            label: 'I understand',
            onClick: () => {
              if (nsfwFormValues?.nsfw) {
                onProfileSave(nsfwFormValues);
                setShowNsfwModal(null);
              }
              setShowNsfwModal(false);
            },
          },
        ]}
      >
        <Stack direction="column" spacing="gap-y-4">
          <Text variant="body1">
            {t('Before you proceed,')}{' '}
            <Text variant="h6" as="span">
              {t('please be aware:')}
            </Text>
          </Text>
          <Text variant="body1">
            <Text variant="h6" color={{ light: 'errorLight', dark: 'errorDark' }} as="span">
              {t('Irreversible Action:')}{' '}
            </Text>
            {t('Changing your profile to NSFW (Not Safe For Work)')}
            <br /> {t(
              'means all current and future posts will be marked as NSFW. This action is',
            )}{' '}
            <br />
            {t('permanent and cannot be undone')}.
          </Text>
          <Text variant="body1">
            <Text variant="h6" color={{ light: 'errorLight', dark: 'errorDark' }} as="span">
              {t('Content Impact: ')}{' '}
            </Text>
            {t('Once your profile is set to NSFW, it will affect how your')} <br />{' '}
            {t('content is viewed and accessed by others in the community.')}
          </Text>
        </Stack>
      </Modal>
    </Stack>
  );
};

export default EditProfilePage;
