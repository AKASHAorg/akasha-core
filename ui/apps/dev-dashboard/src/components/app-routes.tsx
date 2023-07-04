import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { RootComponentProps } from '@akashaorg/typings/ui';

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

const AppRoutes = (props: RootComponentProps) => {
  const { baseRouteName } = props;

  return (
    <Router basename={baseRouteName}>
      <Helmet>
        <title>Dev Dashboard | Ethereum World</title>
      </Helmet>

      <Routes>
        <Route path="/" element={<Navigate to={routes[DASHBOARD]} replace />} />

        <Route path={routes[DASHBOARD]} element={<DevDashboard {...props} />} />

        <Route path={routes[ONBOARDING]} element={<DevDashOnboardingIntro {...props} />} />

        {[
          routes[ONBOARDING_STEP_ONE],
          routes[ONBOARDING_STEP_TWO],
          routes[ONBOARDING_STEP_THREE],
          routes[ONBOARDING_STEP_FOUR],
        ].map((path, idx) => (
          <Route
            key={path}
            path={path}
            element={<DevDashOnboardingSteps {...props} activeIndex={idx} />}
          />
        ))}

        <Route path={routes[DEV_KEYS]} element={<DevKeysCard {...props} />} />

        <Route path={routes[ADD_DEV_KEY]} element={<AddDevKey {...props} />} />

        <Route path={routes[EDIT_MESSAGE_NAME]} element={<EditMessageName {...props} />} />

        <Route path={routes[PUBLISHED_APPS]} element={<PublishedApps {...props} />} />

        <Route path={routes[SIGN_MESSAGE]} element={<SignMessage {...props} />} />

        <Route path={routes[VERIFY_SIGNATURE]} element={<VerifySignature {...props} />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
