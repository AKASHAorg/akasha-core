import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { RootComponentProps, ModalNavigationOptions, Profile } from '@akashaorg/typings/ui';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Helmet from '@akashaorg/design-system-core/lib/components/Helmet';
import OnboardingSuggestionsCard from '@akashaorg/design-system-components/lib/components/OnboardingSuggestionsCard';
import OnboardingStartCard from '@akashaorg/design-system-components/lib/components/OnboardingStartCard';

interface OnboardingPageProps extends RootComponentProps {
  onError?: (err: Error) => void;
  loggedProfileData: Profile;
  showLoginModal: (redirectTo?: { modal: ModalNavigationOptions }) => void;
}

const OnboardingPage: React.FC<OnboardingPageProps> = props => {
  const { loggedProfileData, plugins, showLoginModal } = props;

  const navigateTo = plugins['@akashaorg/app-routing']?.routing?.navigateTo;

  const { t } = useTranslation('app-search');

  // @TODO: replace with new hooks
  const trendingTagsReq = null;
  const trendingTags = trendingTagsReq.data?.slice(0, 15) || [];

  const trendingProfilesReq = null;
  const trendingProfiles = trendingProfilesReq.data?.slice(0, 7) || [];

  const followPubKeyArr = trendingProfiles.map((profile: { pubKey: string }) => profile.pubKey);

  const isFollowingMultipleReq = null;
  const followedProfiles = isFollowingMultipleReq.data;
  const followReq = null;
  const unfollowReq = null;

  const tagSubscriptionsReq = null;
  const tagSubscriptions = tagSubscriptionsReq.data;
  const toggleTagSubscriptionReq = null;

  const isLoggedIn = React.useMemo(() => {
    return loggedProfileData?.did?.id;
  }, [loggedProfileData?.did?.id]);

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
    <Box customStyle="w-full">
      <Helmet>
        <title>{t('Onboarding')}</title>
      </Helmet>
      <Box customStyle="gap-4">
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
