import React, { useMemo, useState } from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Tab from '@akashaorg/design-system-core/lib/components/Tab';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Modal from '@akashaorg/design-system-core/lib/components/Modal';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import { useTranslation } from 'react-i18next';
import { RootComponentProps } from '@akashaorg/typings/ui';
import {
  GeneralForm,
  GeneralFormValues,
} from '@akashaorg/design-system-components/lib/components/EditProfile/GeneralForm';
import { SocialLinks } from '@akashaorg/design-system-components/lib/components/EditProfile/SocialLinks';
import { Interests } from '@akashaorg/design-system-components/lib/components/EditProfile/Interests';
import {
  useCreateProfileMutation,
  useGetInterestsByDidQuery,
  useGetProfileByDidQuery,
  useUpdateProfileMutation,
} from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';
import { getProfileImageVersionsWithMediaUrl, useGetLogin } from '@akashaorg/ui-awf-hooks';
import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router';
import { ProfileLoading } from '@akashaorg/design-system-components/lib/components/Profile';
import { useSaveImage } from './use-save-image';
import { PartialProfileInput } from '@akashaorg/typings/sdk/graphql-types-new';
import { deleteImageAndGetProfileContent } from './delete-image-and-get-profile-content';

type EditProfilePageProps = {
  handleFeedback: () => void;
};

