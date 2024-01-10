import React from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import ErrorBoundary from '@akashaorg/design-system-core/lib/components/ErrorBoundary';
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

  return (
    <ErrorBoundary
      errorObj={{
        type: t('script-error'),
        title: t('Error in dev dashboard app'),
      }}
      logger={logger}
    >
      <Router basename={baseRouteName}>
        <Helmet>
          <title>Dev Dashboard | Ethereum World</title>
        </Helmet>

        <Routes>
          <Route path="/" element={<Navigate to={routes[DASHBOARD]} replace />} />

          <Route path={routes[DASHBOARD]} element={<DevDashboard />} />

          <Route path={routes[ONBOARDING]} element={<DevDashOnboardingIntro />} />

          {[
            routes[ONBOARDING_STEP_ONE],
            routes[ONBOARDING_STEP_TWO],
            routes[ONBOARDING_STEP_THREE],
            routes[ONBOARDING_STEP_FOUR],
          ].map((path, idx) => (
            <Route key={path} path={path} element={<DevDashOnboardingSteps activeIndex={idx} />} />
          ))}

          <Route path={routes[DEV_KEYS]} element={<DevKeysCard />} />

          <Route path={routes[ADD_DEV_KEY]} element={<AddDevKey />} />

          <Route path={routes[EDIT_MESSAGE_NAME]} element={<EditMessageName />} />

          <Route path={routes[PUBLISHED_APPS]} element={<PublishedApps />} />

          <Route path={routes[SIGN_MESSAGE]} element={<SignMessage />} />

          <Route path={routes[VERIFY_SIGNATURE]} element={<VerifySignature />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
};

export default AppRoutes;
