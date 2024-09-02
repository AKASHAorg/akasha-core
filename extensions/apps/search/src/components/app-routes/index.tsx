import React from 'react';
import SearchPage from '../pages/search-page';
import OnboardingPage from '../pages/onboarding-page';
import SettingsPage from '../pages/search-settings-page';
import ErrorComponent from './error-component';
import routes, { ONBOARDING, RESULTS, SETTINGS } from '../../routes';
import {
  CatchBoundary,
  Outlet,
  createRootRouteWithContext,
  createRoute,
  createRouter,
  redirect,
} from '@tanstack/react-router';
import { ICreateRouter, IRouterContext } from '@akashaorg/typings/lib/ui';
import { NotFoundComponent } from './not-found-component';

const rootRoute = createRootRouteWithContext<IRouterContext>()({
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
  notFoundComponent: () => <NotFoundComponent />,
  component: () => (
    <CatchBoundary getResetKey={() => 'settings_reset'} errorComponent={NotFoundComponent}>
      <SettingsPage />
    </CatchBoundary>
  ),
});

const searchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: `${routes[RESULTS]}`,
  notFoundComponent: () => <NotFoundComponent />,
});

const searchIndexRoute = createRoute({
  getParentRoute: () => searchRoute,
  path: `/`,
  notFoundComponent: () => <NotFoundComponent />,
  component: () => (
    <CatchBoundary getResetKey={() => 'search_index_reset'} errorComponent={NotFoundComponent}>
      <SearchPage />
    </CatchBoundary>
  ),
});

const resultsRoute = createRoute({
  getParentRoute: () => searchRoute,
  path: `$searchKeyword`,
  notFoundComponent: () => <NotFoundComponent />,
  component: () => {
    const { searchKeyword } = resultsRoute.useParams();
    return (
      <CatchBoundary getResetKey={() => 'search_results_reset'} errorComponent={NotFoundComponent}>
        <SearchPage searchKeyword={searchKeyword} />;
      </CatchBoundary>
    );
  },
});

const onboardingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: `${routes[ONBOARDING]}`,
  notFoundComponent: () => <NotFoundComponent />,
  component: () => (
    <CatchBoundary getResetKey={() => 'onboarding_reset'} errorComponent={NotFoundComponent}>
      <OnboardingPage />
    </CatchBoundary>
  ),
});

const routeTree = rootRoute.addChildren([
  defaultRoute,
  settingsRoute,
  searchRoute.addChildren([resultsRoute, searchIndexRoute]),
  onboardingRoute,
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
