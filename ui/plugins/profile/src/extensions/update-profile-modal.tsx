import * as React from 'react';
import ReactDOM from 'react-dom';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import singleSpaReact from 'single-spa-react';
import { useLoginState, withProviders } from '@akashaproject/ui-awf-hooks';
import DS from '@akashaproject/design-system';
import { useGetProfile, useProfileUpdate } from '@akashaproject/ui-awf-hooks/lib/use-profile.new';
import { useUsernameValidation } from '@akashaproject/ui-awf-hooks/lib/use-username.new';
import { useTranslation } from 'react-i18next';
import { ProfileUpdateStatus } from '@akashaproject/design-system/lib/components/BoxFormCard';

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
  max-width: 100%;
  max-height: 100vh;
  overflow: auto;
  min-height: 100vh;
  @media screen and (min-width: ${props => props.theme.breakpoints.medium.value}px) {
    max-width: 66%;
    min-height: max-content;
  }
  @media screen and (min-width: ${props => props.theme.breakpoints.large.value}px) {
    max-width: 50%;
    min-height: max-content;
  }
  @media screen and (min-width: ${props => props.theme.breakpoints.xlarge.value}px) {
    max-width: 33%;
    min-height: max-content;
  }
`;

const UpdateProfileModal: React.FC<RootComponentProps> = props => {
  const [loginState] = useLoginState({});
  const [partialUsername, setPartialUsername] = React.useState<string>();
  const profileDataQuery = useGetProfile(loginState.ready?.pubKey);
  const profileUpdateQuery = useProfileUpdate(loginState.ready?.pubKey);
  const usernameValidationQuery = useUsernameValidation(partialUsername);
  const { t } = useTranslation();

  const onProfileUpdate = (profileData: any) => {
    console.log(profileData, '<<< profile data to update');
  };

  const onModalClose = () => {
    props.singleSpa.navigateToUrl(location.pathname);
  };
  /**
   * validate username by setting the local state
   * validation hook will do the rest
   */
  const handleUsernameChange = (userName: string) => {
    setPartialUsername(userName);
  };

  // compute a general update status
  const updateStatus: ProfileUpdateStatus = React.useMemo(() => {
    return {
      isLoading: false,
      isValidUsername: true,
      isValidating: false,
      saving: false,
      uploadingAvatar: false,
      uploadingCoverImage: false,
      updateComplete: true,
      notAllowed: false,
      tooShort: false,
    };
  }, []);
  console.log(usernameValidationQuery, '<<< username validation query');
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
          onSave={onProfileUpdate}
          onCancel={onModalClose}
          updateStatus={updateStatus}
          showUsername={!profileDataQuery.data.userName}
          onUsernameChange={handleUsernameChange}
          onUsernameBlur={handleUsernameChange}
          isValidatingUsername={usernameValidationQuery.status !== 'success'}
          // usernameSuccess={props.profileUpdateStatus.isValidUsername ? ' ' : undefined}
          usernameError={
            usernameValidationQuery.status === 'error'
              ? (usernameValidationQuery.error as Error).message
              : undefined
          }
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
      props.logger.error(error, errorInfo);
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
