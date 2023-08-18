import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useGetMyProfileQuery } from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';
import { EntityTypes, RootComponentProps } from '@akashaorg/typings/ui';

import Box from '@akashaorg/design-system-core/lib/components/Box';

import MiniHeader from '../components/mini-header';
import ArticleCard from '../components/article-card';

import { articles } from '../components/dummy-data';

const ArticlePage: React.FC<RootComponentProps> = props => {
  const { plugins } = props;

  const navigateTo = plugins['@akashaorg/app-routing']?.routing?.navigateTo;

  const profileDataReq = useGetMyProfileQuery(null, {
    select: resp => {
      return resp.viewer?.akashaProfile;
    },
  });
  const loggedProfileData = profileDataReq.data;

  const navigate = useNavigate();
  const { t } = useTranslation('app-articles');

  const sampleArticleData = articles[0]; // fetch real article data by reading its id from url

  const handleClickIcon = () => {
    navigate(-1);
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

  const menuItems = [
    ...(loggedProfileData?.did?.id === sampleArticleData.authorProfileId
      ? [
          {
            icon: 'editSimple',
            handler: handleDropItemClick(sampleArticleData.id, 'edit'),
            label: t('Edit'),
            iconColor: 'primaryText',
          },
          {
            icon: 'settingsAlt',
            handler: handleDropItemClick(sampleArticleData.id, 'settings'),
            label: t('Settings'),
            iconColor: 'primaryText',
          },
        ]
      : [
          {
            icon: 'report',
            handler: handleFlagArticle(sampleArticleData.id, EntityTypes.ARTICLE),
            label: t('Report'),
          },
        ]),
  ];

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
        onMentionsClick={handleMentionsClick}
        onRepliesClick={handleRepliesClick}
        onSaveClick={handleSaveClick}
      />
    </Box>
  );
};
export default ArticlePage;
