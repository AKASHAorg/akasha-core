import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import DS from '@akashaorg/design-system';
import { useGetLogin } from '@akashaorg/ui-awf-hooks';
import { RootComponentProps } from '@akashaorg/typings/ui';

import MiniHeader from '../components/mini-header';
import ArticleCard from '../components/article-card';

import { articles } from '../components/dummy-data';

const { Box } = DS;

export interface IArticlePageProps {
  className?: string;
}

const ArticlePage: React.FC<RootComponentProps & IArticlePageProps> = props => {
  const { className, plugins } = props;

  const navigateTo = plugins['@akashaorg/app-routing']?.routing?.navigateTo;

  const [menuDropOpen, setMenuDropOpen] = React.useState(false);

  const loginQuery = useGetLogin();

  const navigate = useNavigate();
  const { t } = useTranslation('app-articles');

  const sampleArticleData = articles[0]; // fetch real article data by reading its id from url

  const handleClickIcon = () => {
    navigate(-1);
  };

  const closeMenuDrop = () => {
    setMenuDropOpen(false);
  };

  const toggleMenuDrop = (ev: React.SyntheticEvent) => {
    ev.stopPropagation();
    setMenuDropOpen(!menuDropOpen);
  };

  const handleDropItemClick = (id: string, action?: 'edit' | 'settings') => () => {
    if (action) {
      navigateTo({
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

  const menutItems = [
    ...(loginQuery.data?.pubKey === sampleArticleData.authorPubkey
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
            handler: handleFlagArticle(sampleArticleData.id, 'article'),
            label: t('Report'),
          },
        ]),
  ];

  return (
    <Box gap="small" className={className}>
      <MiniHeader titleLabel={t('Articles')} onClickIcon={handleClickIcon} />
      <ArticleCard
        articleData={sampleArticleData}
        readTimeLabel={t('min read')}
        copyrightLabel={t('copyrighted article')}
        menuDropOpen={menuDropOpen}
        menuItems={menutItems}
        tagsLabel={t('tags')}
        collaboratorsLabel={t('collaborators')}
        mentionsLabel={t('Mentions')}
        repliesLabel={t('Replies')}
        isSaved={true}
        saveLabel={t('Save')}
        savedLabel={t('Saved')}
        toggleMenuDrop={toggleMenuDrop}
        closeMenuDrop={closeMenuDrop}
        onTagClick={handleTagClick}
        onMentionsClick={handleMentionsClick}
        onRepliesClick={handleRepliesClick}
        onSaveClick={handleSaveClick}
      />
    </Box>
  );
};
export default ArticlePage;
