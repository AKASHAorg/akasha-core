import React from 'react';
import { useTranslation } from 'react-i18next';

import { RootComponentProps } from '@akashaorg/typings/ui';

import Stack from '@akashaorg/design-system-core/lib/components/Stack';

import ArticleHeader from '../components/articles-header';
import ArticlesMiniCard from '../components/articles-mini-card';
import ArticleOnboardingIntro, { ONBOARDING_STATUS } from '../components/onboarding/intro';

import routes, { ONBOARDING_STEP_ONE, SETTINGS, WRITE_ARTICLE } from '../routes';
import { articles } from '../components/dummy-data';

const Dashboard: React.FC<RootComponentProps> = props => {
  const { plugins } = props;

  const navigateTo = plugins['@akashaorg/app-routing']?.routing?.navigateTo;

  const { t } = useTranslation('app-articles');

  const isOnboarded = React.useMemo(() => {
    return window.localStorage.getItem(ONBOARDING_STATUS);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClickStart = () => {
    navigateTo({
      appName: '@akashaorg/app-articles',
      getNavigationUrl: () => routes[ONBOARDING_STEP_ONE],
    });
  };

  const handleIconClick = () => {
    navigateTo({
      appName: '@akashaorg/app-articles',
      getNavigationUrl: () => routes[SETTINGS],
    });
  };

  const handleClickWriteArticle = () => {
    navigateTo({
      appName: '@akashaorg/app-articles',
      getNavigationUrl: () => routes[WRITE_ARTICLE],
    });
  };

  const handleClickArticle = (articleId: string) => () => {
    navigateTo({
      appName: '@akashaorg/app-articles',
      getNavigationUrl: () => `/article/${articleId}`,
    });
  };

  const handleTagClick = (name: string) => {
    navigateTo?.({
      appName: '@akashaorg/app-akasha-integration',
      getNavigationUrl: navRoutes => `${navRoutes.Tags}/${name}`,
    });
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

  if (!isOnboarded) {
    return (
      <ArticleOnboardingIntro
        titleLabel={t('Welcome to the Article App')}
        introLabel={t("✨ When a post isn't enough ✨")}
        descriptionLabel={t(
          'Join our community of writers, start writing and sharing your knowledge with ethereans',
        )}
        buttonLabel={t('Start Tutorial')}
        onStart={handleClickStart}
      />
    );
  }

  return (
    <Stack spacing="gap-2">
      <ArticleHeader
        titleLabel={t('Articles')}
        subtitleLabel={t('Browse articles or write a new one 📝')}
        writeArticleLabel={t('Write an article')}
        onIconClick={handleIconClick}
        onClickWriteArticle={handleClickWriteArticle}
      />
      {articles
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
            onTagClick={handleTagClick}
            onMentionsClick={handleMentionsClick}
            onRepliesClick={handleRepliesClick}
            onSaveClick={handleSaveClick}
          />
        ))}
    </Stack>
  );
};

export default Dashboard;
