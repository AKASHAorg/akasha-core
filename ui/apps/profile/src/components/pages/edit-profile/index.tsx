import React, { useMemo, useState } from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Modal from '@akashaorg/design-system-core/lib/components/Modal';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import EditProfile from '@akashaorg/design-system-components/lib/components/EditProfile';
import { useTranslation } from 'react-i18next';

import {
  useCreateProfileMutation,
  useGetProfileByDidQuery,
  useUpdateProfileMutation,
} from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';
import { getProfileImageVersionsWithMediaUrl, hasOwn, useGetLogin } from '@akashaorg/ui-awf-hooks';
import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router';
import { ProfileLoading } from '@akashaorg/design-system-components/lib/components/Profile';
import { useSaveImage } from './use-save-image';
import { PartialAkashaProfileInput } from '@akashaorg/typings/sdk/graphql-types-new';
import { deleteImageAndGetProfileContent } from './delete-image-and-get-profile-content';
import { EditProfileFormValues } from '@akashaorg/design-system-components/lib/components/EditProfile/types';

type EditProfilePageProps = {
  handleFeedback: () => void;
};

const EditProfilePage: React.FC<EditProfilePageProps> = props => {
  const { handleFeedback } = props;
  const { profileId } = useParams<{ profileId: string }>();
  const [activeTab, setActiveTab] = useState(0);
  const [selectedActiveTab, setSelectedActiveTab] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [profileContentOnImageDelete, setProfileContentOnImageDelete] =
    useState<PartialAkashaProfileInput | null>(null);
  const navigateTo = plugins['@akashaorg/app-routing']?.routing?.navigateTo;

  const onMutate = () => {
    setIsProcessing(true);
  };

  const onSettled = () => {
    setIsProcessing(false);
    navigateToProfileInfoPage();
  };

  const { avatarImage, coverImage, saveImage, loading: isSavingImage } = useSaveImage();
  const queryClient = useQueryClient();
  const loginQuery = useGetLogin();
  const profileDataReq = useGetProfileByDidQuery(
    {
      id: profileId,
    },
    {
      select: response => response.node,
      enabled: !!profileId,
    },
  );

  const { akashaProfile: profileData } =
    profileDataReq.data && hasOwn(profileDataReq.data, 'isViewer')
      ? profileDataReq.data
      : { akashaProfile: null };

  const background = useMemo(
    () => getProfileImageVersionsWithMediaUrl(profileData?.background),
    [profileData?.background],
  );
  const avatar = useMemo(
    () => getProfileImageVersionsWithMediaUrl(profileData?.avatar),
    [profileData?.avatar],
  );
  const createProfileMutation = useCreateProfileMutation({
    onMutate,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: useGetProfileByDidQuery.getKey({ id: profileId }),
      });
      handleFeedback();
    },
    onSettled,
  });
  const updateProfileMutation = useUpdateProfileMutation({
    onMutate,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: useGetProfileByDidQuery.getKey({ id: profileId }),
      });
      handleFeedback();
    },
    onSettled,
  });

  if (!loginQuery.data?.id) {
    return navigateTo({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: () => `/${profileId}`,
    });
  }

  const status = profileDataReq.status;

  if (status === 'loading') return <ProfileLoading />;

  if (status === 'error')
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

  const createProfile = async (
    formValues: EditProfileFormValues,
    profileImages: Pick<PartialAkashaProfileInput, 'avatar' | 'background'>,
  ) => {
    createProfileMutation.mutate({
      i: {
        content: {
          name: formValues.name,
          description: formValues.bio,
          links: formValues.links.map(link => ({ href: link })),
          createdAt: new Date().toISOString(),
          ...profileImages,
        },
      },
    });
  };

  const updateGeneralForm = async (
    formValues: EditProfileFormValues,
    profileImages: Pick<PartialAkashaProfileInput, 'avatar' | 'background'>,
  ) => {
    updateProfileMutation.mutate({
      i: {
        id: profileData.id,
        content: {
          name: formValues.name,
          description: formValues.bio,
          links: formValues.links.map(link => ({ href: link })),
          ...profileImages,
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
      <Card radius={20} elevation="1" customStyle="py-4 h-full mb-4">
        <EditProfile
          defaultValues={
            profileData
              ? {
                  avatar: null,
                  coverImage: null,
                  name: profileData.name,
                  bio: profileData.description,
                  ens: '',
                  userName: '',
                  links: [],
                }
              : undefined
          }
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
            isSavingImage: isSavingImage,
            publicImagePath: '/images',
            onImageSave: async (type, image) => saveImage(type, image),
            onImageDelete: type =>
              setProfileContentOnImageDelete(
                deleteImageAndGetProfileContent({ profileData, type }),
              ),
          }}
          name={{ label: t('Name'), initialValue: profileData?.name }}
          // userName={{ label: t('Username'), initialValue: profileData.userName }}
          bio={{ label: t('Bio'), initialValue: profileData?.description }}
          // ens={{
          //   label: t('ENS Name'),
          //   initialValue:
          //     ENSReq.isFetching && !ENSReq.isFetched
          //       ? 'loading'
          //       : ENSReq.isFetched && ENSReq.data
          //       ? ENSReq.data
          //       : '',
          // }}
          ensButton={{
            label: t('Fill info from ENS data'),
            handleClick: () => {
              //@TODO
            },
          }}
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
                updateProfileMutation.mutate({
                  i: {
                    id: profileData.id,
                    content: profileContentOnImageDelete,
                    options: { replace: true },
                  },
                });
                setProfileContentOnImageDelete(null);
                return;
              }

              updateGeneralForm(formValues, getProfileImageVersions(avatarImage, coverImage));
            },
          }}
        />
      </Card>
      <Modal
        title={{ label: t('Unsaved Changes') }}
        show={showModal}
        onClose={() => {
          setSelectedActiveTab(activeTab);
          setShowModal(false);
        }}
        actions={[
          {
            variant: 'text',
            label: t('Leave'),
            onClick: () => {
              setActiveTab(selectedActiveTab);
              setShowModal(false);
            },
          },
          {
            variant: 'primary',
            label: 'Save',
            onClick: () => {
              setShowModal(false);
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
