import * as React from 'react';
import ReactDOM from 'react-dom';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import singleSpaReact from 'single-spa-react';
import { useLoginState, withProviders } from '@akashaproject/ui-awf-hooks';
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
  const [loginState] = useLoginState({});
  const [partialUsername, setPartialUsername] = React.useState<string>();
  const profileDataQuery = useGetProfile(loginState.pubKey);
  const profileUpdateMutation = useProfileUpdate(loginState.pubKey);
  const usernameValidationQuery = useUsernameValidation(partialUsername);
  const { t } = useTranslation();
  const updateStatusKey = React.useMemo(
    () => [UPDATE_PROFILE_STATUS, loginState.pubKey],
    [loginState.pubKey],
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
  console.log(usernameValidationQuery, '<<< validation query');
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
          updateStatus={updateStatusQuery.data?.status || UpdateProfileStatus.UPDATE_IDLE}
          showUsername={!profileDataQuery.data.userName}
          onUsernameChange={handleUsernameChange}
          onUsernameBlur={handleUsernameChange}
          isValidatingUsername={usernameValidationQuery.status === 'loading'}
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
