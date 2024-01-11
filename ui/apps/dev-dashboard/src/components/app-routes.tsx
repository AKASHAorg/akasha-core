import React from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import ErrorBoundary, {
  ErrorBoundaryProps,
} from '@akashaorg/design-system-core/lib/components/ErrorBoundary';
import Helmet from '@akashaorg/design-system-core/lib/components/Helmet';
import {
  AddDevKey,
  DevDashOnboardingIntro,
  DevDashOnboardingSteps,
  DevDashboard,
  DevKeysCard,
  EditMessageName,
  PublishedApps,
  SignMessage,
  VerifySignature,
} from '../pages';
import routes, {
  ONBOARDING,
  DASHBOARD,
  ONBOARDING_STEP_ONE,
  ONBOARDING_STEP_TWO,
  ONBOARDING_STEP_THREE,
  ONBOARDING_STEP_FOUR,
  DEV_KEYS,
  ADD_DEV_KEY,
  PUBLISHED_APPS,
  SIGN_MESSAGE,
  VERIFY_SIGNATURE,
  EDIT_MESSAGE_NAME,
} from '../routes';

const AppRoutes: React.FC<unknown> = () => {
  const { baseRouteName, logger } = useRootComponentProps();
  const { t } = useTranslation('app-dev-dashboard');

  const props: Pick<ErrorBoundaryProps, 'errorObj' | 'logger'> = {
    errorObj: {
      type: t('script-error'),
      title: t('Error in dev dashboard app'),
    },
    logger,
  };

  return (
    <Router basename={baseRouteName}>
      <Helmet>
        <title>Dev Dashboard | Ethereum World</title>
      </Helmet>

      <Routes>
        <Route
          path={routes[DASHBOARD]}
          element={
            <ErrorBoundary {...props}>
              <DevDashboard />
            </ErrorBoundary>
          }
        />
        <Route
          path={routes[ONBOARDING]}
          element={
            <ErrorBoundary {...props}>
              <DevDashOnboardingIntro />
            </ErrorBoundary>
          }
        />
        {[
          routes[ONBOARDING_STEP_ONE],
          routes[ONBOARDING_STEP_TWO],
          routes[ONBOARDING_STEP_THREE],
          routes[ONBOARDING_STEP_FOUR],
        ].map((path, idx) => (
          <Route
            key={path + idx}
            path={path}
            element={
              <ErrorBoundary {...props}>
                <DevDashOnboardingSteps activeIndex={idx} />
              </ErrorBoundary>
            }
          />
        ))}
        <Route
          path={routes[DEV_KEYS]}
          element={
            <ErrorBoundary {...props}>
              <DevKeysCard />
            </ErrorBoundary>
          }
        />
        <Route
          path={routes[ADD_DEV_KEY]}
          element={
            <ErrorBoundary {...props}>
              <AddDevKey />
            </ErrorBoundary>
          }
        />
        <Route
          path={routes[EDIT_MESSAGE_NAME]}
          element={
            <ErrorBoundary {...props}>
              <EditMessageName />
            </ErrorBoundary>
          }
        />
        <Route
          path={routes[PUBLISHED_APPS]}
          element={
            <ErrorBoundary {...props}>
              <PublishedApps />
            </ErrorBoundary>
          }
        />
        <Route
          path={routes[SIGN_MESSAGE]}
          element={
            <ErrorBoundary {...props}>
              <SignMessage />
            </ErrorBoundary>
          }
        />
        <Route
          path={routes[VERIFY_SIGNATURE]}
          element={
            <ErrorBoundary {...props}>
              <VerifySignature />
            </ErrorBoundary>
          }
        />
        <Route path="/" element={<Navigate to={routes[DASHBOARD]} replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
