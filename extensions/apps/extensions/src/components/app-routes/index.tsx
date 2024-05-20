import React from 'react';
import {
  Outlet,
  createRootRouteWithContext,
  createRoute,
  createRouter,
  redirect,
} from '@tanstack/react-router';
import { CreateRouter, RouterContext } from '@akashaorg/typings/lib/ui';
import {
  AppsPage,
  ExplorePage,
  InfoPage,
  InstalledExtensions,
  MainPage,
  MyAppsPage,
  MyWidgetsPage,
  Overview,
} from '../pages';
import ErrorComponent from './error-component';
import routes, { EXTENSIONS, MY_APPS, MY_WIDGETS, INSTALLED, INFO, HOME } from '../../routes';

const rootRoute = createRootRouteWithContext<RouterContext>()({
  component: Outlet,
});

const defaultRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: routes[HOME], replace: true });
  },
});

const overviewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: routes[HOME],
  component: Overview,
});

const installedExtensionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: routes[INSTALLED],
  component: InstalledExtensions,
});

const mainRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'main',
  component: MainPage,
});

const exploreRoute = createRoute({
  getParentRoute: () => mainRoute,
  path: routes[EXTENSIONS],
  component: ExplorePage,
});

const appsRoute = createRoute({
  getParentRoute: () => mainRoute,
  path: routes[INSTALLED],
  component: AppsPage,
});

const myAppsRoute = createRoute({
  getParentRoute: () => mainRoute,
  path: routes[MY_APPS],
  component: MyAppsPage,
});

const myWidgetsRoute = createRoute({
  getParentRoute: () => mainRoute,
  path: routes[MY_WIDGETS],
  component: MyWidgetsPage,
});

const infoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: `$appId${routes[INFO]}`,
  component: () => {
    const { appId } = infoRoute.useParams();
    return <InfoPage appId={appId} />;
  },
});

const routeTree = rootRoute.addChildren([
  defaultRoute,
  overviewRoute,
  installedExtensionsRoute,
  mainRoute.addChildren([exploreRoute, appsRoute, myAppsRoute, myWidgetsRoute]),
  infoRoute,
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
