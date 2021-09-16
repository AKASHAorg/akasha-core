import * as React from 'react';
import ReactDOM from 'react-dom';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import singleSpaReact from 'single-spa-react';
import { withProviders } from '@akashaproject/ui-awf-hooks';
import DS from '@akashaproject/design-system';
import {
  useGetProfile,
  useProfileUpdate,
  FormProfileData,
  UPDATE_PROFILE_STATUS,
} from '@akashaproject/ui-awf-hooks/lib/use-profile.new';
import { useUsernameValidation } from '@akashaproject/ui-awf-hooks/lib/use-username.new';
import { useTranslation } from 'react-i18next';
import { useQueryListener } from '@akashaproject/ui-awf-hooks/lib/use-query-listener';
import { UpdateProfileStatus } from '@akashaproject/ui-awf-typings/lib/profile';
import { useGetLogin } from '@akashaproject/ui-awf-hooks/lib/use-login.new';

const {
  ThemeSelector,
  lightTheme,
  darkTheme,
  ErrorLoader,
  ModalContainer,
  styled,
  BoxFormCard,
  Box,
  Spinner,
  ModalCard,
  Text,
} = DS;

const ProfileForm = styled(BoxFormCard)`
  width: 100vw;
  height: 100vh;
  overflow: auto;
  align-self: center;
  @media screen and (min-width: ${props => props.theme.breakpoints.medium.value}px) {
    max-width: 66vw;
  }
  @media screen and (min-width: ${props => props.theme.breakpoints.large.value}px) {
    max-width: 50vw;
  }
  @media screen and (min-width: ${props => props.theme.breakpoints.xlarge.value}px) {
    max-width: 33vw;
  }
`;

const UpdateProfileModal: React.FC<RootComponentProps> = props => {
  const loginQuery = useGetLogin();
  const [partialUsername, setPartialUsername] = React.useState<string>();
  const profileDataQuery = useGetProfile(loginQuery.data.pubKey);
  const profileUpdateMutation = useProfileUpdate(loginQuery.data.pubKey);
  const usernameValidationQuery = useUsernameValidation(partialUsername);
  const { t } = useTranslation();
  const updateStatusKey = React.useMemo(
    () => [UPDATE_PROFILE_STATUS, loginQuery.data.pubKey],
    [loginQuery.data.pubKey],
  );
  const updateStatusQuery = useQueryListener<{
    status: UpdateProfileStatus;
    remainingFields: string[];
  }>(updateStatusKey);

  const onModalClose = React.useMemo(
    () => () => {
      profileUpdateMutation.reset();
      props.singleSpa.navigateToUrl(location.pathname);
    },
    [props.singleSpa, profileUpdateMutation],
  );
  React.useEffect(() => {
    if (
      updateStatusQuery?.data &&
      updateStatusQuery.data.status === UpdateProfileStatus.UPDATE_COMPLETE
    ) {
      onModalClose();
    }
  }, [updateStatusQuery, onModalClose]);

  const handleFormSubmit = (profileData: FormProfileData, changedFields: string[]) => {
    profileUpdateMutation.mutate({ profileData, changedFields });
  };

  /**
   * validate username by setting the local state
   * validation hook will do the rest
   */
  const handleUsernameChange = (userName: string) => {
    setPartialUsername(userName);
  };

  const userNameValidationErrors = React.useMemo(() => {
    if (usernameValidationQuery.status === 'success' && !usernameValidationQuery.data) {
      return t(
        'Sorry, this username has already beed claimed by another Etherean. Please try a different one.',
      );
    }
    if (usernameValidationQuery.status === 'error') {
      return t('Sorry, there is an error validating the username. Please try again later.');
    }
    // local username validation
    if (
      partialUsername &&
      partialUsername.length > 0 &&
      // eslint-disable-next-line no-useless-escape
      /^([a-z0-9.](?![0-9].]$))+$/g.test(partialUsername)
    ) {
      if (partialUsername.length < 3) {
        return t('Username must be at least 3 characters long.');
      }
    } else {
      if (partialUsername && parseInt(partialUsername.split('').pop())) {
        return t('Username cannot end with a number.');
      }
      if (partialUsername) {
        return t(
          'Sorry, username can contain lowercase letters, numbers and must end in a letter.',
        );
      }
    }
  }, [usernameValidationQuery, partialUsername, t]);

  return (
    <ModalContainer>
      {profileDataQuery.status !== 'success' && (
        <ModalCard>
          <Box align="center" pad="medium">
            <Box>
              <Text size="medium" color="grey">
                {`${t('Loading profile data')}... ${t('Please wait')}.`}
              </Text>
            </Box>
            <Spinner size={24} />
          </Box>
        </ModalCard>
      )}
      {profileDataQuery.status === 'success' && (
        <ProfileForm
          titleLabel={profileDataQuery.data.userName ? t('Update Profile') : t('Create Profile')}
          avatarLabel={t('Avatar')}
          nameLabel={t('Name')}
          coverImageLabel={t('Cover Image')}
          descriptionLabel={t('About me')}
          uploadLabel={t('Upload')}
          urlLabel={t('By url')}
          cancelLabel={t('Cancel')}
          saveLabel={t('Save')}
          deleteLabel={t('Delete')}
          nameFieldPlaceholder={t('Type your name here')}
          descriptionFieldPlaceholder={t('Add a description about you here')}
          ethAddress={profileDataQuery.data.ethAddress}
          providerData={profileDataQuery.data}
          onSave={handleFormSubmit}
          onCancel={onModalClose}
          updateStatus={updateStatusQuery?.data?.status || UpdateProfileStatus.UPDATE_IDLE}
          showUsername={!profileDataQuery.data.userName}
          onUsernameChange={handleUsernameChange}
          onUsernameBlur={handleUsernameChange}
          isValidatingUsername={usernameValidationQuery.status === 'loading'}
          usernameSuccess={usernameValidationQuery.data ? ' ' : undefined}
          usernameError={userNameValidationErrors}
        />
      )}
    </ModalContainer>
  );
};

const reactLifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: withProviders(UpdateProfileModal),
  errorBoundary: (error, errorInfo, props: RootComponentProps) => {
    if (props.logger) {
      props.logger.error(`${JSON.stringify(error)}, ${errorInfo}`);
    }
    return (
      <ThemeSelector
        availableThemes={[lightTheme, darkTheme]}
        settings={{ activeTheme: 'LightTheme' }}
      >
        <ErrorLoader
          type="script-error"
          title="Error in update profile modal"
          details={error.message}
        />
      </ThemeSelector>
    );
  },
});

export const bootstrap = reactLifecycles.bootstrap;

export const mount = reactLifecycles.mount;

export const unmount = reactLifecycles.unmount;
