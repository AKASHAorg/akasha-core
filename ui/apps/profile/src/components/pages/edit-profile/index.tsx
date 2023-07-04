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
import { useGetLogin } from '@akashaorg/ui-awf-hooks';
import { useQueryClient } from '@tanstack/react-query';
import { getImageObj, saveAndGetImageObj } from '../../utils';
import { useParams } from 'react-router';
import { ProfileLoading } from '@akashaorg/design-system-components/lib/components/Profile';

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
    },
  );

  const status = profileDataReq.status;

  const { profile: profileData } =
    profileDataReq.data && 'isViewer' in profileDataReq.data
      ? profileDataReq.data
      : { profile: null };

  const [activeTab, setActiveTab] = useState(0);
  const [selectedActiveTab, setSelectedActiveTab] = useState(0);
  const [generalValid, setGeneralValid] = useState(true);
  const [socialLinksValid, setSocialLinksValid] = useState(true);
  const [interestsValid, setInterestsValid] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showModal, setShowModal] = useState(false);

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
    { select: response => response.node },
  );
  const myInterests =
    myInterestsQueryReq.data && 'isViewer' in myInterestsQueryReq.data
      ? myInterestsQueryReq.data.interests
      : null;
  const loginQuery = useGetLogin();

  const background = useMemo(() => getImageObj(profileData?.background), [profileData?.background]);
  const avatar = useMemo(() => getImageObj(profileData?.avatar), [profileData?.avatar]);

  if (status === 'loading') return <ProfileLoading />;

  if (!loginQuery.data?.id) {
    return navigateTo({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: () => `/${profileId}`,
    });
  }

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

  const navigateToProfileInfoPage = () => {
    navigateTo({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: () => `/${profileId}`,
    });
  };

  const saveImage = async (avatarImage?: File, coverImage?: File) => {
    setIsProcessing(true);
    const avatarImageObj = await saveAndGetImageObj('avatar', avatarImage);
    const coverImageObj = await saveAndGetImageObj('coverImage', coverImage);

    const avatarObj = avatarImageObj ? { avatar: avatarImageObj } : {};
    const backgroundObj = coverImageObj ? { background: coverImageObj } : {};

    setIsProcessing(false);

    return { avatarObj, backgroundObj };
  };

  const createProfile = async (formValues: GeneralFormValues) => {
    const imageObj = await saveImage(formValues?.avatar, formValues?.coverImage);
    createProfileMutation.mutate({
      i: {
        content: {
          name: formValues.name,
          description: formValues.bio,
          createdAt: new Date().toISOString(),
          ...imageObj.avatarObj,
          ...imageObj.backgroundObj,
        },
      },
    });
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
                onImageDelete: () => {
                  /*TODO: */
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
                    await createProfile(formValues);
                    return;
                  }

                  const imageObj = await saveImage(formValues?.avatar, formValues?.coverImage);
                  updateProfileMutation.mutate({
                    i: {
                      id: profileData.id,
                      content: {
                        name: formValues.name,
                        description: formValues.bio,
                        ...imageObj.avatarObj,
                        ...imageObj.backgroundObj,
                      },
                    },
                  });
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
                onFormValid={setInterestsValid}
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
