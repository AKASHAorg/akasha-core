import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import DS from '@akashaorg/design-system';
import { RootComponentProps } from '@akashaorg/typings/ui';

import MiniHeader from '../components/mini-header';
import ArticleCard from '../components/article-card';

import { articles } from '../components/dummy-data';

const { Box } = DS;

const ArticlePage: React.FC<RootComponentProps> = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('app-articles');

  const handleClickIcon = () => {
    navigate(-1);
  };

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
    <Box gap="small">
      <MiniHeader titleLabel={t('Articles')} onClickIcon={handleClickIcon} />
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
    </Box>
  );
};
export default ArticlePage;
