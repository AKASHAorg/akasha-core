import React from 'react';
import { useTranslation } from 'react-i18next';

import DS from '@akashaorg/design-system';
import { RootComponentProps } from '@akashaorg/typings/ui';

import ArticleHeader from '../components/articles-header';
import ArticlesMiniCard from '../components/articles-mini-card';

import routes, { SETTINGS } from '../routes';
import { articles } from '../components/dummy-data';

const { Box } = DS;

export interface IDashboardProps {
  className?: string;
}

const Dashboard: React.FC<RootComponentProps & IDashboardProps> = props => {
  const {
    plugins: { routing },
  } = props;

  const { t } = useTranslation('app-articles');

  const handleIconClick = () => {
    routing.navigateTo({
      appName: '@akashaorg/app-articles',
      getNavigationUrl: () => routes[SETTINGS],
    });
  };

  const handleClickWriteArticle = () => {
    /** do something */
  };

  const handleClickArticle = (article_id: string) => () => {
    /** do something */
    routing.navigateTo({
      appName: '@akashaorg/app-articles',
      getNavigationUrl: () => `/article/${article_id}`,
    });
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
      <ArticleHeader
        titleLabel={t('Articles')}
        subtitleLabel={t('Browse articles or write a new one 📝')}
        writeArticleLabel={t('Write an article')}
        onIconClick={handleIconClick}
        onClickWriteArticle={handleClickWriteArticle}
      />
      {articles.map((article, idx) => (
        <ArticlesMiniCard
          key={idx}
          articleData={article}
          readTimeLabel={t('min read')}
          copyrightLabel={t('copyrighted')}
          mentionsLabel={t('Mentions')}
          repliesLabel={t('Replies')}
          isSaved={idx === 0}
          saveLabel={t('Save')}
          savedLabel={t('Saved')}
          onClickArticle={handleClickArticle}
          onClickTopic={handleClickTopic}
          onMentionsClick={handleMentionsClick}
          onRepliesClick={handleRepliesClick}
          onSaveClick={handleSaveClick}
        />
      ))}
    </Box>
  );
};

export default Dashboard;
