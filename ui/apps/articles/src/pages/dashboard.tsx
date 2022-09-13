import React from 'react';
import { useTranslation } from 'react-i18next';

import DS from '@akashaorg/design-system';
import { useGetLogin } from '@akashaorg/ui-awf-hooks';
import { RootComponentProps } from '@akashaorg/typings/ui';

import ArticleHeader from '../components/articles-header';
import ArticlesMiniCard from '../components/articles-mini-card';
import ArticleOnboardingIntro, { ONBOARDING_STATUS } from '../components/onboarding/intro';

import routes, { ONBOARDING_STEP_ONE, SETTINGS, WRITE_ARTICLE } from '../routes';
import { articles } from '../components/dummy-data';

const { Box } = DS;

export interface IDashboardProps {
  className?: string;
}

const Dashboard: React.FC<RootComponentProps & IDashboardProps> = props => {
  const {
    className,
    plugins: { routing },
  } = props;

  const [menuDropOpen, setMenuDropOpen] = React.useState<string | null>(null);

  const loginQuery = useGetLogin();

  const { t } = useTranslation('app-articles');

  const isOnboarded = React.useMemo(() => {
    return window.localStorage.getItem(ONBOARDING_STATUS);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClickStart = () => {
    routing.navigateTo({
      appName: '@akashaorg/app-articles',
      getNavigationUrl: () => routes[ONBOARDING_STEP_ONE],
    });
  };

  const handleIconClick = () => {
    routing.navigateTo({
      appName: '@akashaorg/app-articles',
      getNavigationUrl: () => routes[SETTINGS],
    });
  };

  const closeMenuDrop = () => {
    setMenuDropOpen(null);
  };

  const toggleMenuDrop = (ev: React.SyntheticEvent, id: string) => {
    ev.stopPropagation();
    setMenuDropOpen(id);
  };

  const handleDropItemClick = (id: string, action?: 'edit' | 'settings') => () => {
    if (action) {
      routing.navigateTo({
        appName: '@akashaorg/app-articles',
        getNavigationUrl: () => `/article/${id}/${action}`,
      });
    }
  };

  const handleFlagArticle = (entryId: string, itemType: string) => () => {
    if (!loginQuery.data?.pubKey) {
      return props.navigateToModal({
        name: 'login',
        redirectTo: { name: 'report-modal', entryId, itemType },
      });
    }
    props.navigateToModal({ name: 'report-modal', entryId, itemType });
  };

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
    /** do something */
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
    <Box gap="small" className={className}>
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
            menuDropOpen={menuDropOpen === article.id}
            menuItems={[
              ...(loginQuery.data?.pubKey === article.authorPubkey
                ? [
                    {
                      icon: 'editSimple',
                      handler: handleDropItemClick(article.id, 'edit'),
                      label: t('Edit'),
                      iconColor: 'primaryText',
                    },
                    {
                      icon: 'settingsAlt',
                      handler: handleDropItemClick(article.id, 'settings'),
                      label: t('Settings'),
                      iconColor: 'primaryText',
                    },
                  ]
                : [
                    {
                      icon: 'report',
                      handler: handleFlagArticle(article.id, 'article'),
                      label: t('Report'),
                    },
                  ]),
            ]}
            mentionsLabel={t('Mentions')}
            repliesLabel={t('Replies')}
            isSaved={idx === 0}
            saveLabel={t('Save')}
            savedLabel={t('Saved')}
            onClickArticle={handleClickArticle}
            toggleMenuDrop={toggleMenuDrop}
            closeMenuDrop={closeMenuDrop}
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
