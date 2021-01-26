import * as React from 'react';
import DS from '@akashaproject/design-system';
import { RootComponentProps, IAkashaError } from '@akashaproject/ui-awf-typings';
import { useTranslation } from 'react-i18next';
import { useTrendingData, useLoginState } from '@akashaproject/ui-awf-hooks';

const { TrendingWidgetCard } = DS;

// export interface TrendingWidgetCardProps {}

const TrendingWidget: React.FC<RootComponentProps> = props => {
  const { globalChannel, sdkModules, logger, singleSpa } = props;

  const { t } = useTranslation();

  const [trendingData] = useTrendingData({ sdkModules: sdkModules });

  const [loginState, loginActions] = useLoginState({
    globalChannel: globalChannel,
    onError: (err: IAkashaError) => {
      logger('useLoginState error %j', err);
    },
    authService: sdkModules.auth.authService,
    ipfsService: sdkModules.commons.ipfsService,
    profileService: sdkModules.profiles.profileService,
  });

  // create a use following hook with isfollowing state, and follow/unfollow actions

  const handleIsFollowing: any = async (ethAddress: string) => {
    if (loginState.ethAddress) {
      const res: any = await sdkModules.profiles.profileService
        .isFollowing({ follower: loginState.ethAddress, following: ethAddress })
        .toPromise();

      return res.data?.isFollowing;
    }
    return false;
  };

  const [followedProfiles, setFollowedProfiles] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (loginState.ethAddress) {
      trendingData.profiles.slice(0, 4).forEach(async (profile: any) => {
        const following = await handleIsFollowing(profile.ethAddress);
        if (following) {
          setFollowedProfiles((followed: any) => followed.concat(profile.ethAddress));
        } else if (following === false) {
          setFollowedProfiles((followedProfiles: any) =>
            followedProfiles.filter(
              (followedProfile: any) => followedProfile !== profile.ethAddress,
            ),
          );
        }
      });
    }
  }, [trendingData.profiles, loginState.ethAddress]);

  const handleTagClick = () => {
    // todo
  };
  const handleTagSubscribe = () => {
    // todo
  };
  const handleProfileClick = (ethAddress: string) => {
    singleSpa.navigateToUrl(`/profile/${ethAddress}`);
  };
  const handleProfileSubscribe = (ethAddress: string) => {
    const isFollowingCall = sdkModules.profiles.profileService.isFollowing({
      follower: loginState.ethAddress,
      following: ethAddress,
    });
    isFollowingCall.subscribe((resp: any) => {
      let call;
      if (resp.data?.isFollowing) {
        call = sdkModules.profiles.profileService.unFollow({ ethAddress });
      } else if (resp.data?.isFollowing === false) {
        call = sdkModules.profiles.profileService.follow({ ethAddress });
      }

      call.subscribe((resp: any) => {
        if (resp.data && loginState.ethAddress) {
          loginActions.getProfileData({ ethAddress: loginState.ethAddress });
        }
      });
    });
  };

  return (
    <TrendingWidgetCard
      titleLabel={t('Trending Right Now')}
      topicsLabel={t('Topics')}
      profilesLabel={t('Profiles')}
      tags={trendingData.tags}
      profiles={trendingData.profiles}
      followedProfiles={followedProfiles}
      onClickTag={handleTagClick}
      onClickSubscribeTag={handleTagSubscribe}
      onClickProfile={handleProfileClick}
      onClickSubscribeProfile={handleProfileSubscribe}
    />
  );
};

export default TrendingWidget;
