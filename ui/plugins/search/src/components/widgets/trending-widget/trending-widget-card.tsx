import * as React from 'react';
import DS from '@akashaproject/design-system';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import { useTranslation } from 'react-i18next';
import {
  useTrendingData,
  useLoginState,
  useFollow,
  useTagSubscribe,
  useModalState,
} from '@akashaproject/ui-awf-hooks';
import { MODAL_NAMES } from '@akashaproject/ui-awf-hooks/lib/use-modal-state';
import useErrorState from '@akashaproject/ui-awf-hooks/lib/use-error-state';

const { TrendingWidgetCard, ErrorInfoCard, ErrorLoader, LoginModal } = DS;

const TrendingWidget: React.FC<RootComponentProps> = props => {
  const { globalChannel, sdkModules, logger, singleSpa } = props;

  const { t } = useTranslation();

  const [errorState, errorActions] = useErrorState({ logger });

  const [trendingData] = useTrendingData({
    sdkModules: sdkModules,
    onError: errorActions.createError,
  });

  const [loginState, loginActions] = useLoginState({
    globalChannel: globalChannel,
    onError: errorActions.createError,
    authService: sdkModules.auth.authService,
    ipfsService: sdkModules.commons.ipfsService,
    profileService: sdkModules.profiles.profileService,
  });

  const [followedProfiles, followActions] = useFollow({
    globalChannel,
    profileService: sdkModules.profiles.profileService,
    onError: errorActions.createError,
  });

  const [tagSubscriptionState, tagSubscriptionActions] = useTagSubscribe({
    globalChannel,
    profileService: sdkModules.profiles.profileService,
    onError: errorActions.createError,
  });

  const [modalState, modalStateActions] = useModalState({
    initialState: {},
    isLoggedIn: !!loginState.ethAddress,
  });

  const loginErrors: string | null = React.useMemo(() => {
    if (errorState && Object.keys(errorState).length) {
      const txt = Object.keys(errorState)
        .filter(key => key.split('.')[0] === 'useLoginState')
        .map(k => errorState![k])
        .reduce((acc, errObj) => `${acc}\n${errObj.error.message}`, '');
      return txt;
    }
    return null;
  }, [errorState]);

  const showLoginModal = () => {
    modalStateActions.show(MODAL_NAMES.LOGIN);
  };

  const hideLoginModal = () => {
    modalStateActions.hide(MODAL_NAMES.LOGIN);
    errorActions.removeLoginErrors();
  };

  const handleLogin = (providerId: number) => {
    loginActions.login(providerId);
  };

  React.useEffect(() => {
    if (loginState.ethAddress) {
      trendingData.profiles.slice(0, 4).forEach(async (profile: any) => {
        if (loginState.ethAddress && profile.ethAddress) {
          followActions.isFollowing(loginState.ethAddress, profile.ethAddress);
        }
      });
    }
  }, [trendingData, loginState.ethAddress]);

  React.useEffect(() => {
    if (loginState.waitForAuth && !loginState.ready) {
      return;
    }
    if (
      (loginState.waitForAuth && loginState.ready) ||
      (loginState.currentUserCalled && loginState.ethAddress)
    ) {
      tagSubscriptionActions.getTagSubscriptions();
    }
  }, [JSON.stringify(loginState)]);

  const handleTagClick = () => {
    // todo
  };
  const handleTagSubscribe = (tagName: string) => {
    if (!loginState.ethAddress) {
      showLoginModal();
      return;
    }
    tagSubscriptionActions.toggleTagSubscription(tagName);
  };
  const handleTagUnsubscribe = (tagName: string) => {
    if (!loginState.ethAddress) {
      showLoginModal();
      return;
    }
    tagSubscriptionActions.toggleTagSubscription(tagName);
  };
  const handleProfileClick = (pubKey: string) => {
    singleSpa.navigateToUrl(`/profile/${pubKey}`);
  };
  const handleFollowProfile = (ethAddress: string) => {
    if (!loginState.ethAddress) {
      showLoginModal();
      return;
    }
    followActions.follow(ethAddress);
  };

  const handleUnfollowProfile = (ethAddress: string) => {
    if (!loginState.ethAddress) {
      showLoginModal();
      return;
    }
    followActions.unfollow(ethAddress);
  };

  return (
    <ErrorInfoCard errors={errorState}>
      {(errMessages, hasCriticalErrors) => (
        <>
          {(hasCriticalErrors || errMessages) && (
            <ErrorLoader
              type="script-error"
              title={t('Oops, this widget has an error')}
              details={
                hasCriticalErrors
                  ? t('An issue prevented this widget to be displayed')
                  : t('Some functionality of this widget may not work properly')
              }
              devDetails={errMessages}
            />
          )}
          {!hasCriticalErrors && !errMessages && (
            <TrendingWidgetCard
              titleLabel={t('Trending Right Now')}
              topicsLabel={t('Topics')}
              profilesLabel={t('People')}
              followLabel={t('Follow')}
              unfollowLabel={t('Unfollow')}
              followersLabel={t('Followers')}
              followingLabel={t('Following')}
              tags={trendingData.tags}
              profiles={trendingData.profiles}
              followedProfiles={followedProfiles}
              subscribedTags={tagSubscriptionState}
              onClickTag={handleTagClick}
              handleSubscribeTag={handleTagSubscribe}
              handleUnsubscribeTag={handleTagUnsubscribe}
              onClickProfile={handleProfileClick}
              handleFollowProfile={handleFollowProfile}
              handleUnfollowProfile={handleUnfollowProfile}
              loggedEthAddress={loginState.ethAddress}
            />
          )}
          <LoginModal
            showModal={modalState.login}
            slotId={props.layout.app.modalSlotId}
            onLogin={handleLogin}
            onModalClose={hideLoginModal}
            titleLabel={t('Connect a wallet')}
            metamaskModalHeadline={t('Connecting')}
            metamaskModalMessage={t('Please complete the process in your wallet')}
            error={loginErrors}
          />
        </>
      )}
    </ErrorInfoCard>
  );
};

export default TrendingWidget;
