import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { transformSource, useRootComponentProps, useGetLogin } from '@akashaorg/ui-awf-hooks';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import OnboardingSuggestionsCard from '@akashaorg/design-system-components/lib/components/OnboardingSuggestionsCard';
import OnboardingStartCard from '@akashaorg/design-system-components/lib/components/OnboardingStartCard';
import { Helmet, HelmetProvider } from 'react-helmet-async';

const OnboardingPage: React.FC = () => {
  const { t } = useTranslation('app-search');

  const { getRoutingPlugin, navigateToModal } = useRootComponentProps();

  const navigateTo = getRoutingPlugin().navigateTo;

  const { data } = useGetLogin();
  const isLoggedIn = !!data?.id;

  const showLoginModal = () => {
    navigateToModal({ name: 'login' });
  };

  // @TODO: replace with new hooks
  const trendingTagsReq = null;
  const trendingTags = trendingTagsReq?.data?.slice(0, 15) || [];

  const trendingProfilesReq = null;
  const trendingProfiles = trendingProfilesReq?.data?.slice(0, 7) || [];

  const isFollowingMultipleReq = null;
  const followedProfiles = isFollowingMultipleReq?.data;
  const followReq = null;
  const unfollowReq = null;

  const tagSubscriptionsReq = null;
  const tagSubscriptions = tagSubscriptionsReq?.data;
  const toggleTagSubscriptionReq = null;

  const handleAvatarClick = (id: string) => {
    navigateTo?.({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: navRoutes => `${navRoutes.rootRoute}/${id}`,
    });
  };

  const toggleTagSubscribe = (tagName: string) => {
    if (!isLoggedIn) {
      showLoginModal();
      return;
    }
    toggleTagSubscriptionReq.mutate(tagName);
  };

  const handleFollow = (id: string) => {
    if (!isLoggedIn) {
      showLoginModal();
      return;
    }
    followReq.mutate(id);
  };

  const handleUnfollow = (id: string) => {
    if (!isLoggedIn) {
      showLoginModal();
      return;
    }
    unfollowReq.mutate(id);
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
    <HelmetProvider>
      <Stack fullWidth={true}>
        <Helmet>
          <title>{t('Onboarding')}</title>
        </Helmet>
        <Stack spacing="gap-4">
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
            transformSource={transformSource}
          />
        </Stack>
      </Stack>
    </HelmetProvider>
  );
};

export default OnboardingPage;
