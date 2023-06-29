import React, { useState } from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Tab from '@akashaorg/design-system-core/lib/components/Tab';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Snackbar from '@akashaorg/design-system-core/lib/components/Snackbar';
import Modal from '@akashaorg/design-system-core/lib/components/Modal';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { useTranslation } from 'react-i18next';
import { Profile, RootComponentProps } from '@akashaorg/typings/ui';
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
import { getMediaUrl, useGetLogin } from '@akashaorg/ui-awf-hooks';
import { useQueryClient } from '@tanstack/react-query';
import { saveMediaFile } from '../saveMedia';

export const MEDIA_UPLOAD_EMAIL = '@mediaUploadEmail';

type EditProfilePageProps = {
  profileId: string;
  isViewer: boolean;
  profileData: Profile;
};

const EditProfilePage: React.FC<RootComponentProps & EditProfilePageProps> = props => {
  const { t } = useTranslation('app-profile');
  const { profileId, profileData, plugins, logger } = props;
  const navigateTo = plugins['@akashaorg/app-routing']?.routing?.navigateTo;

  // const ENSReq = useEnsByAddress(profileData.ethAddress);

  const [activeTab, setActiveTab] = useState(0);
  const [selectedActiveTab, setSelectedActiveTab] = useState(0);
  const [generalValid, setGeneralValid] = useState(true);
  const [socialLinksValid, setSocialLinksValid] = useState(true);
  const [interestsValid, setInterestsValid] = useState(true);
  const [isAvatarSaving, setIsAvatarSaving] = useState(false);
  const [isCoverImageSaving, setIsCoverImageSaving] = useState(false);

  const queryClient = useQueryClient();

  const [showModal, setShowModal] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const createProfileMutation = useCreateProfileMutation();
  const updateProfileMutation = useUpdateProfileMutation({
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: useGetProfileByDidQuery.getKey({ id: profileId }),
      });
    },
  });

  const myInterestsQueryReq = useGetInterestsByDidQuery(
    { id: profileId },
    { select: response => response.node },
  );

  const myInterests =
    myInterestsQueryReq.data && 'isViewer' in myInterestsQueryReq.data
      ? myInterestsQueryReq.data.interests
      : null;

  const loginQuery = useGetLogin();

  const modalMessage = t(
    "It looks like you haven't saved your changes, if you leave this page all the changes you made will be gone!",
  );

  const handleFeedback = () => {
    setShowFeedback(true);
    setTimeout(() => {
      setShowFeedback(false);
    }, 5000);
  };

  const onTabChange = (selectedIndex: number, previousIndex: number) => {
    if (selectedIndex != previousIndex) {
      //check if one of the forms has invalid state
      if (!generalValid || !socialLinksValid || !interestsValid) {
        setShowModal(true);
        setSelectedActiveTab(selectedIndex);
        return;
      }
      setActiveTab(selectedIndex);
    }
  };

  if (!loginQuery.data?.id) {
    return navigateTo({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: () => `/${profileId}`,
    });
  }

  const navigateToProfileInfoPage = () => {
    navigateTo({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: () => `/${profileId}`,
    });
  };

  const createProfile = (formValues: GeneralFormValues) => {
    const avatarObj = getAvatarObj(formValues.avatar);
    const coverImageObj = getCoverImageObj(formValues.coverImage);
    createProfileMutation.mutate({
      i: {
        content: {
          name: formValues.name,
          description: formValues.bio,
          createdAt: new Date().toISOString(),
          ...avatarObj,
          ...coverImageObj,
        },
      },
    });
  };

  const saveAvatarImage = async (avatar: GeneralFormValues['avatar']) => {
    const mediaUploadEmail = window.localStorage.getItem(MEDIA_UPLOAD_EMAIL);

    if (!mediaUploadEmail) return null;

    setIsAvatarSaving(true);
    try {
      const avatarMediaFile = await saveMediaFile({
        isUrl: false,
        content: avatar,
        name: 'avatar',
        email: mediaUploadEmail,
      });
      setIsAvatarSaving(false);
      return avatarMediaFile;
    } catch (ex) {
      logger.error(ex);
      setIsAvatarSaving(false);
      return null;
    }
  };

  const saveCoverImage = async (coverImage: GeneralFormValues['avatar']) => {
    const mediaUploadEmail = window.localStorage.getItem(MEDIA_UPLOAD_EMAIL);

    if (!mediaUploadEmail) return null;

    setIsCoverImageSaving(true);
    try {
      const coverImageMediaFile = await saveMediaFile({
        isUrl: false,
        content: coverImage,
        name: 'coverImage',
        email: mediaUploadEmail,
      });
      setIsCoverImageSaving(false);
      return coverImageMediaFile;
    } catch (ex) {
      logger.error(ex);
      setIsCoverImageSaving(false);
      return null;
    }
  };

  const getAvatarObj = async (avatar?: GeneralFormValues['avatar']) => {
    if (!avatar) return {};

    const avatarMediaFile = await saveAvatarImage(avatar);

    if (!avatarMediaFile) return {};

    const avatarMediaUri = `ipfs://${avatarMediaFile.CID}`;

    return {
      avatar: {
        default: {
          height: avatarMediaFile.size.height,
          width: avatarMediaFile.size.width,
          src: avatarMediaUri,
        },
      },
    };
  };

  const getCoverImageObj = async (coverImage?: GeneralFormValues['coverImage']) => {
    if (!coverImage) return {};

    const coverImageMediaFile = await saveCoverImage(coverImage);
    const coverImageMediaUri = `ipfs://${coverImageMediaFile.CID}`;

    return {
      background: {
        default: {
          height: coverImageMediaFile.size.height,
          width: coverImageMediaFile.size.width,
          src: coverImageMediaUri,
        },
      },
    };
  };

  const backgroundSrc = getMediaUrl(profileData.background.default.src);

  const avatarSrc = getMediaUrl(profileData.avatar.default.src);

  const background = profileData?.background
    ? {
        default: {
          ...profileData.background.default,
          src: backgroundSrc.originLink || backgroundSrc.fallbackLink,
        },
      }
    : null;

  const avatar = profileData?.avatar
    ? {
        default: {
          ...profileData.avatar.default,
          src: avatarSrc.originLink || avatarSrc.fallbackLink,
        },
      }
    : null;

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
            <GeneralForm
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
                handleClick: () => {
                  navigateToProfileInfoPage();
                },
              }}
              saveButton={{
                label: t('Save'),
                loading: isAvatarSaving || isCoverImageSaving,
                handleClick: async formValues => {
                  if (!profileData?.id) {
                    createProfile(formValues);
                    return;
                  }
                  const avatarObj = await getAvatarObj(formValues.avatar);
                  const coverImageObj = await getCoverImageObj(formValues.coverImage);
                  updateProfileMutation.mutate({
                    i: {
                      id: profileData.id,
                      content: {
                        name: formValues.name,
                        description: formValues.bio,
                        createdAt: new Date().toISOString(),
                        ...avatarObj,
                        ...coverImageObj,
                      },
                    },
                  });
                  navigateToProfileInfoPage();
                  handleFeedback();
                },
              }}
              onFormValid={setGeneralValid}
              customStyle="h-full"
            />
            <SocialLinks
              title={t('External URLs')}
              addNewButtonLabel={t('Add new')}
              description={t(
                'You can add your personal websites or social links to be shared on your profile',
              )}
              socialLinks={profileData?.links || []}
              cancelButton={{
                label: t('Cancel'),
                handleClick: () => {
                  navigateToProfileInfoPage();
                },
              }}
              saveButton={{
                label: 'Save',
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
                  navigateToProfileInfoPage();
                  handleFeedback();
                },
              }}
              onDelete={() => ({})}
              onFormValid={setSocialLinksValid}
              customStyle="h-full"
            />
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
                  handleClick: () => {
                    navigateToProfileInfoPage();
                  },
                }}
                saveButton={{
                  label: 'Save',
                  handleClick: () => {
                    //@TODO
                    handleFeedback();
                  },
                }}
                onFormValid={setInterestsValid}
                customStyle="h-full"
              />
            }
          </Tab>
        </Stack>
      </Card>
      {showFeedback && (
        <Snackbar
          title={t('Profile updated successfully')}
          type="success"
          iconType="CheckCircleIcon"
          handleDismiss={() => {
            setShowFeedback(false);
          }}
          customStyle="mb-4"
        />
      )}
      <Modal
        title={{ label: t('Unsaved Changes') }}
        show={showModal}
        onClose={() => {
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
