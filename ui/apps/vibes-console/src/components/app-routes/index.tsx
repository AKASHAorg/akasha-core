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

const rootRoute = rootRouteWithContext()({
  component: Outlet,
});

const applicationsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/applications-center',
  component: () => {
    return <Applications />;
  },
});

const becomeModeratorRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/applications-center/become-a-moderator',
  component: () => {
    return <BecomeModerator />;
  },
});

const selfApplicationsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/applications-center/my-applications',
  component: () => {
    return <MyApplications />;
  },
});

const selfApplicationDetailRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/applications-center/my-applications/$applicationId',
  component: () => {
    const { applicationId } = applicationDetailRoute.useParams();
    return <SelfApplicationDetailPage applicationId={applicationId} />;
  },
});

const selfApplicationWithdrawRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/applications-center/my-applications/$applicationId/withdraw',
  component: () => {
    const { applicationId } = applicationDetailRoute.useParams();
    return <WithdrawApplicationPage applicationId={applicationId} />;
  },
});

const applicationsLogRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/applications-center/applications',
  component: () => {
    return <ApplicationsLog />;
  },
});

const applicationDetailRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/applications-center/applications/$applicationId',
  component: () => {
    const { applicationId } = applicationDetailRoute.useParams();
    return <ApplicationDetailPage applicationId={applicationId} />;
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
