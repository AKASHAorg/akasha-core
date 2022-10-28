import React from 'react';
import { useTranslation } from 'react-i18next';
import { RootComponentProps } from '@akashaorg/typings/ui';
import ArticlesSettings from '../components/article-settings';
import { useUninstallApp } from '@akashaorg/ui-awf-hooks';
import routes, { HOME } from '../routes';
import { topics } from '../components/dummy-data';

const ArticleSettingsPage: React.FC<RootComponentProps> = props => {
  const { plugins } = props;

  const navigateTo = plugins['@akashaorg/app-routing']?.routing?.navigateTo;

  // replace with real data
  const [selectedTopics, setSelectedTopics] = React.useState<string[]>(topics.slice(0, 15));

  const { t } = useTranslation('app-articles');

  const uninstallAppReq = useUninstallApp();

  const handleClickCloseSettings = () => {
    navigateTo({
      appName: '@akashaorg/app-articles',
      getNavigationUrl: () => routes[HOME],
    });
  };

  const handleSearch = () => {
    /** do something */
  };

  const handleClickTopic = (topic: string) => () => {
    if (selectedTopics.includes(topic)) {
      const filtered = selectedTopics.filter(_topic => _topic !== topic);
      return setSelectedTopics(filtered);
    }
  };

  const handleUninstall = () => {
    uninstallAppReq.mutate('@akashaorg/app-messaging');
    navigateTo?.({
      appName: '@akashaorg/app-akasha-integration',
      getNavigationUrl: routes => routes.defaultRoute,
    });
  };

  return (
    <ArticlesSettings
      titleLabel={t('Article App Settings')}
      inputPlaceholderLabel={t('Search for a topic')}
      subscribedTopicsTitleLabel={t('Topics you are subscribed to')}
      subscribedTopicsSubtitleLabel={t('You can subscribe to as many as you want')}
      subscribedTopics={selectedTopics}
      uninstallLabel={t('Uninstall')}
      onClickCloseSettings={handleClickCloseSettings}
      onSearch={handleSearch}
      onClickTopic={handleClickTopic}
      onClickUninstall={handleUninstall}
    />
  );
};

export default ArticleSettingsPage;
