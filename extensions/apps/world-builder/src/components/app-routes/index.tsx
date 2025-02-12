import React from 'react';
import {
  CatchBoundary,
  Outlet,
  createRootRouteWithContext,
  createRoute,
  createRouter,
  redirect,
} from '@tanstack/react-router';
import { ICreateRouter, IRouterContext } from '@akashaorg/typings/lib/ui';
import {
  HomePage,
  DashboardPage,
  WorldConfigFormPage,
  WorldMetaInfoFormPage,
  WorldDataFormPage,
} from '../pages/index';
import { NotFoundComponent } from './not-found-component';
import { RouteErrorComponent } from './error-component';

const rootRoute = createRootRouteWithContext<IRouterContext>()({
  component: Outlet,
  notFoundComponent: () => <NotFoundComponent />,
});

const defaultRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: '/home', replace: true });
  },
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/home',
  component: () => {
    return (
      <CatchBoundary getResetKey={() => 'home_page_reset'} errorComponent={RouteErrorComponent}>
        <HomePage />
      </CatchBoundary>
    );
  },
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: `/dashboard`,
  notFoundComponent: () => <NotFoundComponent />,
  component: () => {
    return (
      <CatchBoundary
        getResetKey={() => 'dashboard_main_reset'}
        errorComponent={RouteErrorComponent}
      >
        <DashboardPage />
      </CatchBoundary>
    );
  },
});

const worldDataRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: `/world-data`,
  notFoundComponent: () => <NotFoundComponent />,
  component: () => {
    return (
      <CatchBoundary
        getResetKey={() => 'world_data_main_reset'}
        errorComponent={RouteErrorComponent}
      >
        <WorldDataFormPage />
      </CatchBoundary>
    );
  },
});

const worldConfigRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: `/world-config`,
  notFoundComponent: () => <NotFoundComponent />,
  component: () => {
    return (
      <CatchBoundary
        getResetKey={() => 'world_config_main_reset'}
        errorComponent={RouteErrorComponent}
      >
        <WorldConfigFormPage />
      </CatchBoundary>
    );
  },
});

const worldMetaInfoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: `/world-meta-info`,
  notFoundComponent: () => <NotFoundComponent />,
  component: () => {
    return (
      <CatchBoundary
        getResetKey={() => 'world_meta_info_main_reset'}
        errorComponent={RouteErrorComponent}
      >
        <WorldMetaInfoFormPage />
      </CatchBoundary>
    );
  },
});

const routeTree = rootRoute.addChildren([
  defaultRoute,
  homeRoute,
  dashboardRoute,
  worldDataRoute,
  worldConfigRoute,
  worldMetaInfoRoute,
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
