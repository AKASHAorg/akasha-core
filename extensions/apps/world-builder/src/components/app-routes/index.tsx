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
import { HomePage } from '../pages/index';
import {
  SaveConfigMainPage,
  SaveConfigStep1Page,
  SaveConfigStep2Page,
  SaveConfigStep3Page,
  SaveConfigSuccessPage,
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

const saveConfigMainRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: `/save-config`,
  notFoundComponent: () => <NotFoundComponent />,
  component: () => {
    return (
      <CatchBoundary
        getResetKey={() => 'save_config_main_reset'}
        errorComponent={RouteErrorComponent}
      >
        <SaveConfigMainPage />
      </CatchBoundary>
    );
  },
});

const saveConfigStep1Route = createRoute({
  getParentRoute: () => saveConfigMainRoute,
  path: '/step1',
  component: () => {
    return (
      <CatchBoundary
        getResetKey={() => 'save_config_step1_reset'}
        errorComponent={RouteErrorComponent}
      >
        <SaveConfigStep1Page />
      </CatchBoundary>
    );
  },
});

const saveConfigStep2Route = createRoute({
  getParentRoute: () => saveConfigMainRoute,
  path: '/step2',
  component: () => {
    return (
      <CatchBoundary
        getResetKey={() => 'save_config_step2_reset'}
        errorComponent={RouteErrorComponent}
      >
        <SaveConfigStep2Page />
      </CatchBoundary>
    );
  },
});

const saveConfigStep3Route = createRoute({
  getParentRoute: () => saveConfigMainRoute,
  path: '/step3',
  component: () => {
    return (
      <CatchBoundary
        getResetKey={() => 'save_config_step3_reset'}
        errorComponent={RouteErrorComponent}
      >
        <SaveConfigStep3Page />
      </CatchBoundary>
    );
  },
});

const saveConfigSuccessRoute = createRoute({
  getParentRoute: () => saveConfigMainRoute,
  path: '/success',
  component: () => {
    return (
      <CatchBoundary
        getResetKey={() => 'save_config_success_page_reset'}
        errorComponent={RouteErrorComponent}
      >
        <SaveConfigSuccessPage />
      </CatchBoundary>
    );
  },
});

const routeTree = rootRoute.addChildren([
  defaultRoute,
  homeRoute,
  saveConfigMainRoute.addChildren([
    saveConfigStep1Route,
    saveConfigStep2Route,
    saveConfigStep3Route,
    saveConfigSuccessRoute,
  ]),
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
