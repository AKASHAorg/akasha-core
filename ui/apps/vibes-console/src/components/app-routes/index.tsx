import React from 'react';
import {
  Outlet,
  createRootRouteWithContext,
  createRoute,
  createRouter,
} from '@tanstack/react-router';
import { CreateRouter, RouterContext } from '@akashaorg/typings/lib/ui';
import ErrorComponent from './error-component';
import {
  Applications,
  ApplicationDetailPage,
  ApplicationsLog,
  BecomeModerator,
  Dashboard,
  MyApplications,
  SelfApplicationDetailPage,
  Settings,
  WithdrawApplicationPage,
} from '../../pages';
import routes, {
  APPLICATIONS,
  APPLICATION_DETAIL,
  BECOME_MODERATOR,
  HOME,
  MY_APPLICATIONS,
  MY_APPLICATION_DETAIL,
  WITHDRAW_APPLICATION,
} from '../../routes';

const rootRoute = createRootRouteWithContext<RouterContext>()({
  component: Outlet,
});

const applicationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: routes[HOME],
  component: () => {
    return <Applications />;
  },
});

const becomeModeratorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: routes[BECOME_MODERATOR],
  component: () => {
    return <BecomeModerator />;
  },
});

const selfApplicationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: routes[MY_APPLICATIONS],
  component: () => {
    return <MyApplications />;
  },
});

const selfApplicationDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: routes[MY_APPLICATION_DETAIL],
  component: () => {
    return <SelfApplicationDetailPage />;
  },
});

const selfApplicationWithdrawRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: routes[WITHDRAW_APPLICATION],
  component: () => {
    return <WithdrawApplicationPage />;
  },
});

const applicationsLogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: routes[APPLICATIONS],
  component: () => {
    return <ApplicationsLog />;
  },
});

const applicationDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: routes[APPLICATION_DETAIL],
  component: () => {
    return <ApplicationDetailPage />;
  },
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: () => {
    return <Dashboard />;
  },
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: () => {
    return <Settings />;
  },
});

const routeTree = rootRoute.addChildren([
  applicationsRoute.addChildren([
    becomeModeratorRoute,
    selfApplicationsRoute,
    selfApplicationDetailRoute,
    selfApplicationWithdrawRoute,
    applicationsLogRoute,
    applicationDetailRoute,
  ]),
  dashboardRoute,
  settingsRoute,
]);

// @todo: update to use type from typings package
export const router = ({ baseRouteName, apolloClient }: CreateRouter) =>
  createRouter({
    routeTree,
    basepath: baseRouteName,
    context: {
      apolloClient,
    },
    defaultErrorComponent: ({ error }) => (
      <ErrorComponent error={(error as unknown as Error).message} />
    ),
  });
