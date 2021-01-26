import * as React from 'react';
import DS from '@akashaproject/design-system';
import { RootComponentProps, IAkashaError } from '@akashaproject/ui-awf-typings';
import { useTranslation } from 'react-i18next';
import { useTrendingData, useLoginState } from '@akashaproject/ui-awf-hooks';

const { TrendingWidgetCard } = DS;

// export interface TrendingWidgetCardProps {}

const TrendingWidget: React.FC<RootComponentProps> = props => {
  const { globalChannel, sdkModules, logger } = props;

  const { t } = useTranslation();

  const [trendingData] = useTrendingData({ sdkModules: props.sdkModules });

  const [loginState] = useLoginState({
    globalChannel: globalChannel,
    onError: (err: IAkashaError) => {
      logger('useLoginState error %j', err);
    },
    authService: sdkModules.auth.authService,
    ipfsService: sdkModules.commons.ipfsService,
    profileService: sdkModules.profiles.profileService,
  });

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
              (followedProfile: any) => followedProfile.ethAddress === profile.ethAddress,
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
    props.singleSpa.navigateToUrl(`/profile/${ethAddress}`);
  };
  const handleProfileSubscribe = () => {
    // todo
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
