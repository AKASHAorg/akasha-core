import * as React from 'react';
import { useTranslation } from 'react-i18next';
import DS from '@akashaproject/design-system';
import { IProfileData } from '@akashaproject/design-system/lib/components/Cards/profile-cards/profile-widget-card';
import { RootComponentProps, IAkashaError } from '@akashaproject/ui-awf-typings';
import {
  ModalState,
  ModalStateActions,
  MODAL_NAMES,
} from '@akashaproject/ui-awf-hooks/lib/use-modal-state';
import { useFollow, useENSRegistration, useErrors } from '@akashaproject/ui-awf-hooks';
import { IUserNameOption } from '@akashaproject/design-system/lib/components/Cards/form-cards/ens-form-card';
import { rootRoute } from '../../routes';
import {
  ProfileUpdateStatus,
  UseProfileActions,
} from '@akashaproject/ui-awf-hooks/lib/use-profile';
import { UseLoginActions } from '@akashaproject/ui-awf-hooks/lib/use-login-state';

const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://moderation.ethereum.world'
    : 'https://moderation.akasha.network';

export const BASE_FLAG_URL = `${BASE_URL}/flags`;

const {
  styled,
  ProfileCard,
  ModalRenderer,
  ToastProvider,
  ReportModal,
  ShareModal,
  BoxFormCard,
  EnsFormCard,
  ErrorInfoCard,
} = DS;

export interface IProfileHeaderProps {
  profileId: string;
  profileData: IProfileData;
  profileUpdateStatus: ProfileUpdateStatus;
  profileActions: UseProfileActions;
  loggedUserEthAddress: string | null;
  modalState: ModalState;
  modalActions: ModalStateActions;
  loginActions: UseLoginActions;
}

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

