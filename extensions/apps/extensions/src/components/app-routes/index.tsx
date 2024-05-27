import React from 'react';
import {
  Outlet,
  createRootRouteWithContext,
  createRoute,
  createRouter,
  redirect,
} from '@tanstack/react-router';
import { CreateRouter, RouterContext } from '@akashaorg/typings/lib/ui';
import { ExplorePage, ExtensionsHubPage, InfoPage, InstalledExtensionsPage } from '../pages';
import ErrorComponent from './error-component';
import routes, { EXTENSIONS, INSTALLED, HOME } from '../../routes';

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

const exploreRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: routes[HOME],
  component: ExplorePage,
});

const extensionsHubRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: routes[EXTENSIONS],
  component: ExtensionsHubPage,
});

const installedExtensionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: routes[INSTALLED],
  component: InstalledExtensionsPage,
});

const infoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/info/$appId',
  component: () => {
    const { appId } = infoRoute.useParams();
    return <InfoPage appId={appId} />;
  },
});

const routeTree = rootRoute.addChildren([
  defaultRoute,
  exploreRoute,
  extensionsHubRoute,
  installedExtensionsRoute,
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