const EditProfilePage: React.FC<RootComponentProps & EditProfilePageProps> = props => {
  const { plugins, handleFeedback } = props;

  const { t } = useTranslation('app-profile');
  const navigateTo = plugins['@akashaorg/app-routing']?.routing?.navigateTo;

  // const ENSReq = useEnsByAddress(profileData.ethAddress);

  const { profileId } = useParams<{ profileId: string }>();

  const profileDataReq = useGetProfileByDidQuery(
    {
      id: profileId,
    },
    {
      select: response => response.node,
      enabled: !!profileId,
    },
  );

  const status = profileDataReq.status;

  const { profile: profileData } =
    profileDataReq.data && 'isViewer' in profileDataReq.data
      ? profileDataReq.data
      : { profile: null };

  const [activeTab, setActiveTab] = useState(0);
  const [selectedActiveTab, setSelectedActiveTab] = useState(0);

  // dirty state for tabs
  const [isGeneralFormDirty, setGeneralFormDirty] = useState(false);
  const [isSocialLinksDirty, setSocialLinksDirty] = useState(false);
  const [isInterestsListDirty, setInterestsListDirty] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [profileContentOnImageDelete, setProfileContentOnImageDelete] =
    useState<PartialProfileInput | null>(null);

  const { avatarImage, coverImage, saveImage, loading: isSavingImage } = useSaveImage();

  const queryClient = useQueryClient();
  const createProfileMutation = useCreateProfileMutation({
    onMutate: () => {
      setIsProcessing(true);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: useGetProfileByDidQuery.getKey({ id: profileId }),
      });
    },
    onSettled: () => {
      handleFeedback();
      setIsProcessing(false);
      navigateToProfileInfoPage();
    },
  });
  const updateProfileMutation = useUpdateProfileMutation({
    onMutate: () => {
      setIsProcessing(true);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: useGetProfileByDidQuery.getKey({ id: profileId }),
      });
    },
    onSettled: () => {
      handleFeedback();
      setIsProcessing(false);
      navigateToProfileInfoPage();
    },
  });

  const myInterestsQueryReq = useGetInterestsByDidQuery(
    { id: profileId },
    { select: response => response.node, enabled: !!profileData?.id },
  );
  const myInterests =
    myInterestsQueryReq.data && 'isViewer' in myInterestsQueryReq.data
      ? myInterestsQueryReq.data.interests
      : null;
  const loginQuery = useGetLogin();

  const background = useMemo(
    () => getProfileImageVersionsWithMediaUrl(profileData?.background),
    [profileData?.background],
  );
  const avatar = useMemo(
    () => getProfileImageVersionsWithMediaUrl(profileData?.avatar),
    [profileData?.avatar],
  );

  if (!loginQuery.data?.id) {
    return navigateTo({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: () => `/${profileId}`,
    });
  }

  if (status === 'loading') return <ProfileLoading />;

  if (status === 'error')
    return (
      <ErrorLoader
        type="script-error"
        title={t('There was an error loading this profile')}
        details={t('We cannot show this profile right now')}
      />
    );

  const modalMessage = t(
    "It looks like you haven't saved your changes, if you leave this page all the changes you made will be gone!",
  );

  const onTabChange = (selectedIndex: number, previousIndex: number) => {
    const canSwitchTab =
      (previousIndex === 0 && !isGeneralFormDirty) ||
      (previousIndex === 1 && !isSocialLinksDirty) ||
      (previousIndex === 2 && !isInterestsListDirty);

    if (selectedIndex != previousIndex) {
      /**
       * if can switch tab, set active and selected tab states,
       * else, set modal to true and set only selected state.
       * the modal will handle the active tab switching
       */
      if (canSwitchTab) {
        setSelectedActiveTab(selectedIndex);
        setActiveTab(selectedIndex);
      } else {
        setShowModal(true);
        setSelectedActiveTab(selectedIndex);
      }
    }
  };

  const navigateToProfileInfoPage = () => {
    navigateTo({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: () => `/${profileId}`,
    });
  };

  const createProfile = async (
    formValues: GeneralFormValues,
    profileImages: Pick<PartialProfileInput, 'avatar' | 'background'>,
  ) => {
    createProfileMutation.mutate({
      i: {
        content: {
          name: formValues.name,
          description: formValues.bio,
          createdAt: new Date().toISOString(),
          ...profileImages,
        },
      },
    });
  };

  const updateGeneralForm = async (
    formValues: GeneralFormValues,
    profileImages: Pick<PartialProfileInput, 'avatar' | 'background'>,
  ) => {
    updateProfileMutation.mutate({
      i: {
        id: profileData.id,
        content: {
          name: formValues.name,
          description: formValues.bio,
          ...profileImages,
        },
      },
    });
  };

  const getProfileImageVersions = (
    avatarImage: PartialProfileInput['avatar'],
    coverImage: PartialProfileInput['background'],
  ) => {
    const avatarImageObj = avatarImage ? { avatar: avatarImage } : {};
    const coverImageObj = coverImage ? { background: coverImage } : {};

    return { ...avatarImageObj, ...coverImageObj };
  };

  return (
    <Stack direction="column" spacing="gap-y-4" customStyle="h-full">
      <Card radius={20} elevation="1" customStyle="py-4 h-full mb-4">
        <Stack direction="column" spacing="gap-y-4" customStyle="h-full">
          <Tab
            labels={[t('General'), t('External URLs'), t('Your interests')]}
            customStyle="h-full"
            bodyStyle="p-4"
            value={activeTab}
            onChange={onTabChange}
          >
            {/* general form tab */}
            <GeneralForm
              defaultValues={
                profileData
                  ? {
                      avatar: null,
                      coverImage: null,
                      name: profileData.name,
                      bio: profileData.description,
                      ens: '',
                      userName: '',
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
                    await createProfile(
                      formValues,
                      getProfileImageVersions(avatarImage, coverImage),
                    );
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
              onFormDirty={setGeneralFormDirty}
              customStyle="h-full"
            />

            {/* social links / external urls tab */}
            <SocialLinks
              title={t('External URLs')}
              addNewButtonLabel={t('Add new')}
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
                label: 'Save',
                loading: isProcessing,
                handleClick: formValues => {
                  if (profileData?.id) {
                    updateProfileMutation.mutate({
                      i: {
                        id: profileData.id,
                        content: {
                          links: formValues.links,
                          createdAt: new Date().toISOString(),
                        },
                      },
                    });
                  }
                },
              }}
              onDelete={() => ({})}
              onFormDirty={setSocialLinksDirty}
              customStyle="h-full"
            />

            {/* interests tab */}
            {/*@TODO: Create loading and error states for interests list */}
            {
              <Interests
                title={t('Your interests')}
                description={t(
                  'Your interests will help refine your social feed and throughout AKASHA World.  You can have a maximum of 10 topics',
                )}
                moreInterestTitle={t('Find more interests')}
                moreInterestDescription={t(
                  'You can find more interests and add them to your list of interests!',
                )}
                moreInterestPlaceholder={t('Search for interests')}
                myInterests={myInterests ? myInterests.topics.map(topic => topic.value) : []}
                interests={[]} /* TODO: when indexed list of interests hook is ready connect it */
                cancelButton={{
                  label: t('Cancel'),
                  disabled: isProcessing,
                  handleClick: () => {
                    navigateToProfileInfoPage();
                  },
                }}
                saveButton={{
                  label: 'Save',
                  loading: isProcessing,
                  handleClick: () => {
                    //@TODO
                  },
                }}
                onFormDirty={setInterestsListDirty}
                customStyle="h-full"
              />
            }
          </Tab>
        </Stack>
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
        <Text variant="body1">{modalMessage}</Text>
      </Modal>
    </Stack>
  );
};

export default EditProfilePage;
