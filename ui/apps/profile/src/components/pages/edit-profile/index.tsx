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
  useIndexProfileMutation,
  useUpdateProfileMutation,
} from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import { transformSource, hasOwn, useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import { useSaveImage } from './use-save-image';
import { PartialAkashaProfileInput } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { deleteImageAndGetProfileContent } from './delete-image-and-get-profile-content';
import { EditProfileFormValues } from '@akashaorg/design-system-components/lib/components/EditProfile/types';
import { NotificationEvents, NotificationTypes } from '@akashaorg/typings/lib/ui';

type EditProfilePageProps = {
  profileId: string;
};

const EditProfilePage: React.FC<EditProfilePageProps> = props => {
  const { profileId } = props;
  const { t } = useTranslation('app-profile');
  const { getRoutingPlugin, uiEvents } = useRootComponentProps();
  const { avatarImage, coverImage, saveImage, loading: isSavingImage } = useSaveImage();
  const [activeTab, setActiveTab] = useState(0);
  const [selectedActiveTab, setSelectedActiveTab] = useState(0);
  const [showUnsavedChangesModal, setShowUnsavedChangesModal] = useState(false);
  const [profileContentOnImageDelete, setProfileContentOnImageDelete] =
    useState<PartialAkashaProfileInput | null>(null);
  const navigateTo = getRoutingPlugin().navigateTo;
  const { data, error } = useGetProfileByDidSuspenseQuery({
    variables: { id: profileId },
  });

  const { akashaProfile: profileData } =
    data?.node && hasOwn(data.node, 'akashaProfile') ? data.node : { akashaProfile: null };
  const background = profileData?.background;
  const avatar = profileData?.avatar;

  const onEditSuccess = () => {
    uiEvents.next({
      event: NotificationEvents.ShowNotification,
      data: {
        type: NotificationTypes.Success,
        message: t('Profile updated successfully'),
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
  const sdk = getSDK();

  const [createProfileMutation, { loading: createProfileProcessing }] = useCreateProfileMutation({
    context: { source: sdk.services.gql.contextSources.composeDB },
    onCompleted: data => {
      const id = data.createAkashaProfile?.document.id;
      if (id) indexProfile(id);
      onEditSuccess();
    },
  });
  const [updateProfileMutation, { loading: updateProfileProcessing }] = useUpdateProfileMutation({
    context: { source: sdk.services.gql.contextSources.composeDB },
    onCompleted: onEditSuccess,
  });
  const [indexProfileMutation] = useIndexProfileMutation();
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
      getNavigationUrl: () => `/${profileId}`,
    });
  };

  const indexProfile = async (id: string) => {
    const payload = await sdk.api.auth.prepareIndexedID(id);
    if (payload)
      indexProfileMutation({
        variables: payload,
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

  return (
    <Stack direction="column" spacing="gap-y-4" customStyle="h-full">
      <Card radius={20} elevation="1" customStyle="py-4 h-full">
        <EditProfile
          defaultValues={{
            avatar: null,
            coverImage: null,
            name: profileData?.name ?? '',
            bio: profileData?.description ?? '',
            ens: '',
            userName: '',
            links: profileData?.links?.map(link => link.href) ?? [],
          }}
          header={{
            title: t('Avatar & Cover Image'),
            coverImage: background,
            avatar: avatar,
            dragToRepositionLabel: t('Drag the image to reposition'),
            profileId,
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
            onImageSave: async (type, image) =>
              saveImage({ type, image, onError: onSaveImageError }),
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
            },
          }}
        />
      </Card>
      <Modal
        title={{ label: t('Unsaved Changes') }}
        show={showUnsavedChangesModal}
        onClose={() => {
          setSelectedActiveTab(activeTab);
          setShowUnsavedChangesModal(false);
        }}
        actions={[
          {
            variant: 'text',
            label: t('Leave'),
            onClick: () => {
              setActiveTab(selectedActiveTab);
              setShowUnsavedChangesModal(false);
            },
          },
          {
            variant: 'primary',
            label: 'Save',
            onClick: () => {
              setShowUnsavedChangesModal(false);
              //@TODO
            },
          },
        ]}
      >
        <Text variant="body1">
          {t(
            "It looks like you haven't saved your changes, if you leave this page all the changes you made will be gone!",
          )}
        </Text>
      </Modal>
    </Stack>
  );
};

export default EditProfilePage;
