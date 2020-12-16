import * as React from 'react';
import DS from '@akashaproject/design-system';
import { MyProfileCard } from '../profile-cards/my-profile-card';
import { RootComponentProps } from '@akashaproject/ui-awf-typings/src';
import { ModalState, ModalStateActions } from '@akashaproject/ui-awf-hooks/lib/use-modal-state';
import { useENSRegistration } from '@akashaproject/ui-awf-hooks';
import { useTranslation } from 'react-i18next';
import { forkJoin } from 'rxjs';
import { IUserNameOption } from '@akashaproject/design-system/lib/components/Cards/form-cards/ens-form-card';


const { styled, Helmet, ModalRenderer, BoxFormCard, EnsFormCard } = DS;

export interface MyProfileProps extends RootComponentProps {
  ethAddress: string | null;
  modalState: ModalState;
  modalActions: ModalStateActions
  profileData: any;
}

const ProfileForm = styled(BoxFormCard)`
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
  const { layout, profileData } = props;
  const { t } = useTranslation();
  const [/* updatingProfile */, setUpdatingProfile] = React.useState({
    isSaving: false,
    uploadingAvatar: false,
    uploadingCover: false
  })
  const [ensState, ensActions] = useENSRegistration({
    profileService: props.sdkModules.profiles.profileService,
    ethAddress: props.ethAddress,
    ensService: props.sdkModules.registry.ens,
    onRegisterSuccess: () => {},
  });

  const onProfileUpdateSubmit = (data: any) => {
    const { avatar, coverImage, name, description } = data;
    const errorHandler = (err: Error) => {
      console.error(err, 'error!');
    }
    setUpdatingProfile(prev => ({
      ...prev,
      isSaving: true,
    }));
    const obs = [];

    if (avatar && avatar !== profileData.avatar) {
      setUpdatingProfile(prev => ({...prev, uploadingAvatar: true}));
      obs.push(props.sdkModules.profiles.profileService.saveMediaFile({
        isUrl: avatar.isUrl,
        content: avatar.src,
        name: 'avatar'
      }));
    } else {
      obs.push(Promise.resolve());
    }

    if (coverImage && coverImage !== profileData.coverImage) {
      setUpdatingProfile(prev => ({ ...prev, uploadingCover: true }));
      obs.push(props.sdkModules.profiles.profileService.saveMediaFile({
        isUrl: coverImage.isUrl,
        content: coverImage.src,
        name: 'coverImage'
      }));
    } else {
      obs.push(Promise.resolve());
    }
    forkJoin(obs).subscribe((responses: any[]) => {
      console.log('images uploaded', responses);
      const [avatarRes, coverImageRes] = responses;
        const providers: any[] = [];

        if (avatarRes) {
          providers.push({
            provider: 'ewa.providers.basic',
            property: 'avatar',
            value: avatarRes.data
          })
        }
        if (coverImageRes) {
          providers.push({
            provider: 'ewa.providers.basic',
            property: 'coverImage',
            value: coverImageRes.data,
          });
        }
        if (description) {
          providers.push({
            provider: 'ewa.providers.basic',
            property: 'description',
            value: description
          });
        }
        if (name) {
          providers.push({
            provider: 'ewa.providers.basic',
            property: 'name',
            value: name,
          });
        }
        const addProviders = props.sdkModules.profiles.profileService.addProfileProvider(providers);
        addProviders.subscribe((res: any) => {
          console.log('providers added', res);
          const makeDefault = providers.map(p => props.sdkModules.profiles.profileService.makeDefaultProvider(p));
          forkJoin(makeDefault).subscribe((res) => {
            console.log('profile updated!', res);
          }, errorHandler);
        }, errorHandler);
    }, errorHandler);
  };

  const cancelProfileUpdate = () => {
    props.modalActions.hide('updateProfile');
  }

  const onENSSubmit = ({ name, option }: { name: string, option: IUserNameOption }) => {
    if(option.name === 'local') {
      return ensActions.registerLocalUsername({ userName: name });
    }
    if (option.name === 'ensSubdomain') {
      return ensActions.register({ userName: name });
    }
  }

  const onENSCancel = () => {
    props.modalActions.hide('changeENS');
  }
  console.log(props.profileData, 'profile data');
  return (
    <div>
      <Helmet>
        <title>Profile | My Page</title>
      </Helmet>
      <MyProfileCard
        profileData={...props.profileData}
        modalState={props.modalState}
        modalActions={props.modalActions}
        canEdit={!!props.ethAddress}
      />
        <ModalRenderer slotId={layout.app.modalSlotId} >
          {props.modalState.updateProfile &&
            props.ethAddress &&
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
                onCancel={cancelProfileUpdate}
              />
            </Overlay>
          }
          {props.modalState.changeENS &&
          props.ethAddress && (
            <Overlay>
              <ENSForm
                titleLabel={t('Add a username')}
                secondaryTitleLabel={t('Secondary Title')}
                nameLabel={t('Select a username')}
                errorLabel={t('Sorry, this username has already been taken. Please choose another one')}
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
                onCancel={onENSCancel}
                validateEns={ensActions.validateName}
                validEns={ensState.isValidating ? null : ensState.isAvailable}
                isValidating={ensState.isValidating}
                userNameProviderOptions={[
                  {
                    name: 'local',
                    label: t('Do not use ENS'),
                  }
                ]}
                disableInputOnOption={{
                  ensSubdomain: ensState.alreadyRegistered
                }}
                errorMessage={ensState.errorMessage}
                registrationStatus={ensState.status}
              />
            </Overlay>
          )}
        </ModalRenderer>
    </div>
  );
};

export default MyProfilePage;
