import React from 'react';
import { useTranslation } from 'react-i18next';

import { useRootComponentProps } from '@akashaorg/ui-awf-hooks';

import ArticlesSettings from '../components/article-settings';
import routes, { HOME } from '../routes';
import { topics } from '../components/dummy-data';

const ArticleSettingsPage = () => {
  // replace with real data
  const [selectedTopics, setSelectedTopics] = React.useState<string[]>(topics.slice(0, 15));

  const { t } = useTranslation('app-articles');
  const { getRoutingPlugin } = useRootComponentProps();

  const navigateTo = getRoutingPlugin().navigateTo;

  const uninstallAppReq = null;

  const handleClickCloseSettings = () => {
    navigateTo({
      appName: '@akashaorg/app-articles',
      getNavigationUrl: () => routes[HOME],
    });
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
      onSearch={() => null}
      onClickTopic={handleClickTopic}
      onClickUninstall={handleUninstall}
    />
  );
};

export default ArticleSettingsPage;
