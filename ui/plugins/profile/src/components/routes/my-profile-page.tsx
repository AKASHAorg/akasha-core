import * as React from 'react';
import DS from '@akashaproject/design-system';
import { MyProfileCard } from '../profile-cards/my-profile-card';
import { RootComponentProps } from '@akashaproject/ui-awf-typings/src';
import {
  ModalState,
  ModalStateActions,
  MODAL_NAMES,
} from '@akashaproject/ui-awf-hooks/lib/use-modal-state';
import { useENSRegistration, useErrors, usePosts } from '@akashaproject/ui-awf-hooks';
import { useTranslation } from 'react-i18next';
import { IUserNameOption } from '@akashaproject/design-system/lib/components/Cards/form-cards/ens-form-card';
import { UseLoginActions } from '@akashaproject/ui-awf-hooks/lib/use-login-state';
import FeedWidget, { ItemTypes } from '@akashaproject/ui-widget-feed/lib/components/App';
import { IContentClickDetails } from '@akashaproject/design-system/lib/components/Cards/entry-cards/entry-box';
import { ILoadItemsPayload } from '@akashaproject/design-system/lib/components/VirtualList/interfaces';
import {
  ProfileUpdateStatus,
  UseProfileActions,
} from '@akashaproject/ui-awf-hooks/lib/use-profile';

const { styled, Helmet, ModalRenderer, BoxFormCard, EnsFormCard, Box, ErrorInfoCard } = DS;

