import React from 'react';
import { useTranslation } from 'react-i18next';

import DS from '@akashaorg/design-system';
import { useGetMyProfileQuery } from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';
import { EntityTypes, RootComponentProps } from '@akashaorg/typings/ui';

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
  const { className, plugins } = props;

  const navigateTo = plugins['@akashaorg/app-routing']?.routing?.navigateTo;

  const [menuDropOpen, setMenuDropOpen] = React.useState<string | null>(null);

  const profileDataReq = useGetMyProfileQuery(null, {
    select: resp => {
      return resp.viewer?.profile;
    },
  });
  const loggedProfileData = profileDataReq.data;

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

  const closeMenuDrop = () => {
    setMenuDropOpen(null);
  };

  const toggleMenuDrop = (ev: React.SyntheticEvent, id: string) => {
    ev.stopPropagation();
    setMenuDropOpen(id);
  };

  const handleDropItemClick = (id: string, action?: 'edit' | 'settings') => () => {
    if (action) {
      navigateTo({
        appName: '@akashaorg/app-articles',
        getNavigationUrl: () => `/article/${id}/${action}`,
      });
    }
  };

  const handleFlagArticle = (itemId: string, itemType: EntityTypes) => () => {
    if (!loggedProfileData?.did?.id) {
      return props.navigateToModal({
        name: 'login',
        redirectTo: { name: 'report-modal', itemId, itemType },
      });
    }
    props.navigateToModal({ name: 'report-modal', itemId, itemType });
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
              ...(loggedProfileData?.did?.id === article.authorProfileId
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
                      handler: handleFlagArticle(article.id, EntityTypes.ARTICLE),
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
            onTagClick={handleTagClick}
            onMentionsClick={handleMentionsClick}
            onRepliesClick={handleRepliesClick}
            onSaveClick={handleSaveClick}
          />
        ))}
    </Box>
  );
};

export default Dashboard;
