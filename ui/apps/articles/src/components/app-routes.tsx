import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import DS from '@akashaorg/design-system';
import { RootComponentProps } from '@akashaorg/ui-awf-typings';

import ArticleOnboardingIntro from './onboarding/intro';
import routes, { HOME } from '../routes';

const { Box } = DS;

const AppRoutes: React.FC<RootComponentProps> = props => {
  const { t } = useTranslation('app-articles');

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
                onStart={() => null}
              />
            }
          />
          <Route path="/" element={<Navigate to={routes[HOME]} replace />} />
        </Routes>
      </Router>
    </Box>
  );
};

export default AppRoutes;
