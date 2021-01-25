import * as React from 'react';
import DS from '@akashaproject/design-system';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import { useTranslation } from 'react-i18next';
import { combineLatest } from 'rxjs';

const { TrendingWidgetCard } = DS;

// export interface TrendingWidgetCardProps {}

const TrendingWidget: React.FC<RootComponentProps> = props => {
  const { t } = useTranslation();

  const [trendingTags, setTrendingTags] = React.useState<any>([]);
  const [trendingProfiles, setTrendingProfiles] = React.useState<any>([]);

  React.useEffect(() => {
    const trendingTagsCall = props.sdkModules.posts.tags.getTrending({});
    trendingTagsCall.subscribe((resp: any) => {
      if (resp.data.searchTags) {
        const tags = resp.data.searchTags.map((tag: string) => {
          return {
            name: tag,
            posts: 1,
          };
        });
        setTrendingTags(tags);
      }
    });
    const ipfsGatewayCall = props.sdkModules.commons.ipfsService.getSettings({});
    const trendingProfilesCall = props.sdkModules.profiles.profileService.getTrending({});
    const getTrendingProfiles = combineLatest([ipfsGatewayCall, trendingProfilesCall]);
    getTrendingProfiles.subscribe((resp: any) => {
      const ipfsGateway = resp[0].data;
      if (resp[1].data.searchProfiles) {
        const profiles = resp[1].data.searchProfiles.map((profile: any) => {
          const profileData = Object.assign({}, profile);
          if (profile.avatar && !profile.avatar.startsWith(ipfsGateway)) {
            const profileAvatarWithGateway = `${ipfsGateway}/${profile.avatar}`;
            profileData.avatar = profileAvatarWithGateway;
          }
          // should replace with real data once we integrate follow functionality
          profileData.followers = profileData.followers || 0;
          return profileData;
        });
        setTrendingProfiles(profiles);
      }
    });
  }, []);

  const handleTagClick = () => {
    // todo
  };
  const handleTagSubscribe = () => {
    // todo
  };
  const handleProfileClick = () => {
    // todo
  };
  const handleProfileSubscribe = () => {
    // todo
  };

  return (
    <TrendingWidgetCard
      titleLabel={t('Trending Right Now')}
      topicsLabel={t('Topics')}
      profilesLabel={t('Profiles')}
      tags={trendingTags}
      profiles={trendingProfiles}
      onClickTag={handleTagClick}
      onClickSubscribeTag={handleTagSubscribe}
      onClickProfile={handleProfileClick}
      onClickSubscribeProfile={handleProfileSubscribe}
    />
  );
};

export default TrendingWidget;
