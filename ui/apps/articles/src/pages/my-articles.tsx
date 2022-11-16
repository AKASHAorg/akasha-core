import React from 'react';
import { useTranslation } from 'react-i18next';

import DS from '@akashaorg/design-system';
import { useGetLogin } from '@akashaorg/ui-awf-hooks';
import { EntityTypes, RootComponentProps } from '@akashaorg/typings/ui';

import MyArticlesHeader from '../components/my-articles-header';
import ArticlesMiniCard from '../components/articles-mini-card';
import ArticleOnboardingIntro, { ONBOARDING_STATUS } from '../components/onboarding/intro';

import routes, { ONBOARDING_STEP_ONE, WRITE_ARTICLE } from '../routes';
import { articles } from '../components/dummy-data';

const { Box, Button, Text, MainAreaCardBox } = DS;

export interface IMyArticlesProps {
  className?: string;
}

const MyArticles: React.FC<RootComponentProps & IMyArticlesProps> = props => {
  const { className, plugins } = props;

  const navigateTo = plugins['@akashaorg/app-routing']?.routing?.navigateTo;

  const [activeTabIndex, setActiveTabIndex] = React.useState(0);
  const [menuDropOpen, setMenuDropOpen] = React.useState<string | null>(null);

  const loginQuery = useGetLogin();

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
    if (!loginQuery.data?.pubKey) {
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

  const handleClickArticle = (article_id: string) => () => {
    /** do something */
    navigateTo({
      appName: '@akashaorg/app-articles',
      getNavigationUrl: () => `/article/${article_id}`,
    });
  };

  const handleMentionsClick = () => {
    /** do something */
  };

  const handleTagClick = (name: string) => {
    navigateTo?.({
      appName: '@akashaorg/app-akasha-integration',
      getNavigationUrl: navRoutes => `${navRoutes.Tags}/${name}`,
    });
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
        <Button
          slimBorder={true}
          primary={true}
          label={t('Start writing')}
          onClick={handleClickWriteArticle}
        />
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
              menuDropOpen={menuDropOpen === article.id}
              menuItems={[
                ...(loginQuery.data?.pubKey !== article.authorPubkey
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
                        handler: handleFlagArticle(article.id, EntityTypes.ARTICLE),
                        label: t('Report'),
                      },
                    ]),
              ]}
              collaboratingLabel={t('Collaborating')}
              onClickArticle={handleClickArticle}
              toggleMenuDrop={toggleMenuDrop}
              closeMenuDrop={closeMenuDrop}
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
                        handler: handleFlagArticle(article.id, EntityTypes.ARTICLE),
                        label: t('Report'),
                      },
                    ]),
              ]}
              collaboratingLabel={t('You are a collaborator in this article')}
              onClickArticle={handleClickArticle}
              toggleMenuDrop={toggleMenuDrop}
              closeMenuDrop={closeMenuDrop}
            />
          ))}
    </Box>
  );
};

export default MyArticles;
