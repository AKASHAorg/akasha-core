import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useGetLoginProfile, useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import ErrorBoundary, {
  ErrorBoundaryProps,
} from '@akashaorg/design-system-core/lib/components/ErrorBoundary';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';

import {
  Overview,
  Moderators,
  ModeratorDetailPage,
  TransparencyLog,
  TransparencyLogItem,
  VibesValue,
  BecomeModeratorPage,
  ApplicationStatusPage,
  ModifyApplicationPage,
  ReportItemPage,
  ApplicationStatusType,
} from '../pages';
import routes, {
  HOME,
  MODERATORS,
  VIEW_MODERATOR,
  HISTORY,
  HISTORY_ITEM,
  MODERATION_VALUE,
  BECOME_MODERATOR,
  CHECK_APPLICATION_STATUS,
  MODIFY_APPLICATION,
  REPORT_ITEM,
} from '../routes';
import { generateModerators } from '../utils';

const AppRoutes: React.FC<unknown> = () => {
  const { baseRouteName, logger, getRoutingPlugin } = useRootComponentProps();
  const { t } = useTranslation('app-vibes');
  const authenticatedProfileReq = useGetLoginProfile();

  const authenticatedProfile = authenticatedProfileReq?.akashaProfile;

  const checkModeratorQuery = { data: 200 }; // modify to connect to actual hook

  const checkModeratorResp = checkModeratorQuery.data;
  // const isModerator = useMemo(() => checkModeratorResp === 200, [checkModeratorResp]);
  const isModerator = false;

  const getModeratorsQuery = { data: generateModerators(), isFetching: false };
  const allModerators = getModeratorsQuery.data;

  const applicationStatus = ApplicationStatusType.approved;

  const navigateTo = getRoutingPlugin().navigateTo;
  const authenticatedDid = authenticatedProfile?.did.id;

  const errorBoundaryProps: Pick<ErrorBoundaryProps, 'errorObj' | 'logger'> = {
    errorObj: {
      type: 'script-error',
      title: t('Error in Vibes app'),
    },
    logger,
  };

  return (
    <Stack customStyle="mb-4">
      <Router basename={baseRouteName}>
        <Routes>
          <Route
            path={routes[HOME]}
            element={
              <ErrorBoundary {...errorBoundaryProps}>
                <Overview
                  user={authenticatedDid}
                  isModerator={isModerator}
                  applicationStatus={applicationStatus}
                  navigateTo={navigateTo}
                />
              </ErrorBoundary>
            }
          />
          <Route
            path={routes[MODERATION_VALUE]}
            element={
              <ErrorBoundary {...errorBoundaryProps}>
                <VibesValue />
              </ErrorBoundary>
            }
          />

          <Route
            path={routes[MODERATORS]}
            element={
              <ErrorBoundary {...errorBoundaryProps}>
                <Moderators
                  isFetchingModerators={getModeratorsQuery.isFetching}
                  moderators={allModerators}
                  navigateTo={navigateTo}
                />
              </ErrorBoundary>
            }
          />
          <Route
            path={routes[VIEW_MODERATOR]}
            element={
              <ErrorBoundary {...errorBoundaryProps}>
                <ModeratorDetailPage navigateTo={navigateTo} />
              </ErrorBoundary>
            }
          />
          <Route
            path={routes[HISTORY]}
            element={
              <ErrorBoundary {...errorBoundaryProps}>
                <TransparencyLog user={authenticatedDid} navigateTo={navigateTo} />
              </ErrorBoundary>
            }
          />
          <Route
            path={routes[HISTORY_ITEM]}
            element={
              <ErrorBoundary {...errorBoundaryProps}>
                <TransparencyLogItem />
              </ErrorBoundary>
            }
          />
          <Route
            path={routes[BECOME_MODERATOR]}
            element={
              <ErrorBoundary {...errorBoundaryProps}>
                <BecomeModeratorPage user={authenticatedDid} navigateTo={navigateTo} />
              </ErrorBoundary>
            }
          />
          <Route
            path={routes[CHECK_APPLICATION_STATUS]}
            element={
              <ErrorBoundary {...errorBoundaryProps}>
                <ApplicationStatusPage
                  applicationStatus={applicationStatus}
                  navigateTo={navigateTo}
                />
              </ErrorBoundary>
            }
          />
          <Route
            path={routes[MODIFY_APPLICATION]}
            element={
              <ErrorBoundary {...errorBoundaryProps}>
                <ModifyApplicationPage navigateTo={navigateTo} />
              </ErrorBoundary>
            }
          />
          <Route
            path={routes[REPORT_ITEM]}
            element={
              <ErrorBoundary {...errorBoundaryProps}>
                <ReportItemPage navigateTo={navigateTo} />
              </ErrorBoundary>
            }
          />
          <Route path="/" element={<Navigate to={routes[HOME]} replace />} />
        </Routes>
      </Router>
    </Stack>
  );
};

export default AppRoutes;
