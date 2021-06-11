import * as React from 'react';
import { useTranslation } from 'react-i18next';
import DS from '@akashaproject/design-system';
import { RootComponentProps, IAkashaError } from '@akashaproject/ui-awf-typings';
import {
  ModalState,
  ModalStateActions,
  MODAL_NAMES,
} from '@akashaproject/ui-awf-hooks/lib/use-modal-state';
import {
  useFollow,
  useENSRegistration,
  useErrors,
  useNetworkState,
  constants,
} from '@akashaproject/ui-awf-hooks';
import {
  ENSOptionTypes,
  EnsFormOption,
} from '@akashaproject/design-system/lib/components/EnsFormCard';
import menuRoute, { rootRoute, MY_PROFILE } from '../../routes';
import {
  ProfileUpdateStatus,
  UseProfileActions,
} from '@akashaproject/ui-awf-hooks/lib/use-profile';
import { UseLoginActions } from '@akashaproject/ui-awf-hooks/lib/use-login-state';
import { Route, useLocation } from 'react-router';
import {
  ProfileProviders,
  UsernameTypes,
  IProfileData,
  IProfileProvider,
} from '@akashaproject/ui-awf-typings/lib/profile';

const {
  styled,
  ProfileCard,
  ModalRenderer,
  ToastProvider,
  ReportModal,
  ShareModal,
  ProfileCompletedModal,
  BoxFormCard,
  EnsFormCard,
  ErrorInfoCard,
  ErrorLoader,
  Icon,
  StyledLayer,
} = DS;

