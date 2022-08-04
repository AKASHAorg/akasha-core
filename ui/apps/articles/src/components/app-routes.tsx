import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import DS from '@akashaorg/design-system';
import { RootComponentProps } from '@akashaorg/ui-awf-typings';

import ArticleOnboardingIntro from './onboarding/intro';
import ArticlesOnboardingSteps from './onboarding/onboarding-steps';

import routes, {
  HOME,
  ONBOARDING_STEP_ONE,
  ONBOARDING_STEP_THREE,
  ONBOARDING_STEP_TWO,
} from '../routes';

const { Box } = DS;

const AppRoutes: React.FC<RootComponentProps> = props => {
  const {
    plugins: { routing },
  } = props;

  const { t } = useTranslation('app-articles');

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
              <ArticleOnboardingIntro
                titleLabel={t('Welcome to the Article App')}
                introLabel={t("✨ When a post isn't enough ✨")}
                descriptionLabel={t(
                  'Join our community of writers, start writing and sharing your knowledge with ethereans',
                )}
                buttonLabel={t('Start Tutorial')}
                onStart={handleClickStart}
              />
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
          <Route path="/" element={<Navigate to={routes[HOME]} replace />} />
        </Routes>
      </Router>
    </Box>
  );
};

export default AppRoutes;