const ENSForm = styled(EnsFormCard)`
  max-width: 100%;
  max-height: 100vh;
  overflow: auto;
  min-height: 100vh;
  @media screen and (min-width: ${props => props.theme.breakpoints.medium.value}px) {
    max-width: 66%;
    max-height: 75%;
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

export const ProfilePageCard = (props: IProfileHeaderProps & RootComponentProps) => {
  const {
    profileData,
    loggedUserEthAddress,
    sdkModules,
    logger,
    profileId,
    globalChannel,
    profileUpdateStatus,
  } = props;

  const [flagged, setFlagged] = React.useState('');

  const { t } = useTranslation();

  const [followedProfiles, followActions] = useFollow({
    globalChannel,
    profileService: sdkModules.profiles.profileService,
    onError: (errorInfo: IAkashaError) => {
      logger.error(errorInfo.error.message, errorInfo.errorKey);
    },
  });

  const [ensErrors, ensErrorActions] = useErrors({ logger: props.logger });

  const [ensState, ensActions] = useENSRegistration({
    profileService: sdkModules.profiles.profileService,
    ethAddress: props.loggedUserEthAddress,
    ensService: sdkModules.registry.ens,
    onError: ensErrorActions.createError,
  });

  React.useEffect(() => {
    if (profileUpdateStatus.updateComplete && props.modalState[MODAL_NAMES.PROFILE_UPDATE]) {
      closeProfileUpdateModal();
      props.profileActions.resetUpdateStatus();
      return;
    }
    if (ensState.status.registrationComplete && props.modalState[MODAL_NAMES.CHANGE_ENS]) {
      if (ensState.userName) {
        props.profileActions.updateProfile({
          userName: `@${ensState.userName.replace('@', '')}`,
        });
      }
      closeEnsModal();
      ensActions.resetRegistrationStatus();
      return;
    }
  }, [
    profileUpdateStatus.updateComplete,
    ensState.status.registrationComplete,
    JSON.stringify(props.modalState),
  ]);

  React.useEffect(() => {
    if (
      loggedUserEthAddress &&
      profileData.ethAddress &&
      loggedUserEthAddress !== profileData.ethAddress
    ) {
      followActions.isFollowing(loggedUserEthAddress, profileData.ethAddress);
    }
  }, [loggedUserEthAddress, profileData.ethAddress]);

  const handleFollow = () => {
    if (!loggedUserEthAddress) {
      return props.modalActions.show(MODAL_NAMES.LOGIN);
    }
    if (profileData?.ethAddress) {
      return followActions.follow(profileData.ethAddress);
    }
  };

  const handleUnfollow = () => {
    if (profileData?.ethAddress) {
      followActions.unfollow(profileData.ethAddress);
    }
  };

  const handleEntryFlag = (entryId: string) => () => {
    setFlagged(entryId);
    props.modalActions.showAfterLogin('reportModal');
  };

  const closeReportModal = () => {
    props.modalActions.hide('reportModal');
  };

  const onProfileUpdateSubmit = (data: any) => {
    props.profileActions.optimisticUpdate(data);
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

  const closeShareModal = () => {
    props.modalActions.hide(MODAL_NAMES.PROFILE_SHARE);
  };

  const showUpdateProfileModal = () => {
    props.modalActions.show(MODAL_NAMES.PROFILE_UPDATE);
  };

  const showEnsModal = () => {
    ensActions.resetRegistrationStatus();
    props.modalActions.show(MODAL_NAMES.CHANGE_ENS);
  };

  const showShareModal = () => {
    props.modalActions.show(MODAL_NAMES.PROFILE_SHARE);
  };

  const url = `${window.location.origin}${rootRoute}/${profileId}`;

  const handleProfileShare = (service: 'twitter' | 'facebook' | 'reddit' | 'copy', url: string) => {
    let shareUrl;
    switch (service) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${url}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'reddit':
        shareUrl = `http://www.reddit.com/submit?url=${url}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        break;
      default:
        break;
    }
    if (shareUrl) {
      window.open(shareUrl, '_blank');
    }
  };

  if (!profileData?.ethAddress) {
    return null;
  }

  const cardData = {
    ...profileData,
  };

  return (
    <>
      <ModalRenderer slotId={props.layout.app.modalSlotId}>
        {props.modalState.reportModal && (
          <ToastProvider autoDismiss={true} autoDismissTimeout={5000}>
            <ReportModal
              titleLabel={t('Report a Profile')}
              successTitleLabel={t('Thank you for helping us keep Ethereum World safe! 🙌')}
              successMessageLabel={t('We will investigate this post and take appropriate action.')}
              optionsTitleLabel={t('Please select a reason')}
              optionLabels={[
                t('Suspicious, deceptive, or spam'),
                t('Abusive or harmful to others'),
                t('Self-harm or suicide'),
                t('Illegal'),
                t('Nudity'),
                t('Violence'),
              ]}
              optionValues={[
                'Suspicious, deceptive, or spam',
                'Abusive or harmful to others',
                'Self-harm or suicide',
                'Illegal',
                'Nudity',
                'Violence',
              ]}
              descriptionLabel={t('Explanation')}
              descriptionPlaceholder={t('Please explain your reason(s)')}
              footerText1Label={t('If you are unsure, you can refer to our ')}
              footerLink1Label={t('Code of Conduct')}
              footerUrl1={'https://akasha.slab.com/public/ethereum-world-code-of-conduct-e7ejzqoo'}
              cancelLabel={t('Cancel')}
              reportLabel={t('Report')}
              blockLabel={t('Block User')}
              closeLabel={t('Close')}
              user={loggedUserEthAddress ? loggedUserEthAddress : ''}
              contentId={profileData.ethAddress ? profileData.ethAddress : flagged}
              contentType="profile"
              baseUrl={BASE_FLAG_URL}
              closeModal={closeReportModal}
            />
          </ToastProvider>
        )}
        {props.modalState.profileShare && (
          <ShareModal
            link={url}
            handleProfileShare={handleProfileShare}
            closeModal={closeShareModal}
          />
        )}
        {props.modalState[MODAL_NAMES.PROFILE_UPDATE] && profileData.ethAddress && (
          <ProfileForm
            titleLabel={t('Ethereum Address')}
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
            ethAddress={profileData.ethAddress}
            providerData={{
              ...profileData,
            }}
            onSave={onProfileUpdateSubmit}
            onCancel={closeProfileUpdateModal}
            updateStatus={profileUpdateStatus}
          />
        )}
        {props.modalState[MODAL_NAMES.CHANGE_ENS] && profileData.ethAddress && (
          <ErrorInfoCard errors={ensErrors}>
            {(errorMessage, hasCriticalErrors) => (
              <>
                {!hasCriticalErrors && (
                  <ENSForm
                    titleLabel={t('Add an Ethereum Name')}
                    nameLabel={t('Select a username')}
                    errorLabel={t(
                      'Sorry, this username has already been taken. Please choose another one',
                    )}
                    options={[
                      {
                        label: t('Use an AKASHA-provided Ethereum name'),
                        value:
                          profileData.userName ??
                          profileData.default.find(
                            p => p.property === 'userName' && p.provider === 'ewa.providers.basic',
                          ),
                      },
                    ]}
                    ethAddressLabel={t('Your Ethereum address')}
                    ethNameLabel={t('Your Ethereum name')}
                    optionUsername={t('username')}
                    optionSpecify={t('Specify an Ethereum name')}
                    optionUseEthereumAddress={t('Use my Ethereum address')}
                    poweredByLabel={t('Username powered by')}
                    iconLabel={t('ENS')}
                    cancelLabel={t('Cancel')}
                    changeButtonLabel={t('Change')}
                    saveLabel={t('Save')}
                    nameFieldPlaceholder={`${t('username')}`}
                    ethAddress={profileData.ethAddress}
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
                    errorMessage={`
                        ${ensState.errorMessage ? ensState.errorMessage : ''}
                        ${
                          errorMessage
                            ? Object.keys(ensErrors).reduce(
                                (str, errKey) => `${str}, ${ensErrors[errKey].error.message}`,
                                '',
                              )
                            : ''
                        }
                        `}
                    registrationStatus={ensState.status}
                  />
                )}
              </>
            )}
          </ErrorInfoCard>
        )}
      </ModalRenderer>
      <ProfileCard
        onClickFollowers={() => null}
        onClickFollowing={() => null}
        onClickPosts={() => null}
        handleFollow={handleFollow}
        handleUnfollow={handleUnfollow}
        handleShareClick={showShareModal}
        isFollowing={followedProfiles.includes(profileData?.ethAddress)}
        loggedEthAddress={loggedUserEthAddress}
        profileData={cardData}
        followLabel={t('Follow')}
        unfollowLabel={t('Unfollow')}
        descriptionLabel={t('About me')}
        followingLabel={t('Following')}
        followersLabel={t('Followers')}
        postsLabel={t('Posts')}
        shareProfileLabel={t('Share')}
        editProfileLabel={t('Edit profile')}
        updateProfileLabel={t('Update profile')}
        changeCoverImageLabel={t('Change cover image')}
        cancelLabel={t('Cancel')}
        saveChangesLabel={t('Save changes')}
        canUserEdit={loggedUserEthAddress === profileData.ethAddress}
        flaggable={loggedUserEthAddress !== profileData.ethAddress}
        // uncomment this to enable report profile
        // flagAsLabel={t('Report Profile')}
        onEntryFlag={handleEntryFlag(profileData.ethAddress ? profileData.ethAddress : '')}
        onUpdateClick={showUpdateProfileModal}
        onENSChangeClick={showEnsModal}
        changeENSLabel={t('Change Ethereum name')}
        hideENSButton={!!profileData.userName}
        copyLabel={t('Copy to clipboard')}
        copiedLabel={t('Copied')}
      />
    </>
  );
};
