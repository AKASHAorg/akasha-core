import React from 'react';
import { Outlet, Route, Router, rootRouteWithContext } from '@tanstack/react-router';
import { CreateRouter } from '@akashaorg/typings/lib/ui';
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

const rootRoute = rootRouteWithContext()({
  component: Outlet,
});

const applicationsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: routes[HOME],
  component: () => {
    return <Applications />;
  },
});

const becomeModeratorRoute = new Route({
  getParentRoute: () => rootRoute,
  path: routes[BECOME_MODERATOR],
  component: () => {
    return <BecomeModerator />;
  },
});

const selfApplicationsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: routes[MY_APPLICATIONS],
  component: () => {
    return <MyApplications />;
  },
});

const selfApplicationDetailRoute = new Route({
  getParentRoute: () => rootRoute,
  path: routes[MY_APPLICATION_DETAIL],
  component: () => {
    return <SelfApplicationDetailPage />;
  },
});

const selfApplicationWithdrawRoute = new Route({
  getParentRoute: () => rootRoute,
  path: routes[WITHDRAW_APPLICATION],
  component: () => {
    return <WithdrawApplicationPage />;
  },
});

const applicationsLogRoute = new Route({
  getParentRoute: () => rootRoute,
  path: routes[APPLICATIONS],
  component: () => {
    return <ApplicationsLog />;
  },
});

const applicationDetailRoute = new Route({
  getParentRoute: () => rootRoute,
  path: routes[APPLICATION_DETAIL],
  component: () => {
    return <ApplicationDetailPage />;
  },
});

const dashboardRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: () => {
    return <Dashboard />;
  },
});

const settingsRoute = new Route({
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
export const createRouter = ({ baseRouteName }: CreateRouter) =>
  new Router({
    routeTree,
    basepath: baseRouteName,
    defaultErrorComponent: ({ error }) => (
      <ErrorComponent error={(error as unknown as Error).message} />
    ),
  });
