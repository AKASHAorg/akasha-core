import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useGetLoginProfile, useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import ErrorBoundary from '@akashaorg/design-system-core/lib/components/ErrorBoundary';
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

  return (
    <ErrorBoundary
      errorObj={{
        type: t('script-error'),
        title: t('Error in vibe app'),
      }}
      logger={logger}
    >
      <Router basename={baseRouteName}>
        <Routes>
          <Route
            path={routes[HOME]}
            element={
              <Overview
                user={authenticatedProfile?.did.id}
                isAuthorised={isAuthorised}
                applicationStatus={applicationStatus}
                navigateTo={navigateTo}
              />
            }
          />

          <Route path={routes[MODERATION_VALUE]} element={<ModerationValue />} />

          <Route
            path={routes[DASHBOARD]}
            element={
              <Dashboard
                user={authenticatedProfile?.did.id}
                isAuthorised={isAuthorised}
                isAdmin={isAdmin}
                navigateTo={navigateTo}
              />
            }
          />

          <Route
            path={routes[EDIT_CATEGORIES]}
            element={
              <EditCategoriesPage user={authenticatedProfile?.did.id} navigateTo={navigateTo} />
            }
          />

          <Route
            path={routes[EDIT_CONTACT_INFO]}
            element={
              <EditContactInfoPage user={authenticatedProfile?.did.id} navigateTo={navigateTo} />
            }
          />

          <Route
            path={routes[EDIT_MAX_APPLICANTS]}
            element={
              <EditMaxApplicantsPage user={authenticatedProfile?.did.id} navigateTo={navigateTo} />
            }
          />

          <Route
            path={routes[RESIGN_ROLE]}
            element={
              <ResignRolePage
                user={authenticatedProfile?.did.id}
                isAdmin={isAdmin}
                navigateTo={navigateTo}
              />
            }
          />

          <Route
            path={routes[RESIGN_CONFIRMATION]}
            element={
              <ResignConfirmationPage user={authenticatedProfile?.did.id} navigateTo={navigateTo} />
            }
          />

          <Route
            path={routes[ASSIGN_NEW_ADMIN]}
            element={
              <AssignAdminPage user={authenticatedProfile?.did.id} navigateTo={navigateTo} />
            }
          />

          <Route path={routes[MODERATORS]} element={<Moderators navigateTo={navigateTo} />} />

          <Route
            path={routes[VIEW_MODERATOR]}
            element={<ModeratorDetailPage navigateTo={navigateTo} />}
          />

          <Route
            path={routes[DISMISS_MODERATOR]}
            element={<DismissModeratorPage navigateTo={navigateTo} />}
          />

          <Route
            path={routes[HISTORY]}
            element={
              <TransparencyLog user={authenticatedProfile?.did.id} navigateTo={navigateTo} />
            }
          />

          <Route path={routes[HISTORY_ITEM]} element={<TransparencyLogItem />} />

          <Route
            path={routes[BECOME_MODERATOR]}
            element={
              <BecomeModeratorPage user={authenticatedProfile?.did.id} navigateTo={navigateTo} />
            }
          />

          <Route
            path={routes[CHECK_APPLICATION_STATUS]}
            element={
              <ApplicationStatusPage
                applicationStatus={applicationStatus}
                navigateTo={navigateTo}
              />
            }
          />

          <Route
            path={routes[MODIFY_APPLICATION]}
            element={<ModifyApplicationPage navigateTo={navigateTo} />}
          />

          <Route path={routes[REPORT_ITEM]} element={<ReportItemPage navigateTo={navigateTo} />} />

          <Route path={routes[VIEW_APPLICATION_DETAILS]} element={<ApplicationDetailPage />} />

          <Route
            path={routes[APPLICATIONS_ACTIVITY]}
            element={<ApplicationsActivityPage navigateTo={navigateTo} />}
          />

          <Route
            path={routes[MODERATION_ACTIVITY]}
            element={<ModerationActivityPage navigateTo={navigateTo} />}
          />

          <Route path="/" element={<Navigate to={routes[HOME]} replace />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
};

export default AppRoutes;
