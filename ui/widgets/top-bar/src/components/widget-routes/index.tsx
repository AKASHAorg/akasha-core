import React from 'react';
import { rootRouteWithContext, Router } from '@tanstack/react-router';
import RootComponent from './root-component';
import ErrorComponent from './error-component';

const rootRoute = rootRouteWithContext()({
  component: RootComponent,
});

const routeTree = rootRoute;

export const createRouter = () =>
  new Router({
    routeTree,
    basepath: '',
    defaultErrorComponent: ({ error }) => (
      <ErrorComponent error={(error as unknown as Error).message} />
    ),
  });