export interface IProfileHeaderProps {
  profileId: string;
  profileState: Partial<IProfileData & { isLoading: boolean }>;
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

type ProfilePageCardProps = IProfileHeaderProps &
  Omit<
    RootComponentProps,
    | 'domElement'
    | 'events'
    | 'getMenuItems'
    | 'i18n'
    | 'isMobile'
    | 'activeWhen'
    | 'i18nConfig'
    | 'mountParcel'
    | 'name'
    | 'rootNodeId'
    | 'unmountSelf'
  >;

export const ProfilePageCard: React.FC<ProfilePageCardProps> = props => {
  const {
    profileState,
    loggedUserEthAddress,
    sdkModules,
    logger,
    profileId,
    globalChannel,
    profileUpdateStatus,
  } = props;

  const [flagged, setFlagged] = React.useState('');
  const [flaggedContentType, setFlaggedContentType] = React.useState('');

  const [isRegistration, setIsRegistration] = React.useState<boolean>(false);

  const location = useLocation();

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

  const [networkState, networkActions] = useNetworkState({
    web3Service: sdkModules.commons.web3Service,
  });

  React.useEffect(() => {
    if (profileUpdateStatus.updateComplete && !isRegistration) {
      handleModalClose();
    }
    if (ensState.status.registrationComplete) {
      ensActions.resetRegistrationStatus();
      props.profileActions.getProfileData({ pubKey: profileId });
      props.singleSpa.navigateToUrl(menuRoute[MY_PROFILE]);
      return;
    }
  }, [profileUpdateStatus.updateComplete, ensState.status.registrationComplete]);

  React.useEffect(() => {
    if (
      location.pathname === `${menuRoute[MY_PROFILE]}/update-info` &&
      profileState.ethAddress &&
      !profileUpdateStatus.updateComplete
    ) {
      if (!profileState.userName) {
        setIsRegistration(true);
      }
    }
  }, [profileState.ethAddress, profileState.userName, profileUpdateStatus, location]);

  React.useEffect(() => {
    if (
      loggedUserEthAddress &&
      profileState.ethAddress &&
      loggedUserEthAddress !== profileState.ethAddress
    ) {
      followActions.isFollowing(loggedUserEthAddress, profileState.ethAddress);
    }
    if (loggedUserEthAddress) {
      networkActions.checkNetwork();
    }
  }, [loggedUserEthAddress, profileState.ethAddress]);

  const handleModalClose = () => {
    setIsRegistration(false);
    props.profileActions.resetUpdateStatus();
    props.singleSpa.navigateToUrl(menuRoute[MY_PROFILE]);
    return;
  };
  const userNameType = React.useMemo(() => {
    if (loggedUserEthAddress && loggedUserEthAddress === profileState.ethAddress) {
      return props.profileActions.getUsernameTypes();
    }
    return { available: [] };
  }, [JSON.stringify(profileState)]);

  const ensFormOptions: EnsFormOption[] = React.useMemo(() => {
    const options: EnsFormOption[] = [];

    const hasEnsSubdomainAvail = userNameType.available.includes(
      UsernameTypes.AKASHA_ENS_SUBDOMAIN,
    );
    const hasEnsDomainAvail = userNameType.available.includes(UsernameTypes.ENS_DOMAIN);
    const detectedEns = ensState.userName;
    const currentDefault = userNameType.default;

    /**
     * Show akasha subdomain option if it's not using ens domain
     */
    if (
      hasEnsSubdomainAvail ||
      detectedEns?.endsWith('.akasha.eth') ||
      currentDefault?.provider === ProfileProviders.ENS ||
      currentDefault?.provider === ProfileProviders.EWA_BASIC
    ) {
      options.push({
        type: ENSOptionTypes.ENS_AKASHA_SUBDOMAIN,
        label: userNameType.available.includes(UsernameTypes.AKASHA_ENS_SUBDOMAIN)
          ? t('Display my AKASHA Ethereum name')
          : t('Use an AKASHA-provided Ethereum name'),
        value: `${profileState.userName}.akasha.eth`,
        defaultChecked: !options.length,
        textDetails: userNameType.available.includes(UsernameTypes.AKASHA_ENS_SUBDOMAIN) ? (
          <></>
        ) : (
          <>
            {t('Username Powered by')}{' '}
            <Icon
              type="appEns"
              size="xs"
              wrapperStyle={{ display: 'inline', verticalAlign: 'middle' }}
            />{' '}
            <strong>ENS</strong>.{' '}
            {t('You will need to pay gas fees to register this Ethereum name.')}
          </>
        ),
      });
    }
    /**
     * Show ens domain options if we detect one and it's not already set
     */
    if (
      hasEnsDomainAvail ||
      (!userNameType.default?.value.endsWith('.eth') &&
        detectedEns &&
        !detectedEns.endsWith('.akasha.eth'))
    ) {
      options.push({
        type: ENSOptionTypes.BRING_YOUR_OWN_ENS,
        label: t('Use my own Ethereum name'),
        value: ensState.userName as string,
        defaultChecked: !options.length,
      });
    }
    /**
     * Show ethAddress option if the user aready have akasha subdomain or ens domain
     */
    if (hasEnsSubdomainAvail || hasEnsDomainAvail) {
      options.push({
        type: ENSOptionTypes.ETH_ADDRESS,
        label: t('Display only my Ethereum address'),
        value: profileState.ethAddress as string,
        defaultChecked: !options.length,
      });
    }
    return options;
  }, [profileState, ensState, userNameType]);

  const handleFollow = () => {
    if (!loggedUserEthAddress) {
      return props.modalActions.show(MODAL_NAMES.LOGIN);
    }
    if (profileState?.ethAddress) {
      return followActions.follow(profileState.ethAddress);
    }
  };

  const handleUnfollow = () => {
    if (profileState?.ethAddress) {
      followActions.unfollow(profileState.ethAddress);
    }
  };

  const handleEntryFlag = (entryId: string, contentType: string) => () => {
    setFlagged(entryId);
    setFlaggedContentType(contentType);
    props.modalActions.showAfterLogin('reportModal');
  };

  const closeReportModal = () => {
    props.modalActions.hide('reportModal');
  };

  const onProfileUpdateSubmit = (data: any) => {
    props.profileActions.optimisticUpdate(data);
  };

  const closeProfileUpdateModal = () => {
    props.singleSpa.navigateToUrl(menuRoute[MY_PROFILE]);
  };

  const onENSSubmit = (option: EnsFormOption) => {
    let selectedOption: EnsFormOption | undefined = option;

    if (!selectedOption) {
      selectedOption = ensFormOptions.find(option => option.defaultChecked);
    }

    if (!selectedOption) {
      logger.error('Selected option is undefined!');
      return;
    }

    if (
      selectedOption.type === ENSOptionTypes.ENS_AKASHA_SUBDOMAIN &&
      selectedOption.value &&
      !userNameType.available.includes(UsernameTypes.AKASHA_ENS_SUBDOMAIN)
    ) {
      return ensActions.register({ userName: selectedOption.value });
    }
    if (
      selectedOption.type === ENSOptionTypes.ENS_AKASHA_SUBDOMAIN &&
      selectedOption.value &&
      userNameType.available.includes(UsernameTypes.AKASHA_ENS_SUBDOMAIN)
    ) {
      return props.profileActions.updateUsernameProvider({
        userName: selectedOption.value,
        provider: ProfileProviders.ENS,
      });
    }
    if (selectedOption.type === ENSOptionTypes.BRING_YOUR_OWN_ENS && selectedOption.value) {
      return props.profileActions.updateUsernameProvider({
        userName: selectedOption.value,
        provider: ProfileProviders.ENS,
      });
    }

    if (selectedOption.type === ENSOptionTypes.ETH_ADDRESS) {
      return props.profileActions.updateUsernameProvider({
        userName: '',
        provider: ProfileProviders.EWA_BASIC,
      });
    }
  };

  const closeEnsModal = () => {
    props.singleSpa.navigateToUrl(menuRoute[MY_PROFILE]);
  };

  const closeShareModal = () => {
    props.modalActions.hide(MODAL_NAMES.PROFILE_SHARE);
  };

  const showUpdateProfileModal = () => {
    props.singleSpa.navigateToUrl(`${menuRoute[MY_PROFILE]}/update-info`);
  };

  const showEnsModal = () => {
    ensActions.resetRegistrationStatus();
    props.singleSpa.navigateToUrl(`${menuRoute[MY_PROFILE]}/update-ens`);
  };

  const showShareModal = () => {
    props.modalActions.show(MODAL_NAMES.PROFILE_SHARE);
  };

  const validateUsername = (userName: string) => {
    if (userName.length > 3) {
      props.profileActions.validateUsername({ userName });
    }
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

  const usernameErrors = React.useMemo(() => {
    if (props.profileUpdateStatus.isValidUsername) {
      return;
    }
    if (
      props.profileUpdateStatus.isValidUsername !== null &&
      !props.profileUpdateStatus.isValidUsername
    ) {
      if (props.profileUpdateStatus.notAllowed) {
        return t(
          'Sorry, username can contain lowercase letters, numbers and must end in a letter.',
        );
      }
      if (props.profileUpdateStatus.tooShort) {
        return t('Sorry, username should have at least 3 characters');
      }
      return t('Sorry, this username has already been taken. Please choose another one.');
    }
    return;
  }, [props.profileUpdateStatus]);

  if (!profileState.ethAddress) {
    return null;
  }

  return (
    <>
      <ModalRenderer slotId={props.layoutConfig.modalSlotId}>
        {props.modalState.reportModal && (
          <ToastProvider autoDismiss={true} autoDismissTimeout={5000}>
            <ReportModal
              titleLabel={t(`Report ${flaggedContentType}`)}
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
              footerUrl1={'/legal/code-of-conduct'}
              cancelLabel={t('Cancel')}
              reportLabel={t('Report')}
              blockLabel={t('Block User')}
              closeLabel={t('Close')}
              user={loggedUserEthAddress ? loggedUserEthAddress : ''}
              contentId={profileState.ethAddress ? profileState.ethAddress : flagged}
              contentType={flaggedContentType}
              baseUrl={constants.BASE_REPORT_URL}
              closeModal={closeReportModal}
              signData={sdkModules.auth.authService.signData}
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
      </ModalRenderer>
      <Route path={`${menuRoute[MY_PROFILE]}/update-info`}>
        <ModalRenderer slotId={props.layoutConfig.modalSlotId}>
          {profileState.ethAddress && !profileUpdateStatus.updateComplete && (
            <ProfileForm
              titleLabel={profileState.userName ? t('Update Profile') : t('Create Profile')}
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
              ethAddress={profileState.ethAddress}
              providerData={profileState}
              onSave={onProfileUpdateSubmit}
              onCancel={closeProfileUpdateModal}
              updateStatus={profileUpdateStatus}
              showUsername={!profileState.userName}
              onUsernameChange={validateUsername}
              onUsernameBlur={(userName: string) =>
                props.profileActions.validateUsername({ userName })
              }
              isValidatingUsername={props.profileUpdateStatus.isValidating}
              usernameSuccess={props.profileUpdateStatus.isValidUsername ? ' ' : undefined}
              usernameError={usernameErrors}
            />
          )}
          {profileState.ethAddress && isRegistration && profileUpdateStatus.updateComplete && (
            <ProfileCompletedModal
              titleLabel={`${t('Welcome to the alpha!')}🙌`}
              subtitleLabel={`${t(
                'So happy to see you! Thank you for being part of this adventure!',
              )} 🚀
            `}
              buttonLabel={t("Let's rock")}
              onClick={handleModalClose}
            />
          )}
        </ModalRenderer>
      </Route>
      <Route path={`${menuRoute[MY_PROFILE]}/update-ens`}>
        <ModalRenderer slotId={props.layoutConfig.modalSlotId}>
          {networkState.networkNotSupported && (
            <StyledLayer>
              <ErrorLoader
                type={'network-not-supported'}
                title={t('Network not supported')}
                details={t('Please set your Ethereum provider to the Rinkeby Test Network')}
              />
            </StyledLayer>
          )}
          {!networkState.networkNotSupported && profileState.ethAddress && (
            <ErrorInfoCard errors={ensErrors}>
              {(errorMessage, hasCriticalErrors) => (
                <>
                  {!hasCriticalErrors && (
                    <ENSForm
                      titleLabel={
                        userNameType.available.includes(UsernameTypes.AKASHA_ENS_SUBDOMAIN) ||
                        userNameType.available.includes(UsernameTypes.ENS_DOMAIN)
                          ? t('Manage Ethereum name')
                          : t('Add an Ethereum name')
                      }
                      nameLabel={t('Choose Ethereum name')}
                      errorLabel={t(
                        'Sorry, this username has already been taken. Please choose another one',
                      )}
                      options={ensFormOptions}
                      cancelLabel={t('Cancel')}
                      saveLabel={t('Save')}
                      onSave={onENSSubmit}
                      onCancel={closeEnsModal}
                      saving={!!ensState.status.registering || !!profileUpdateStatus.saving}
                      errorMessage={`
                        ${ensState.errorMessage ? ensState.errorMessage : ''}
                        ${
                          errorMessage
                            ? Object.keys(ensErrors).reduce(
                                (str, errKey) =>
                                  str.length
                                    ? `${str}, ${ensErrors[errKey].error.message}`
                                    : ensErrors[errKey].error.message,
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
      </Route>
      <ProfileCard
        onClickFollowers={() => null}
        onClickFollowing={() => null}
        onClickPosts={() => null}
        handleFollow={handleFollow}
        handleUnfollow={handleUnfollow}
        handleShareClick={showShareModal}
        isFollowing={followedProfiles.includes(profileState.ethAddress)}
        loggedEthAddress={loggedUserEthAddress}
        profileData={{
          ...profileState,
          ethAddress: profileState.ethAddress as string,
          pubKey: profileState.pubKey as string,
          providers: profileState.providers as IProfileProvider[],
          default: profileState.default as IProfileProvider[],
        }}
        userNameType={userNameType}
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
        canUserEdit={loggedUserEthAddress === profileState.ethAddress}
        flaggable={loggedUserEthAddress !== profileState.ethAddress}
        flagAsLabel={t('Report account')}
        onEntryFlag={handleEntryFlag(
          profileState.ethAddress ? profileState.ethAddress : '',
          'account',
        )}
        onUpdateClick={showUpdateProfileModal}
        onENSChangeClick={showEnsModal}
        changeENSLabel={
          userNameType.available.includes(UsernameTypes.AKASHA_ENS_SUBDOMAIN) ||
          userNameType.available.includes(UsernameTypes.ENS_DOMAIN)
            ? t('Manage Ethereum name')
            : t('Add an Ethereum name')
        }
        copyLabel={t('Copy to clipboard')}
        copiedLabel={t('Copied')}
      />
    </>
  );
};
