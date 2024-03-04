import React from 'react';
import { Outlet, Route, Router, rootRouteWithContext } from '@tanstack/react-router';
import ErrorComponent from './error-component';
import { Applications, BecomeModerator, Dashboard, Settings } from '../../pages';

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
  applicationsRoute,
  becomeModeratorRoute,
  dashboardRoute,
  settingsRoute,
]);

// @todo: update to use type from typings package
export const createRouter = ({ baseRouteName }: { baseRouteName: string }) =>
  new Router({
    routeTree,
    basepath: baseRouteName,
    defaultErrorComponent: ({ error }) => (
      <ErrorComponent error={(error as unknown as Error).message} />
    ),
  });
