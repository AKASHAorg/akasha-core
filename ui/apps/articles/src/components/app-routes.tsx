import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import ErrorBoundary from '@akashaorg/design-system-core/lib/components/ErrorBoundary';
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

const AppRoutes: React.FC<unknown> = () => {
  const { baseRouteName, logger } = useRootComponentProps();
  const { t } = useTranslation('app-articles');

  return (
    <ErrorBoundary
      errorObj={{
        type: t('script-error'),
        title: t('Error in articles app'),
      }}
      logger={logger}
    >
      <Router basename={baseRouteName}>
        <Routes>
          <Route path={routes[HOME]} element={<Dashboard />} />

          <Route path={routes[MY_ARTICLES]} element={<MyArticles />} />

          {[routes[WRITE_ARTICLE], routes[EDIT_ARTICLE]].map((path, idx) => (
            <Route key={path + idx} path={path} element={<ArticleEditor />} />
          ))}

          {[
            routes[ONBOARDING_STEP_ONE],
            routes[ONBOARDING_STEP_TWO],
            routes[ONBOARDING_STEP_THREE],
          ].map((path, idx) => (
            <Route
              key={path + idx}
              path={path}
              element={<ArticlesOnboardingSteps activeIndex={idx} />}
            />
          ))}
          <Route path={routes[SETTINGS]} element={<ArticleSettingsPage />} />

          <Route path={routes[ARTICLE]} element={<ArticlePage />} />

          <Route path={routes[ARTICLE_SETTINGS]} element={<ArticleCardSettingsPage />} />

          <Route path="/" element={<Navigate to={routes[HOME]} replace />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
};

export default AppRoutes;
