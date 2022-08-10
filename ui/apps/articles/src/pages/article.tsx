import React from 'react';
import { useTranslation } from 'react-i18next';

import { RootComponentProps } from '@akashaorg/typings/ui';

import ArticleCard from '../components/article-card';

import { articles } from '../components/dummy-data';

const ArticlePage: React.FC<RootComponentProps> = () => {
  const { t } = useTranslation('app-articles');

  const handleClickTopic = (topic: string) => () => {
    /** do something */
    console.log(topic);
  };

  const handleMentionsClick = () => {
    /** do something */
  };
  const handleRepliesClick = () => {
    /** do something */
  };
  const handleSaveClick = () => {
    /** do something */
  };

  return (
    <ArticleCard
      articleData={articles[0]}
      readTimeLabel={t('min read')}
      copyrightLabel={t('copyrighted article')}
      tagsLabel={t('tags')}
      collaboratorsLabel={t('collaborators')}
      mentionsLabel={t('Mentions')}
      repliesLabel={t('Replies')}
      isSaved={true}
      saveLabel={t('Save')}
      savedLabel={t('Saved')}
      onClickTopic={handleClickTopic}
      onMentionsClick={handleMentionsClick}
      onRepliesClick={handleRepliesClick}
      onSaveClick={handleSaveClick}
    />
  );
};
export default ArticlePage;
