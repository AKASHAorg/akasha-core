import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import DS from '@akashaorg/design-system';
import { RootComponentProps } from '@akashaorg/typings/ui';

import ArticleOnboardingIntro from './onboarding/intro';
import ArticlesOnboardingSteps from './onboarding/onboarding-steps';
import Dashboard from '../pages/dashboard';
import ArticlePage from '../pages/article';
import ArticlesSettings from './settings';

import routes, {
  ARTICLE,
  HOME,
  ONBOARDING_STEP_ONE,
  ONBOARDING_STEP_THREE,
  ONBOARDING_STEP_TWO,
  SETTINGS,
} from '../routes';
import { topics } from './dummy-data';

const { Box } = DS;

const AppRoutes: React.FC<RootComponentProps> = props => {
  const {
    plugins: { routing },
  } = props;
  const [selectedTopics, setSelectedTopics] = React.useState<string[]>(topics.slice(0, 15));

  const { t } = useTranslation('app-articles');

  const isOnboarded = true; // check if user has been onboarded and return appropriately

  const handleClickStart = () => {
    routing.navigateTo({
      appName: '@akashaorg/app-articles',
      getNavigationUrl: () => routes[ONBOARDING_STEP_ONE],
    });
  };

  const handleClickCloseSettings = () => {
    routing.navigateTo({
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
    /** do something */
  };

  return (
    <Box>
      <Router basename={props.baseRouteName}>
        <Routes>
          <Route
            path={routes[HOME]}
            element={
              isOnboarded ? (
                <Dashboard {...props} />
              ) : (
                <ArticleOnboardingIntro
                  titleLabel={t('Welcome to the Article App')}
                  introLabel={t("✨ When a post isn't enough ✨")}
                  descriptionLabel={t(
                    'Join our community of writers, start writing and sharing your knowledge with ethereans',
                  )}
                  buttonLabel={t('Start Tutorial')}
                  onStart={handleClickStart}
                />
              )
            }
          />
          {[
            routes[ONBOARDING_STEP_ONE],
            routes[ONBOARDING_STEP_TWO],
            routes[ONBOARDING_STEP_THREE],
          ].map((path, idx) => (
            <Route
              key={path}
              path={path}
              element={<ArticlesOnboardingSteps {...props} activeIndex={idx} />}
            />
          ))}
          <Route
            path={routes[SETTINGS]}
            element={
              <ArticlesSettings
                titleLabel={t('Article App Settings')}
                subscribedTopicsTitleLabel={t('Topics you are subscribed to')}
                subscribedTopicsSubtitleLabel={t('You can subscribe to as many as you want')}
                subscribedTopics={selectedTopics}
                uninstallLabel={t('Uninstall')}
                onClickCloseSettings={handleClickCloseSettings}
                onClickTopic={handleClickTopic}
                onClickUninstall={handleUninstall}
              />
            }
          />
          <Route path={routes[ARTICLE]} element={<ArticlePage {...props} />} />
          <Route path="/" element={<Navigate to={routes[HOME]} replace />} />
        </Routes>
      </Router>
    </Box>
  );
};

export default AppRoutes;
