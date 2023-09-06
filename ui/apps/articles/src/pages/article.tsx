import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useRootComponentProps } from '@akashaorg/ui-awf-hooks';

import Box from '@akashaorg/design-system-core/lib/components/Box';

import MiniHeader from '../components/mini-header';
import ArticleCard from '../components/article-card';

import { articles } from '../components/dummy-data';

const ArticlePage: React.FC<unknown> = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('app-articles');
  const { getRoutingPlugin } = useRootComponentProps();

  const navigateTo = getRoutingPlugin().navigateTo;

  const sampleArticleData = articles[0]; // fetch real article data by reading its id from url

  const handleClickIcon = () => {
    navigate(-1);
  };

  const handleTagClick = (name: string) => {
    navigateTo?.({
      appName: '@akashaorg/app-akasha-integration',
      getNavigationUrl: navRoutes => `${navRoutes.Tags}/${name}`,
    });
  };

  return (
    <Box customStyle="gap-2">
      <MiniHeader titleLabel={t('Articles')} onClickIcon={handleClickIcon} />
      <ArticleCard
        articleData={sampleArticleData}
        readTimeLabel={t('min read')}
        copyrightLabel={t('copyrighted article')}
        tagsLabel={t('tags')}
        collaboratorsLabel={t('collaborators')}
        mentionsLabel={t('Mentions')}
        repliesLabel={t('Replies')}
        isSaved={true}
        saveLabel={t('Save')}
        savedLabel={t('Saved')}
        onTagClick={handleTagClick}
        onMentionsClick={() => null}
        onRepliesClick={() => null}
        onSaveClick={() => null}
      />
    </Box>
  );
};
export default ArticlePage;
