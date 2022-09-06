import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import DS from '@akashaorg/design-system';
import { RootComponentProps } from '@akashaorg/typings/ui';

import ArticleOnboardingIntro from './onboarding/intro';
import ArticlesOnboardingSteps from './onboarding/onboarding-steps';
import Dashboard from '../pages/dashboard';
import ArticlePage from '../pages/article';
import MyArticles from '../pages/my-articles';
import ArticleSettingsPage from '../pages/settings';
import ArticleEditor from '../pages/article-editor';
import ArticleCardSettingsPage from '../pages/article-card-settings';

import routes, {
  ARTICLE,
  ARTICLE_SETTINGS,
  EDIT_ARTICLE,
  HOME,
  MY_ARTICLES,
  ONBOARDING_STEP_ONE,
  ONBOARDING_STEP_THREE,
  ONBOARDING_STEP_TWO,
  SETTINGS,
  WRITE_ARTICLE,
} from '../routes';

const { Box } = DS;

const AppRoutes: React.FC<RootComponentProps> = props => {
  const {
    plugins: { routing },
  } = props;

  const { t } = useTranslation('app-articles');

  const isOnboarded = true; // check if user has been onboarded and return appropriately

  const handleClickStart = () => {
    routing.navigateTo({
      appName: '@akashaorg/app-articles',
      getNavigationUrl: () => routes[ONBOARDING_STEP_ONE],
    });
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

          <Route path={routes[MY_ARTICLES]} element={<MyArticles {...props} />} />

          {[routes[WRITE_ARTICLE], routes[EDIT_ARTICLE]].map((path, idx) => (
            <Route key={path + idx} path={path} element={<ArticleEditor {...props} />} />
          ))}

          {[
            routes[ONBOARDING_STEP_ONE],
            routes[ONBOARDING_STEP_TWO],
            routes[ONBOARDING_STEP_THREE],
          ].map((path, idx) => (
            <Route
              key={path + idx}
              path={path}
              element={<ArticlesOnboardingSteps {...props} activeIndex={idx} />}
            />
          ))}
          <Route path={routes[SETTINGS]} element={<ArticleSettingsPage {...props} />} />

          <Route path={routes[ARTICLE]} element={<ArticlePage {...props} />} />

          <Route path={routes[ARTICLE_SETTINGS]} element={<ArticleCardSettingsPage {...props} />} />

          <Route path="/" element={<Navigate to={routes[HOME]} replace />} />
        </Routes>
      </Router>
    </Box>
  );
};

export default AppRoutes;
