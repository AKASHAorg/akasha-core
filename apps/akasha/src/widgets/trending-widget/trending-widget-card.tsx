import * as React from 'react';
import DS from '@akashaproject/design-system';
import { useTranslation } from 'react-i18next';

const { TrendingWidgetCard } = DS;

export interface TrendingWidgetCardProps {}

const TrendingWidget: React.FC<TrendingWidgetCardProps> = () => {
  const { t } = useTranslation();
  const handleTagClick = () => {
    // todo
  };
  const handleMoreTagsClick = () => {
    // todo
  };
  const handleTagSubscribe = () => {
    // todo
  };
  const handleProfileClick = () => {
    // todo
  };
  const handleMoreProfilesClick = () => {
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
      showMoreLabel={t('Show More')}
      tags={[]}
      profiles={[]}
      onClickTag={handleTagClick}
      onClickMoreTags={handleMoreTagsClick}
      onClickSubscribeTag={handleTagSubscribe}
      onClickProfile={handleProfileClick}
      onClickMoreProfiles={handleMoreProfilesClick}
      onClickSubscribeProfile={handleProfileSubscribe}
    />
  );
};

export default TrendingWidget;