export interface MyProfileProps extends RootComponentProps {
  modalState: ModalState;
  modalActions: ModalStateActions;
  loggedProfileData: any;
  loginActions: UseLoginActions;
  profileUpdateStatus: ProfileUpdateStatus;
  loggedProfileActions: UseProfileActions;
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

const MyProfilePage = (props: MyProfileProps) => {
  const { layout, profileUpdateStatus } = props;
  const { t } = useTranslation();

  const [ensErrors, ensErrorActions] = useErrors({ logger: props.logger });

  const [ensState, ensActions] = useENSRegistration({
    profileService: props.sdkModules.profiles.profileService,
    ethAddress: props.loggedProfileData.ethAddress,
    ensService: props.sdkModules.registry.ens,
    onError: ensErrorActions.createError,
  });

  const prevPubKey = React.useRef<string | null>(null);

  const [errorState, errorActions] = useErrors({
    logger: props.logger,
  });

  const [postsState, postsActions] = usePosts({
    postsService: props.sdkModules.posts,
    ipfsService: props.sdkModules.commons.ipfsService,
    onError: errorActions.createError,
    user: props.loggedProfileData.ethAddress,
  });

  React.useEffect(() => {
    if (profileUpdateStatus.updateComplete && props.modalState[MODAL_NAMES.PROFILE_UPDATE]) {
      closeProfileUpdateModal();
      return;
    }
    if (ensState.status.registrationComplete && props.modalState[MODAL_NAMES.CHANGE_ENS]) {
      if (ensState.userName) {
        props.loggedProfileActions.updateProfile({
          userName: `@${ensState.userName.replace('@', '')}`,
        });
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
    if (!props.loggedProfileData.pubKey && prevPubKey.current) {
      props.singleSpa.navigateToUrl('/');
    }
    if (!prevPubKey.current && props.loggedProfileData.pubKey) {
      prevPubKey.current = props.loggedProfileData.pubKey;
    }
  }, [props.loggedProfileData.pubKey]);

  const onProfileUpdateSubmit = (data: any) => {
    props.loggedProfileActions.optimisticUpdate(data);
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

  /**
   * Only required in my-profile-page,
   * because we are waiting for login event
   */
  React.useEffect(() => {
    if (
      props.loggedProfileData.pubKey &&
      !postsState.postIds.length &&
      !postsState.isFetchingPosts
    ) {
      postsActions.getUserPosts({ pubKey: props.loggedProfileData.pubKey, limit: 5 });
    }
  }, [props.loggedProfileData.pubKey]);

  const handleLoadMore = (payload: ILoadItemsPayload) => {
    if (!props.loggedProfileData.pubKey) {
      return;
    }
    const req: { limit: number; offset?: string } = {
      limit: payload.limit,
    };
    if (!postsState.isFetchingPosts) {
      postsActions.getUserPosts({ pubKey: props.loggedProfileData.pubKey, ...req });
    }
  };
  const handleItemDataLoad = ({ itemId }: { itemId: string }) => {
    postsActions.getPost(itemId);
  };
  const handleNavigation = (itemType: ItemTypes, details: IContentClickDetails) => {
    let url;
    switch (itemType) {
      case ItemTypes.PROFILE:
        url = `/profile/${details.entryId}`;
        postsActions.resetPostIds();
        break;
      case ItemTypes.ENTRY:
        url = `/AKASHA-app/post/${details.entryId}`;
        break;
      case ItemTypes.COMMENT:
        /* Navigate to parent post because we don't have the comment page yet */
        const parentId = postsState.postsData[details.entryId].postId;
        url = `/AKASHA-app/post/${parentId}`;
        break;
      default:
        break;
    }
    props.singleSpa.navigateToUrl(url);
  };

  const handleLoginModalOpen = () => {
    props.modalActions.show(MODAL_NAMES.LOGIN);
  };
  const handleRepostPublish = (entryData: any, embedEntry: any) => {
    postsActions.optimisticPublishPost(entryData, props.loggedProfileData, embedEntry);
  };
  const handleProfileShare = () => {};
  const handleShareModalClose = () => {
    props.modalActions.hide(MODAL_NAMES.PROFILE_SHARE);
  };

  const profileShareUrl = React.useMemo(() => {
    return `/profile/${props.loggedProfileData.pubKey}`;
  }, [props.loggedProfileData]);

  return (
    <Box fill="horizontal" margin={{ top: '.5rem' }}>
      <Helmet>
        <title>Profile | My Page</title>
      </Helmet>
      <MyProfileCard
        profileData={props.loggedProfileData}
        onModalShow={handleModalShow}
        canEdit={!!props.loggedProfileData.ethAddress}
        userName={props.loggedProfileData.userName}
        onShare={handleProfileShare}
        onShareModalClose={handleShareModalClose}
        shareUrl={profileShareUrl}
        modalState={props.modalState}
      />
      <FeedWidget
        // pass i18n from props (the i18next instance, not the react one!)
        i18n={props.i18n}
        itemType={ItemTypes.ENTRY}
        logger={props.logger}
        loadMore={handleLoadMore}
        loadItemData={handleItemDataLoad}
        getShareUrl={(itemId: string) => `${window.location.origin}/AKASHA-app/post/${itemId}`}
        itemIds={postsState.postIds}
        itemsData={postsState.postsData}
        errors={errorState}
        sdkModules={props.sdkModules}
        layout={props.layout}
        globalChannel={props.globalChannel}
        ethAddress={props.loggedProfileData.ethAddress}
        onNavigate={handleNavigation}
        onLoginModalOpen={handleLoginModalOpen}
        isFetching={postsState.isFetchingPosts}
        totalItems={postsState.totalItems}
        profilePubKey={props.loggedProfileData.pubKey}
        loggedProfile={props.loggedProfileData}
        modalSlotId={props.layout.app.modalSlotId}
        onRepostPublish={handleRepostPublish}
      />
      <ModalRenderer slotId={layout.app.modalSlotId}>
        {props.modalState[MODAL_NAMES.PROFILE_UPDATE] && props.loggedProfileData.ethAddress && (
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
              ethAddress={props.loggedProfileData.ethAddress}
              providerData={{
                ...props.loggedProfileData,
              }}
              onSave={onProfileUpdateSubmit}
              onCancel={closeProfileUpdateModal}
              updateStatus={profileUpdateStatus}
            />
          </Overlay>
        )}
        {props.modalState[MODAL_NAMES.CHANGE_ENS] && props.loggedProfileData.ethAddress && (
          <Overlay>
            <ErrorInfoCard errors={ensErrors}>
              {(errorMessage, hasCriticalErrors) => (
                <>
                  {!hasCriticalErrors && (
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
                      ethAddress={props.loggedProfileData.ethAddress}
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
          </Overlay>
        )}
      </ModalRenderer>
    </Box>
  );
};

export default MyProfilePage;
