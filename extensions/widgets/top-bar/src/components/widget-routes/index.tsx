import React from 'react';
import { createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router';
import RootComponent from './root-component';
import ErrorComponent from './error-component';

const rootRoute = createRootRoute({
  component: Outlet,
});

const defaultRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/$',
  component: RootComponent,
});

const routeTree = rootRoute.addChildren([defaultRoute]);

export const router = createRouter({
  routeTree,
  defaultErrorComponent: ({ error }) => (
    <ErrorComponent error={(error as unknown as Error).message} />
  ),
});
