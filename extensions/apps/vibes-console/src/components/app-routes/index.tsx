import React from 'react';
import {
  CatchBoundary,
  Outlet,
  createRootRouteWithContext,
  createRoute,
  createRouter,
  redirect,
} from '@tanstack/react-router';
import { ICreateRouter, IRouterContext } from '@akashaorg/typings/lib/ui';
import {
  Applications,
  ApplicationDetailPage,
  ApplicationsLog,
  BecomeModerator,
  Dashboard,
  EditMaxApplicants,
  MyApplications,
  SelfApplicationDetailPage,
  Settings,
  WithdrawApplicationPage,
  AssignAdminPage,
  RespondAdminPage,
  ResignRolePage,
  ResignConfirmationPage,
  ReviewItemPage,
  ItemReportsPage,
} from '../../pages';
import routes, {
  APPLICATIONS,
  APPLICATION_DETAIL,
  BECOME_MODERATOR,
  EDIT_MAX_MODERATORS,
  HOME,
  MY_APPLICATIONS,
  MY_APPLICATION_DETAIL,
  DASHBOARD,
  SETTINGS,
  WITHDRAW_APPLICATION,
  ASSIGN_ADMIN,
  RESPOND_ADMIN,
  RESIGN_MODERATOR,
  RESIGN_CONFIRMATION,
  baseDashboardUrl,
} from '../../routes';
import { NotFoundComponent } from './not-found-component';

const rootRoute = createRootRouteWithContext<IRouterContext>()({
  component: Outlet,
  notFoundComponent: () => <NotFoundComponent />,
});

const defaultRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: routes[HOME], replace: true });
  },
});

const applicationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: routes[HOME],
  component: () => {
    return (
      <CatchBoundary getResetKey={() => 'apps_reset'} errorComponent={NotFoundComponent}>
        <Applications />
      </CatchBoundary>
    );
  },
});

const becomeModeratorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: routes[BECOME_MODERATOR],
  component: () => {
    return (
      <CatchBoundary getResetKey={() => 'become_mod_reset'} errorComponent={NotFoundComponent}>
        <BecomeModerator />
      </CatchBoundary>
    );
  },
});

const selfApplicationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: routes[MY_APPLICATIONS],
  component: () => {
    return (
      <CatchBoundary getResetKey={() => 'self_apps_reset'} errorComponent={NotFoundComponent}>
        <MyApplications />
      </CatchBoundary>
    );
  },
});

const selfApplicationDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: routes[MY_APPLICATION_DETAIL],
  component: () => {
    return (
      <CatchBoundary
        getResetKey={() => 'self_apps_detail_reset'}
        errorComponent={NotFoundComponent}
      >
        <SelfApplicationDetailPage />
      </CatchBoundary>
    );
  },
});

const selfApplicationWithdrawRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: routes[WITHDRAW_APPLICATION],
  component: () => {
    return (
      <CatchBoundary
        getResetKey={() => 'self_apps_withdraw_reset'}
        errorComponent={NotFoundComponent}
      >
        <WithdrawApplicationPage />
      </CatchBoundary>
    );
  },
});

const applicationsLogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: routes[APPLICATIONS],
  component: () => {
    return (
      <CatchBoundary getResetKey={() => 'apps_log_reset'} errorComponent={NotFoundComponent}>
        <ApplicationsLog />
      </CatchBoundary>
    );
  },
});

const applicationDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: routes[APPLICATION_DETAIL],
  component: () => {
    return (
      <CatchBoundary getResetKey={() => 'app_detail_reset'} errorComponent={NotFoundComponent}>
        <ApplicationDetailPage />
      </CatchBoundary>
    );
  },
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: routes[DASHBOARD],
  component: () => {
    return (
      <CatchBoundary getResetKey={() => 'dashboard_reset'} errorComponent={NotFoundComponent}>
        <Dashboard />
      </CatchBoundary>
    );
  },
});

const viewItemReportsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: `${baseDashboardUrl}/item/$id/reports`,
  component: () => {
    const { id } = viewItemReportsRoute.useParams();
    return (
      <CatchBoundary
        getResetKey={() => 'view_item_reports_reset'}
        errorComponent={NotFoundComponent}
      >
        <ItemReportsPage id={id} />
      </CatchBoundary>
    );
  },
});

const viewItemReportFlagsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: `${baseDashboardUrl}/item/$id/reports/$reportId`,
  component: () => {
    const { id, reportId } = viewItemReportFlagsRoute.useParams();
    return (
      <CatchBoundary
        getResetKey={() => 'view_item_report_flags_reset'}
        errorComponent={NotFoundComponent}
      >
        <ItemReportsPage id={id} reportId={reportId} />
      </CatchBoundary>
    );
  },
});

const reviewItemRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: `${baseDashboardUrl}/$action/$itemType/$id`,
  component: () => {
    const { action, itemType, id } = reviewItemRoute.useParams();
    return (
      <CatchBoundary getResetKey={() => 'review_item_reset'} errorComponent={NotFoundComponent}>
        <ReviewItemPage action={action} itemType={itemType} id={id} />
      </CatchBoundary>
    );
  },
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: routes[SETTINGS],
  component: () => {
    return (
      <CatchBoundary getResetKey={() => 'settings_reset'} errorComponent={NotFoundComponent}>
        <Settings />
      </CatchBoundary>
    );
  },
});

const editMaxApplicantsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: routes[EDIT_MAX_MODERATORS],
  component: () => {
    return (
      <CatchBoundary
        getResetKey={() => 'edit_max_applicants_reset'}
        errorComponent={NotFoundComponent}
      >
        <EditMaxApplicants />
      </CatchBoundary>
    );
  },
});

const assignAdminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: routes[ASSIGN_ADMIN],
  component: () => {
    return (
      <CatchBoundary getResetKey={() => 'assign_admin_reset'} errorComponent={NotFoundComponent}>
        <AssignAdminPage />
      </CatchBoundary>
    );
  },
});

const respondAdminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: routes[RESPOND_ADMIN],
  component: () => {
    return (
      <CatchBoundary getResetKey={() => 'respond_admin_reset'} errorComponent={NotFoundComponent}>
        <RespondAdminPage />
      </CatchBoundary>
    );
  },
});

const resignModeratorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: routes[RESIGN_MODERATOR],
  component: () => {
    return (
      <CatchBoundary
        getResetKey={() => 'resign_moderator_reset'}
        errorComponent={NotFoundComponent}
      >
        <ResignRolePage />
      </CatchBoundary>
    );
  },
});

const resignConfirmationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: routes[RESIGN_CONFIRMATION],
  component: () => {
    return (
      <CatchBoundary getResetKey={() => 'resign_confirm_reset'} errorComponent={NotFoundComponent}>
        <ResignConfirmationPage />
      </CatchBoundary>
    );
  },
});

const routeTree = rootRoute.addChildren([
  defaultRoute,
  applicationsRoute.addChildren([
    becomeModeratorRoute,
    selfApplicationsRoute,
    selfApplicationDetailRoute,
    selfApplicationWithdrawRoute,
    applicationsLogRoute,
    applicationDetailRoute,
  ]),
  dashboardRoute.addChildren([
    viewItemReportsRoute,
    viewItemReportFlagsRoute,
    reviewItemRoute,
    settingsRoute,
    editMaxApplicantsRoute,
    assignAdminRoute,
    respondAdminRoute,
    resignModeratorRoute,
    resignConfirmationRoute,
  ]),
]);

export const router = ({ baseRouteName, apolloClient }: ICreateRouter) =>
  createRouter({
    routeTree,
    basepath: baseRouteName,
    context: {
      apolloClient,
    },
    defaultErrorComponent: ({ error }) => <NotFoundComponent error={error} />,
  });
