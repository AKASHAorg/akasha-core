import * as React from 'react';
import DS from '@akashaorg/design-system';
import { useTranslation } from 'react-i18next';
import {
  useGetLogin,
  LoginState,
  useTrendingProfiles,
  useTrendingTags,
  useIsFollowingMultiple,
  useFollow,
  useUnfollow,
  useTagSubscriptions,
  useToggleTagSubscription,
} from '@akashaorg/ui-awf-hooks';
import { RootComponentProps, ModalNavigationOptions } from '@akashaorg/typings/ui';

const { Helmet, Box, OnboardingStartCard, OnboardingSuggestionsCard } = DS;

interface OnboardingPageProps extends RootComponentProps {
  onError?: (err: Error) => void;
  loginState: LoginState;
  showLoginModal: (redirectTo?: { modal: ModalNavigationOptions }) => void;
}

const OnboardingPage: React.FC<OnboardingPageProps> = props => {
  const { showLoginModal } = props;

  const navigateTo = props.plugins['@akashaorg/app-routing']?.routing?.navigateTo;

  const { t } = useTranslation('app-notifications');

  const loginQuery = useGetLogin();

  const trendingTagsReq = useTrendingTags();
  const trendingTags = trendingTagsReq.data?.slice(0, 15) || [];
  const trendingProfilesReq = useTrendingProfiles();
  const trendingProfiles = trendingProfilesReq.data?.slice(0, 7) || [];

  const followPubKeyArr = trendingProfiles.map((profile: { pubKey: string }) => profile.pubKey);

  const isFollowingMultipleReq = useIsFollowingMultiple(loginQuery.data?.pubKey, followPubKeyArr);
  const followedProfiles = isFollowingMultipleReq.data;
  const followReq = useFollow();
  const unfollowReq = useUnfollow();

  const tagSubscriptionsReq = useTagSubscriptions(
    loginQuery.data?.isReady && loginQuery.data?.ethAddress,
  );
  const tagSubscriptions = tagSubscriptionsReq.data;
  const toggleTagSubscriptionReq = useToggleTagSubscription();

  const isLoggedIn = React.useMemo(() => {
    return loginQuery.data?.ethAddress;
  }, [loginQuery.data?.ethAddress]);

  const handleAvatarClick = (profilePubKey: string) => {
    navigateTo?.({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: navRoutes => `${navRoutes.rootRoute}/${profilePubKey}`,
    });
  };

  const toggleTagSubscribe = (tagName: string) => {
    if (!isLoggedIn) {
      showLoginModal();
      return;
    }
    toggleTagSubscriptionReq.mutate(tagName);
  };

  const handleFollow = (pubKey: string) => {
    if (!isLoggedIn) {
      showLoginModal();
      return;
    }
    followReq.mutate(pubKey);
  };

  const handleUnfollow = (pubKey: string) => {
    if (!isLoggedIn) {
      showLoginModal();
      return;
    }
    unfollowReq.mutate(pubKey);
  };

  const handleShowMyFeed = () => {
    navigateTo?.({
      appName: '@akashaorg/app-akasha-integration',
      getNavigationUrl: navRoutes => `${navRoutes['My Feed']}`,
    });
  };

  const handleSearch = (value: string) => {
    navigateTo?.({
      appName: '@akashaorg/app-search',
      getNavigationUrl: navRoutes => `${navRoutes.Results}/${value}`,
    });
  };

  return (
    <Box fill="horizontal">
      <Helmet>
        <title>{t('Onboarding')}</title>
      </Helmet>
      <Box gap="medium">
        <OnboardingStartCard
          inputPlaceholderLabel={t('Search')}
          titleLabel={t('Search')}
          handleSearch={handleSearch}
          buttonLabel={t('Show my feed')}
          isButtonEnabled={tagSubscriptions?.length > 0 || followedProfiles?.length > 0}
          handleButtonClick={handleShowMyFeed}
        />
        <OnboardingSuggestionsCard
          topicsLabel={t('Topics to follow')}
          peopleLabel={t('People to follow')}
          followLabel={t('Follow')}
          unfollowLabel={t('Unfollow')}
          followingLabel={t('Following')}
          tags={trendingTags}
          profiles={trendingProfiles}
          subscribedTags={tagSubscriptions}
          followedProfiles={followedProfiles}
          onClickProfile={handleAvatarClick}
          onClickTag={toggleTagSubscribe}
          onClickFollow={handleFollow}
          onClickUnfollow={handleUnfollow}
        />
      </Box>
    </Box>
  );
};

export default OnboardingPage;
