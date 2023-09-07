import React from 'react';
import { useTranslation } from 'react-i18next';

import { useGetMyProfileQuery } from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';
import { EntityTypes, RootComponentProps } from '@akashaorg/typings/ui';

import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Text from '@akashaorg/design-system-core/lib/components/Text';

import MyArticlesHeader from '../components/my-articles-header';
import ArticlesMiniCard from '../components/articles-mini-card';
import ArticleOnboardingIntro, { ONBOARDING_STATUS } from '../components/onboarding/intro';

import routes, { ONBOARDING_STEP_ONE, WRITE_ARTICLE } from '../routes';
import { articles } from '../components/dummy-data';

const MyArticles: React.FC<RootComponentProps> = props => {
  const { plugins } = props;

  const navigateTo = plugins['@akashaorg/app-routing']?.routing?.navigateTo;

  const [activeTabIndex, setActiveTabIndex] = React.useState(0);

  const profileDataReq = useGetMyProfileQuery(null, {
    select: resp => {
      return resp.viewer?.akashaProfile;
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
    <Stack spacing="gap-2">
      <MyArticlesHeader
        titleLabel={t('My Articles')}
        subtitleLabel={t('You can check all the articles that you published as well as the drafts')}
        tabs={[t('Published'), t('Draft'), t('Shared with me')]}
        activeTabIndex={activeTabIndex}
        onClickTab={handleClickTab}
      />
      <Card customStyle="flex flex-row p-4 items-center justify-between border(secondaryLight dark:secondaryDark">
        <Text variant="h6">{t(' ✨😸Share your articles with Akasha World 😸✨')}</Text>
        <Button variant="primary" label={t('Start writing')} onClick={handleClickWriteArticle} />
      </Card>
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
    </Stack>
  );
};

export default MyArticles;
