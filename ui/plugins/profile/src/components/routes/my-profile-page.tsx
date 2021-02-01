import * as React from 'react';
import DS from '@akashaproject/design-system';
import { MyProfileCard } from '../profile-cards/my-profile-card';
import { RootComponentProps } from '@akashaproject/ui-awf-typings/src';
import { ModalState, ModalStateActions } from '@akashaproject/ui-awf-hooks/lib/use-modal-state';
import { useENSRegistration } from '@akashaproject/ui-awf-hooks';
import { useTranslation } from 'react-i18next';
import { IUserNameOption } from '@akashaproject/design-system/lib/components/Cards/form-cards/ens-form-card';
import { UseLoginActions, UseLoginState } from '@akashaproject/ui-awf-hooks/lib/use-login-state';
import { UseProfileActions } from '@akashaproject/ui-awf-hooks/lib/use-profile';

const { styled, Helmet, ModalRenderer, BoxFormCard, EnsFormCard, Box } = DS;

const MODAL_NAMES = {
  PROFILE_UPDATE: 'profileUpdate',
  CHANGE_ENS: 'changeENS',
};

export interface MyProfileProps extends RootComponentProps {
  ethAddress: string | null;
  modalState: ModalState;
  modalActions: ModalStateActions;
  profileData: any;
  loginActions: UseLoginActions & UseProfileActions;
  profileUpdateStatus: UseLoginState['updateStatus'];
}

const ProfileForm = styled(BoxFormCard)`
  max-width: 100%;
  max-height: 100vh;
  min-height: max-content;
  overflow: auto;
  animation: fadeInAnimation ease 0.8s;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
  @media screen and (min-width: ${props => props.theme.breakpoints.medium.value}px) {
    max-width: 66%;
  }
  @media screen and (min-width: ${props => props.theme.breakpoints.large.value}px) {
    max-width: 50%;
  }
  @media screen and (min-width: ${props => props.theme.breakpoints.xlarge.value}px) {
    max-width: 33%;
  }
  @keyframes fadeInAnimation {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`;

const ENSForm = styled(EnsFormCard)`
  max-width: 100%;
  max-height: 100vh;
  animation: fadeInAnimation ease 0.8s;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
  @media screen and (min-width: ${props => props.theme.breakpoints.medium.value}px) {
    max-width: 66%;
    max-height: 75%;
  }
  @keyframes fadeInAnimation {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`;

const Overlay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  inset: 0;
  opacity: 1;
  background-color: ${props => props.theme.colors.modalBackground};
  animation: fadeAnimation ease 0.4s;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
