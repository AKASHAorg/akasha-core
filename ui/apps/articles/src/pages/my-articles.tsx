import React from 'react';
import { useTranslation } from 'react-i18next';

import DS from '@akashaorg/design-system';
import { RootComponentProps } from '@akashaorg/typings/ui';

import MyArticlesHeader from '../components/my-articles-header';
import ArticlesMiniCard from '../components/articles-mini-card';

import routes, { WRITE_ARTICLE } from '../routes';
import { StyledButton } from '../components/styled';
import { articles } from '../components/dummy-data';

const { Box, Text, MainAreaCardBox } = DS;

export interface IMyArticlesProps {
  className?: string;
}

const MyArticles: React.FC<RootComponentProps & IMyArticlesProps> = props => {
  const {
    plugins: { routing },
  } = props;

  const [activeTabIndex, setActiveTabIndex] = React.useState(0);

  const { t } = useTranslation('app-articles');

  const handleClickWriteArticle = () => {
    routing.navigateTo({
      appName: '@akashaorg/app-articles',
      getNavigationUrl: () => routes[WRITE_ARTICLE],
    });
  };

  const handleClickArticle = (article_id: string) => () => {
    /** do something */
    routing.navigateTo({
      appName: '@akashaorg/app-articles',
      getNavigationUrl: () => `/article/${article_id}`,
    });
  };

  const handleClickTopic = (topic: string) => () => {
    /** do something with */
    topic;
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

  const handleClickTab = (idx: number) => () => {
    setActiveTabIndex(idx);
  };

  return (
    <Box gap="small">
      <MyArticlesHeader
        titleLabel={t('My Articles')}
        subtitleLabel={t('You can check all the articles that you published as well as the drafts')}
        tabs={[t('Published'), t('Draft'), t('Shared with me')]}
        activeTabIndex={activeTabIndex}
        onClickTab={handleClickTab}
      />
      <MainAreaCardBox
        direction="row"
        pad="medium"
        align="center"
        justify="between"
        border={{ size: '1px', color: 'accent' }}
      >
        <Text size="large">{t(' ✨😸Share your articles with Ethereum World 😸✨')}</Text>
        <StyledButton primary={true} label={t('Start writing')} onClick={handleClickWriteArticle} />
      </MainAreaCardBox>
      {activeTabIndex === 0 &&
        articles
          .filter(article => article.isPublished)
          .map((article, idx) => (
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
      {activeTabIndex === 1 &&
        articles
          .filter(article => article.isDraft)
          .map((article, idx) => (
            <ArticlesMiniCard
              key={idx}
              articleData={article}
              activeTabIndex={activeTabIndex}
              lastUpdatedLabel={t('Last updated')}
              draftLabel={t('Draft')}
              collaboratingLabel={t('Collaborating')}
              onClickArticle={handleClickArticle}
            />
          ))}
      {activeTabIndex === 2 &&
        articles
          .filter(article => article.isShared)
          .map((article, idx) => (
            <ArticlesMiniCard
              key={idx}
              articleData={article}
              activeTabIndex={activeTabIndex}
              lastUpdatedLabel={t('Last updated')}
              draftLabel={t('Draft')}
              collaboratingLabel={t('You are a collaborator in this article')}
              onClickArticle={handleClickArticle}
            />
          ))}
    </Box>
  );
};

export default MyArticles;
