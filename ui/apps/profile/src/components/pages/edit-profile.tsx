import React, { useState } from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Tab from '@akashaorg/design-system-core/lib/components/Tab';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Snackbar from '@akashaorg/design-system-core/lib/components/Snackbar';
import Modal from '@akashaorg/design-system-core/lib/components/Modal';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { useTranslation } from 'react-i18next';
import { Profile, RootComponentProps } from '@akashaorg/typings/ui';
import { GeneralForm } from '@akashaorg/design-system-components/lib/components/EditProfile/GeneralForm';
import { SocialLinks } from '@akashaorg/design-system-components/lib/components/EditProfile/SocialLinks';
import { Interests } from '@akashaorg/design-system-components/lib/components/EditProfile/Interests';
import { useUpdateProfileMutation } from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';

type EditProfilePageProps = {
  profileId: string;
  isViewer: boolean;
  profileData: Profile;
};

const EditProfilePage: React.FC<RootComponentProps & EditProfilePageProps> = props => {
  const { profileId, profileData } = props;
  const { t } = useTranslation('app-profile');
  const navigateTo = props.plugins['@akashaorg/app-routing']?.routing?.navigateTo;

  // const ENSReq = useEnsByAddress(profileData.ethAddress);

  const [activeTab, setActiveTab] = useState(0);
  const [selectedActiveTab, setSelectedActiveTab] = useState(0);
  const [generalValid, setGeneralValid] = useState(true);
  const [socialLinksValid, setSocialLinksValid] = useState(true);
  const [interestsValid, setInterestsValid] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const profileMutation = useUpdateProfileMutation();

  const loggedIn =
    false; /* @TODO use a login hook when it's ready to check if user is logged in or not */

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

  if (!loggedIn) {
    return navigateTo({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: () => `/${profileId}`,
    });
  }

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
                coverImage: profileData.background,
                avatar: profileData.avatar,
                profileId: profileData.did.id,
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
              name={{ label: t('Name'), initialValue: profileData.name }}
              // userName={{ label: t('Username'), initialValue: profileData.userName }}
              bio={{ label: t('Bio'), initialValue: profileData.description }}
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
                  navigateTo({
                    appName: '@akashaorg/app-profile',
                    getNavigationUrl: () => `/${profileId}`,
                  });
                },
              }}
              saveButton={{
                label: t('Save'),
                handleClick: formValues => {
                  profileMutation.mutate({
                    i: { id: profileId, content: formValues },
                  });
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
              socialLinks={profileData.links}
              cancelButton={{
                label: t('Cancel'),
                handleClick: () => {
                  navigateTo({
                    appName: '@akashaorg/app-profile',
                    getNavigationUrl: () => `/${profileId}`,
                  });
                },
              }}
              saveButton={{
                label: 'Save',
                handleClick: formValues => {
                  profileMutation.mutate({
                    i: { id: profileId, content: formValues },
                  });
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
                myInterests={[]} /* TODO: when hook is ready connect it */
                interests={[]} /* TODO: when hook is ready connect it */
                cancelButton={{
                  label: t('Cancel'),
                  handleClick: () => {
                    navigateTo({
                      appName: '@akashaorg/app-profile',
                      getNavigationUrl: () => `/${profileId}`,
                    });
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
