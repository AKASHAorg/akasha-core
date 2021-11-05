import * as React from 'react';
import DS from '@akashaproject/design-system';
import { useTranslation } from 'react-i18next';
import {
  useTrendingTags,
  useTrendingProfiles,
  useTagSubscriptions,
  useToggleTagSubscription,
  useIsFollowingMultiple,
  useFollow,
  useUnfollow,
  useGetLogin,
} from '@akashaproject/ui-awf-hooks';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';

const { TrendingWidgetCard, ErrorLoader, Box } = DS;

const TrendingWidgetComponent: React.FC<RootComponentProps> = props => {
  const { singleSpa } = props;

  const { t } = useTranslation();
  const loginQuery = useGetLogin();

  const trendingTagsReq = useTrendingTags();
  const trendingTags = trendingTagsReq.data || [];
  const trendingProfilesReq = useTrendingProfiles();
  const trendingProfiles = trendingProfilesReq.data || [];

  const followEthAddressArr = trendingProfiles
    .slice(0, 4)
    .map((profile: { ethAddress: string }) => profile.ethAddress);

  const isFollowingMultipleReq = useIsFollowingMultiple(
    loginQuery.data?.ethAddress,
    followEthAddressArr,
  );
  const followedProfiles = isFollowingMultipleReq.data;
  const followReq = useFollow();
  const unfollowReq = useUnfollow();

  const tagSubscriptionsReq = useTagSubscriptions(
    loginQuery.data?.isReady && loginQuery.data?.ethAddress,
  );
  const tagSubscriptions = tagSubscriptionsReq.data;
  const toggleTagSubscriptionReq = useToggleTagSubscription();

  const showLoginModal = () => {
    props.navigateToModal({ name: 'login' });
  };

  const handleTagClick = (tagName: string) => {
    singleSpa.navigateToUrl(`/social-app/tags/${tagName}`);
  };

  const handleTagSubscribe = (tagName: string) => {
    if (!loginQuery.data?.ethAddress) {
      showLoginModal();
      return;
    }
    toggleTagSubscriptionReq.mutate(tagName);
  };

  const handleProfileClick = (pubKey: string) => {
    singleSpa.navigateToUrl(`/profile/${pubKey}`);
  };

  const handleFollowProfile = (ethAddress: string) => {
    if (!loginQuery.data?.ethAddress) {
      showLoginModal();
      return;
    }
    followReq.mutate(ethAddress);
  };

  const handleUnfollowProfile = (ethAddress: string) => {
    if (!loginQuery.data?.ethAddress) {
      showLoginModal();
      return;
    }
    unfollowReq.mutate(ethAddress);
  };

  return (
    <Box pad={{ bottom: 'small' }}>
      {(trendingTagsReq.isError || trendingProfilesReq.isError) && (
        <ErrorLoader
          type="script-error"
          title={t('Oops, this widget has an error')}
          details={
            trendingTagsReq.isError
              ? t('Cannot load trending topics')
              : t('Cannot load trending profiles')
          }
        />
      )}
      <TrendingWidgetCard
        titleLabel={t('Trending Right Now')}
        topicsLabel={t('Topics')}
        profilesLabel={t('People')}
        followLabel={t('Follow')}
        unfollowLabel={t('Unfollow')}
        followersLabel={t('Followers')}
        followingLabel={t('Following')}
        tagAnchorLink={'/social-app/tags'}
        profileAnchorLink={'/profile'}
        noTagsLabel={t('No tags found!')}
        noProfilesLabel={t('No profiles found!')}
        isLoadingTags={trendingTagsReq.isFetching}
        isLoadingProfiles={trendingProfilesReq.isFetching}
        tags={trendingTags}
        profiles={trendingProfiles}
        followedProfiles={followedProfiles}
        subscribedTags={tagSubscriptions}
        onClickTag={handleTagClick}
        handleSubscribeTag={handleTagSubscribe}
        handleUnsubscribeTag={handleTagSubscribe}
        onClickProfile={handleProfileClick}
        handleFollowProfile={handleFollowProfile}
        handleUnfollowProfile={handleUnfollowProfile}
        loggedEthAddress={loginQuery.data?.ethAddress}
      />
    </Box>
  );
};

export default TrendingWidgetComponent;