`;

const MyProfilePage = (props: MyProfileProps) => {
  const { layout, profileUpdateStatus } = props;
  const { t } = useTranslation();

  const [ensState, ensActions] = useENSRegistration({
    profileService: props.sdkModules.profiles.profileService,
    ethAddress: props.ethAddress,
    ensService: props.sdkModules.registry.ens,
  });

  const prevEthAddress = React.useRef<string | null>(null);

  React.useEffect(() => {
    if (profileUpdateStatus.updateComplete && props.modalState[MODAL_NAMES.PROFILE_UPDATE]) {
      closeProfileUpdateModal();
      return;
    }
    if (ensState.status.registrationComplete && props.modalState[MODAL_NAMES.CHANGE_ENS]) {
      if (ensState.userName) {
        props.loginActions.updateProfile({ userName: `@${ensState.userName.replace('@', '')}` });
      }
      closeEnsModal();
      return;
    }
  }, [
    profileUpdateStatus.updateComplete,
    ensState.status.registrationComplete,
    JSON.stringify(props.modalState),
  ]);

  React.useEffect(() => {
    if (!props.ethAddress && prevEthAddress.current) {
      props.singleSpa.navigateToUrl('/');
    }
    if (!prevEthAddress.current && props.ethAddress) {
      prevEthAddress.current = props.ethAddress;
    }
  }, [props.ethAddress]);
  const onProfileUpdateSubmit = (data: any) => {
    props.loginActions.optimisticUpdate(data);
  };

  const closeProfileUpdateModal = () => {
    props.modalActions.hide(MODAL_NAMES.PROFILE_UPDATE);
  };

  const onENSSubmit = ({ name, option }: { name: string; option: IUserNameOption }) => {
    if (option.name === 'local') {
      return ensActions.registerLocalUsername({ userName: name });
    }
    if (option.name === 'ensSubdomain') {
      return ensActions.register({ userName: name });
    }
  };

  const closeEnsModal = () => {
    props.modalActions.hide(MODAL_NAMES.CHANGE_ENS);
  };
  const handleModalShow = (name: string) => {
    if (name === MODAL_NAMES.PROFILE_UPDATE) {
      props.loginActions.resetUpdateStatus();
    }
    if (name === MODAL_NAMES.CHANGE_ENS) {
      ensActions.resetRegistrationStatus();
    }
    props.modalActions.show(name);
  };

  return (
    <Box fill="horizontal" margin={{ top: '.5rem' }}>
      <Helmet>
        <title>Profile | My Page</title>
      </Helmet>
      <MyProfileCard
        profileData={props.profileData}
        onModalShow={handleModalShow}
        canEdit={!!props.ethAddress}
        userName={props.profileData.userName}
        profileModalName={MODAL_NAMES.PROFILE_UPDATE}
        ensModalName={MODAL_NAMES.CHANGE_ENS}
      />
      <ModalRenderer slotId={layout.app.modalSlotId}>
        {props.modalState[MODAL_NAMES.PROFILE_UPDATE] && props.ethAddress && (
          <Overlay>
            <ProfileForm
              titleLabel={t('Ethereum Address')}
              avatarLabel={t('Avatar')}
              nameLabel={t('Name')}
              coverImageLabel={t('Cover Image')}
              descriptionLabel={t('Description')}
              uploadLabel={t('Upload')}
              urlLabel={t('By url')}
              cancelLabel={t('Cancel')}
              saveLabel={t('Save')}
              deleteLabel={t('Delete')}
              nameFieldPlaceholder={t('Type your name here')}
              descriptionFieldPlaceholder={t('Add a description about you here')}
              ethAddress={props.ethAddress}
              providerData={{
                ...props.profileData,
              }}
              onSave={onProfileUpdateSubmit}
              onCancel={closeProfileUpdateModal}
              updateStatus={profileUpdateStatus}
            />
          </Overlay>
        )}
        {props.modalState[MODAL_NAMES.CHANGE_ENS] && props.ethAddress && (
          <Overlay>
            <ENSForm
              titleLabel={t('Add a username')}
              secondaryTitleLabel={t('Secondary Title')}
              nameLabel={t('Select a username')}
              errorLabel={t(
                'Sorry, this username has already been taken. Please choose another one',
              )}
              ethAddressLabel={t('Your Ethereum Address')}
              ethNameLabel={t('Your Ethereum Name')}
              optionUsername={t('username')}
              optionSpecify={t('Specify an Ethereum name')}
              optionUseEthereumAddress={t('Use my Ethereum address')}
              consentText={t('By creating an account you agree to the ')}
              consentUrl="https://ethereum.world/community-agreement"
              consentLabel={t('Community Agreement')}
              poweredByLabel={t('Username powered by')}
              iconLabel={t('ENS')}
              cancelLabel={t('Cancel')}
              changeButtonLabel={t('Change')}
              saveLabel={t('Save')}
              nameFieldPlaceholder={`${t('username')}`}
              ethAddress={props.ethAddress}
              providerData={{ name: ensState.userName || '' }}
              onSave={onENSSubmit}
              onCancel={closeEnsModal}
              validateEns={ensActions.validateName}
              validEns={ensState.isValidating ? null : ensState.isAvailable}
              isValidating={ensState.isValidating}
              userNameProviderOptions={[
                {
                  name: 'local',
                  label: t('Do not use ENS'),
                },
              ]}
              disableInputOnOption={{
                ensSubdomain: ensState.alreadyRegistered,
              }}
              errorMessage={ensState.errorMessage}
              registrationStatus={ensState.status}
            />
          </Overlay>
        )}
      </ModalRenderer>
    </Box>
  );
};

export default MyProfilePage;
