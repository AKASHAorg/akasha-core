import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useGetLoginProfile, useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import ErrorBoundary, {
  ErrorBoundaryProps,
} from '@akashaorg/design-system-core/lib/components/ErrorBoundary';
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

  const checkModeratorQuery = { data: 200 };

  const checkModeratorResp = checkModeratorQuery.data;

  const isAuthorised = useMemo(() => checkModeratorResp === 200, [checkModeratorResp]);

  const applicationStatus = null;

  const isAdmin = false;

  const navigateTo = getRoutingPlugin().navigateTo;

  const props: Pick<ErrorBoundaryProps, 'errorObj' | 'logger'> = {
    errorObj: {
      type: t('script-error'),
      title: t('Error in vibe app'),
    },
    logger,
  };

  return (
    <Router basename={baseRouteName}>
      <Routes>
        <Route
          path={routes[HOME]}
          element={
            <ErrorBoundary {...props}>
              <Overview
                user={authenticatedProfile?.did.id}
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
            <ErrorBoundary {...props}>
              <ModerationValue />
            </ErrorBoundary>
          }
        />
        <Route
          path={routes[DASHBOARD]}
          element={
            <ErrorBoundary {...props}>
              <Dashboard
                user={authenticatedProfile?.did.id}
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
            <ErrorBoundary {...props}>
              <EditCategoriesPage user={authenticatedProfile?.did.id} navigateTo={navigateTo} />
            </ErrorBoundary>
          }
        />
        <Route
          path={routes[EDIT_CONTACT_INFO]}
          element={
            <ErrorBoundary {...props}>
              <EditContactInfoPage user={authenticatedProfile?.did.id} navigateTo={navigateTo} />
            </ErrorBoundary>
          }
        />
        <Route
          path={routes[EDIT_MAX_APPLICANTS]}
          element={
            <ErrorBoundary {...props}>
              <EditMaxApplicantsPage user={authenticatedProfile?.did.id} navigateTo={navigateTo} />
            </ErrorBoundary>
          }
        />
        <Route
          path={routes[RESIGN_ROLE]}
          element={
            <ErrorBoundary {...props}>
              <ResignRolePage
                user={authenticatedProfile?.did.id}
                isAdmin={isAdmin}
                navigateTo={navigateTo}
              />
            </ErrorBoundary>
          }
        />
        <Route
          path={routes[RESIGN_CONFIRMATION]}
          element={
            <ErrorBoundary {...props}>
              <ResignConfirmationPage user={authenticatedProfile?.did.id} navigateTo={navigateTo} />
            </ErrorBoundary>
          }
        />
        <Route
          path={routes[ASSIGN_NEW_ADMIN]}
          element={
            <ErrorBoundary {...props}>
              <AssignAdminPage user={authenticatedProfile?.did.id} navigateTo={navigateTo} />
            </ErrorBoundary>
          }
        />
        <Route
          path={routes[MODERATORS]}
          element={
            <ErrorBoundary {...props}>
              <Moderators navigateTo={navigateTo} />
            </ErrorBoundary>
          }
        />
        <Route
          path={routes[VIEW_MODERATOR]}
          element={
            <ErrorBoundary {...props}>
              <ModeratorDetailPage navigateTo={navigateTo} />
            </ErrorBoundary>
          }
        />
        <Route
          path={routes[DISMISS_MODERATOR]}
          element={
            <ErrorBoundary {...props}>
              <DismissModeratorPage navigateTo={navigateTo} />
            </ErrorBoundary>
          }
        />
        <Route
          path={routes[HISTORY]}
          element={
            <ErrorBoundary {...props}>
              <TransparencyLog user={authenticatedProfile?.did.id} navigateTo={navigateTo} />
            </ErrorBoundary>
          }
        />
        <Route
          path={routes[HISTORY_ITEM]}
          element={
            <ErrorBoundary {...props}>
              <TransparencyLogItem />
            </ErrorBoundary>
          }
        />
        <Route
          path={routes[BECOME_MODERATOR]}
          element={
            <ErrorBoundary {...props}>
              <BecomeModeratorPage user={authenticatedProfile?.did.id} navigateTo={navigateTo} />
            </ErrorBoundary>
          }
        />
        <Route
          path={routes[CHECK_APPLICATION_STATUS]}
          element={
            <ErrorBoundary {...props}>
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
            <ErrorBoundary {...props}>
              <ModifyApplicationPage navigateTo={navigateTo} />
            </ErrorBoundary>
          }
        />
        <Route
          path={routes[REPORT_ITEM]}
          element={
            <ErrorBoundary {...props}>
              <ReportItemPage navigateTo={navigateTo} />
            </ErrorBoundary>
          }
        />
        <Route
          path={routes[VIEW_APPLICATION_DETAILS]}
          element={
            <ErrorBoundary {...props}>
              <ApplicationDetailPage />
            </ErrorBoundary>
          }
        />
        <Route
          path={routes[APPLICATIONS_ACTIVITY]}
          element={
            <ErrorBoundary {...props}>
              <ApplicationsActivityPage navigateTo={navigateTo} />
            </ErrorBoundary>
          }
        />
        <Route
          path={routes[MODERATION_ACTIVITY]}
          element={
            <ErrorBoundary {...props}>
              <ModerationActivityPage navigateTo={navigateTo} />
            </ErrorBoundary>
          }
        />
        <Route path="/" element={<Navigate to={routes[HOME]} replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
