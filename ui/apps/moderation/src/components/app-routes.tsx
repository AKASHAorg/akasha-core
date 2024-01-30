import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useGetLoginProfile, useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import ErrorBoundary, {
  ErrorBoundaryProps,
} from '@akashaorg/design-system-core/lib/components/ErrorBoundary';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';

import {
  Dashboard,
  Overview,
  Moderators,
  ModeratorDetailPage,
  DismissModeratorPage,
  TransparencyLog,
  TransparencyLogItem,
  ModerationValue,
  EditCategoriesPage,
  EditContactInfoPage,
  EditMaxApplicantsPage,
  ResignRolePage,
  ResignConfirmationPage,
  AssignAdminPage,
  BecomeModeratorPage,
  ApplicationStatusPage,
  ModifyApplicationPage,
  ReportItemPage,
  ApplicationDetailPage,
  ApplicationsActivityPage,
  ModerationActivityPage,
} from '../pages';
import routes, {
  DASHBOARD,
  DISMISS_MODERATOR,
  EDIT_CATEGORIES,
  EDIT_CONTACT_INFO,
  EDIT_MAX_APPLICANTS,
  RESIGN_CONFIRMATION,
  RESIGN_ROLE,
  HISTORY,
  HISTORY_ITEM,
  HOME,
  MODERATION_VALUE,
  MODERATORS,
  VIEW_MODERATOR,
  ASSIGN_NEW_ADMIN,
  BECOME_MODERATOR,
  CHECK_APPLICATION_STATUS,
  MODIFY_APPLICATION,
  REPORT_ITEM,
  VIEW_APPLICATION_DETAILS,
  APPLICATIONS_ACTIVITY,
  MODERATION_ACTIVITY,
} from '../routes';

const AppRoutes: React.FC<unknown> = () => {
  const { baseRouteName, logger, getRoutingPlugin } = useRootComponentProps();
  const { t } = useTranslation('app-moderation-ewa');
  const authenticatedProfileReq = useGetLoginProfile();

  const authenticatedProfile = authenticatedProfileReq?.akashaProfile;

  const checkModeratorQuery = { data: 200 }; // modify to connect to actual hook

  const checkModeratorResp = checkModeratorQuery.data;

  const isAuthorised = useMemo(() => checkModeratorResp === 200, [checkModeratorResp]);

  const applicationStatus = null;

  const isAdmin = false;

  const navigateTo = getRoutingPlugin().navigateTo;

  const authenticatedDid = authenticatedProfile?.did.id;

  const errorBoundaryProps: Pick<ErrorBoundaryProps, 'errorObj' | 'logger'> = {
    errorObj: {
      type: 'script-error',
      title: t('Error in vibe app'),
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
                  isAuthorised={isAuthorised}
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
                <ModerationValue />
              </ErrorBoundary>
            }
          />
          <Route
            path={routes[DASHBOARD]}
            element={
              <ErrorBoundary {...errorBoundaryProps}>
                <Dashboard
                  user={authenticatedDid}
                  isAuthorised={isAuthorised}
                  isAdmin={isAdmin}
                  navigateTo={navigateTo}
                />
              </ErrorBoundary>
            }
          />
          <Route
            path={routes[EDIT_CATEGORIES]}
            element={
              <ErrorBoundary {...errorBoundaryProps}>
                <EditCategoriesPage user={authenticatedDid} navigateTo={navigateTo} />
              </ErrorBoundary>
            }
          />
          <Route
            path={routes[EDIT_CONTACT_INFO]}
            element={
              <ErrorBoundary {...errorBoundaryProps}>
                <EditContactInfoPage user={authenticatedDid} navigateTo={navigateTo} />
              </ErrorBoundary>
            }
          />
          <Route
            path={routes[EDIT_MAX_APPLICANTS]}
            element={
              <ErrorBoundary {...errorBoundaryProps}>
                <EditMaxApplicantsPage user={authenticatedDid} navigateTo={navigateTo} />
              </ErrorBoundary>
            }
          />
          <Route
            path={routes[RESIGN_ROLE]}
            element={
              <ErrorBoundary {...errorBoundaryProps}>
                <ResignRolePage user={authenticatedDid} isAdmin={isAdmin} navigateTo={navigateTo} />
              </ErrorBoundary>
            }
          />
          <Route
            path={routes[RESIGN_CONFIRMATION]}
            element={
              <ErrorBoundary {...errorBoundaryProps}>
                <ResignConfirmationPage user={authenticatedDid} navigateTo={navigateTo} />
              </ErrorBoundary>
            }
          />
          <Route
            path={routes[ASSIGN_NEW_ADMIN]}
            element={
              <ErrorBoundary {...errorBoundaryProps}>
                <AssignAdminPage user={authenticatedDid} navigateTo={navigateTo} />
              </ErrorBoundary>
            }
          />
          <Route
            path={routes[MODERATORS]}
            element={
              <ErrorBoundary {...errorBoundaryProps}>
                <Moderators navigateTo={navigateTo} />
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
            path={routes[DISMISS_MODERATOR]}
            element={
              <ErrorBoundary {...errorBoundaryProps}>
                <DismissModeratorPage navigateTo={navigateTo} />
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
          <Route
            path={routes[VIEW_APPLICATION_DETAILS]}
            element={
              <ErrorBoundary {...errorBoundaryProps}>
                <ApplicationDetailPage />
              </ErrorBoundary>
            }
          />
          <Route
            path={routes[APPLICATIONS_ACTIVITY]}
            element={
              <ErrorBoundary {...errorBoundaryProps}>
                <ApplicationsActivityPage navigateTo={navigateTo} />
              </ErrorBoundary>
            }
          />
          <Route
            path={routes[MODERATION_ACTIVITY]}
            element={
              <ErrorBoundary {...errorBoundaryProps}>
                <ModerationActivityPage navigateTo={navigateTo} />
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
