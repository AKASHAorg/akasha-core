import React from 'react';
import SearchPage from '../pages/search-page';
import OnboardingPage from '../pages/onboarding-page';
import SettingsPage from '../pages/search-settings-page';
import ErrorComponent from './error-component';
import routes, { ONBOARDING, RESULTS, SETTINGS } from '../../routes';
import {
  Outlet,
  createRootRouteWithContext,
  createRoute,
  createRouter,
  redirect,
} from '@tanstack/react-router';

import { CreateRouter, RouterContext } from '@akashaorg/typings/lib/ui';

const rootRoute = createRootRouteWithContext<RouterContext>()({
  component: Outlet,
});

const defaultRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: routes[RESULTS], replace: true });
  },
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: `${routes[SETTINGS]}`,
  component: SettingsPage,
});

const searchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: `${routes[RESULTS]}`,
});

const searchIndexRoute = createRoute({
  getParentRoute: () => searchRoute,
  path: `/`,
  component: SearchPage,
});

const resultsRoute = createRoute({
  getParentRoute: () => searchRoute,
  path: `$searchKeyword`,
  component: () => {
    const { searchKeyword } = resultsRoute.useParams();
    return <SearchPage searchKeyword={searchKeyword} />;
  },
});

const onboardingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: `${routes[ONBOARDING]}`,
  component: OnboardingPage,
});

const routeTree = rootRoute.addChildren([
  defaultRoute,
  settingsRoute,
  searchRoute.addChildren([resultsRoute, searchIndexRoute]),
  onboardingRoute,
]);

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
