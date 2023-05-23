import * as React from 'react';
import {
  Profile,
  ModalNavigationOptions,
  RootComponentProps,
  UpdateProfileStatus,
} from '@akashaorg/typings/ui';
import {
  FormProfileData,
  UPDATE_PROFILE_STATUS,
  useEnsByAddress,
  useProfileUpdate,
  useQueryListener,
  useUsernameValidation,
  useEnsTexts,
} from '@akashaorg/ui-awf-hooks';
import { useGetMyProfileQuery } from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';
import DS from '@akashaorg/design-system';
import { useTranslation } from 'react-i18next';

const { styled, ProfileForm, Box } = DS;

const Form = styled(ProfileForm)`
  width: 100vw;
`;

export interface ProfileEditProps extends RootComponentProps {
  loggedProfileData: Profile;
  showLoginModal: (redirectTo?: { modal: ModalNavigationOptions }) => void;
}

const ProfileEditPage: React.FC<ProfileEditProps> = props => {
  const [partialUsername, setPartialUsername] = React.useState<string>();
  const [ensPrefillActive, setEnsPrefillActive] = React.useState<boolean>(false);

  const profileDataReq = useGetMyProfileQuery(null, {
    select: resp => {
      return resp.viewer?.profile;
    },
  });
  const loggedProfileData = profileDataReq.data;

  // @TODO replace with new hooks
  // const ENSReq = useEnsByAddress(loggedProfileData?.did?.id);
  // const ensData = React.useMemo<{ name?: string }>(() => {
  //   const ens = {};
  //   if (ENSReq.isSuccess) {
  //     ens['name'] = ENSReq.data;
  //   }
  //   return ens;
  // }, [ENSReq.isSuccess, ENSReq.data]);

  // const ENSTxtData = useEnsTexts(ensData?.name, ensPrefillActive);

  const { t } = useTranslation('app-profile');

  // @TODO replace with new hooks
  const profileUpdateMutation = useProfileUpdate(loggedProfileData?.did?.id);

  const updateStatusKey = React.useMemo(
    () => [UPDATE_PROFILE_STATUS, loggedProfileData?.did?.id],
    [loggedProfileData?.did?.id],
  );

  const updateStatusQuery = useQueryListener<{
    status: UpdateProfileStatus;
    remainingFields: string[];
  }>(updateStatusKey);

  React.useEffect(() => {
    if (
      updateStatusQuery?.data &&
      updateStatusQuery.data.status === UpdateProfileStatus.UPDATE_COMPLETE
    ) {
      props.plugins['@akashaorg/app-routing']?.routing.navigateTo({
        appName: '@akashaorg/app-profile',
        getNavigationUrl: routes => routes.myProfile,
      });
    }
  }, [updateStatusQuery, props.plugins]);

  const handleFormSubmit = (profileData: FormProfileData, changedFields: string[]) => {
    profileUpdateMutation.mutate({ profileData, changedFields });
  };

  const handleCancel = () => {
    props.plugins['@akashaorg/app-routing']?.routing.navigateTo({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: routes => routes.myProfile,
    });
  };

  /**
   * validate username by setting the local state
   * validation hook will do the rest
   */
  const handleUsernameBlur = (userName: string) => {
    setPartialUsername(userName);
  };

  const handleEnsPrefill = () => {
    setEnsPrefillActive(true);
  };

  const usernameValidationQuery = useUsernameValidation(partialUsername);

  const userNameValidationErrors = React.useMemo(() => {
    if (usernameValidationQuery.status === 'success' && !usernameValidationQuery.data) {
      return `${t(
        'Sorry, this username has already been claimed by another Etherean. Please try a different one',
      )}.`;
    }
    if (usernameValidationQuery.status === 'error') {
      return `${t(
        'Sorry, there is an error validating the username. Please try again later',
      )}. Error: ${usernameValidationQuery.error.toString()}`;
    }
    // local username validation
    if (
      partialUsername &&
      partialUsername.length > 0 &&
      // eslint-disable-next-line no-useless-escape
      /^([a-z0-9.](?![0-9].]$))+$/g.test(partialUsername)
    ) {
      if (partialUsername.length < 3) {
        return `${t('Username must be at least 3 characters long')}.`;
      }
    } else {
      if (partialUsername && parseInt(partialUsername.split('').pop())) {
        return `${t('Username cannot end with a number')}.`;
      }
      if (partialUsername) {
        return `${t(
          'Sorry, username can contain lowercase letters, numbers and must end in a letter',
        )}.`;
      }
    }
  }, [usernameValidationQuery, partialUsername, t]);

  return (
    <Box fill="horizontal" margin={{ bottom: '2rem' }}>
      {/* @TODO fix and migrate the DS component */}
      <Form
        isLoading={!profileDataReq.isFetched && !profileDataReq.isLoading}
        modalSlotId={props.layoutConfig.modalSlotId}
        titleLabel={t('Update Profile')}
        avatarLabel={t('Avatar')}
        nameLabel={t('Name')}
        coverImageLabel={t('Cover Image')}
        descriptionLabel={t('About me')}
        socialLinksTitle={t('Social Links')}
        socialLinksButtonLabel={t('Add Social Links')}
        uploadLabel={t('Upload')}
        urlLabel={t('By url')}
        editLabel={t('Edit')}
        editImageSubtitle={t('Drag the image to reposition')}
        cancelLabel={t('Cancel')}
        saveLabel={t('Save')}
        deleteLabel={t('Delete')}
        nameFieldPlaceholder={t('Type your name here')}
        descriptionFieldPlaceholder={t('Add a description about you here')}
        providerData={loggedProfileData}
        onCancel={handleCancel}
        // onSave={handleFormSubmit}
        updateStatus={updateStatusQuery?.data?.status || UpdateProfileStatus.UPDATE_IDLE}
        // showUsername={!profileDataQuery.data?.userName}
        onUsernameBlur={handleUsernameBlur}
        isValidatingUsername={usernameValidationQuery.status === 'loading'}
        usernameSuccess={usernameValidationQuery.data ? ' ' : undefined}
        usernameError={userNameValidationErrors}
        ensPrefillButtonLabel={t('Fill info with ENS data')}
        ensSectionTitle={'ENS'}
        // ensData={ensData}
        onEnsPrefill={handleEnsPrefill}
        loadingDataLabel={t('Loading profile data')}
        // ensPrefillLoading={ENSTxtData.isLoading && !ENSTxtData.isFetched}
        // ensPrefillData={ENSTxtData.data}
      />
    </Box>
  );
};

export default ProfileEditPage;
