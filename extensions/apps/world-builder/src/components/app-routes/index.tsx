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
  DashboardPage,
  WorldConfigMainPage,
  WorldConfigFormStep1Page,
  WorldConfigFormStep2Page,
  ConfigSuccessPage,
  WorldCustomiseFormPage,
  WorldCreateFormPage,
  CreateSuccessPage,
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
    throw redirect({ to: '/dashboard', replace: true });
  },
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
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

export type WorldSuccessSearch = {
  worldId: string;
  worldName: string;
};

export type WorldConfigSuccessSearch = {
  homepageExtensionName: string;
} & WorldSuccessSearch;

const configSuccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: `/config-success`,
  notFoundComponent: () => <NotFoundComponent />,
  validateSearch: (search: Record<string, unknown>): WorldConfigSuccessSearch => {
    return {
      worldId: search.worldId as string,
      worldName: search.worldName as string,
      homepageExtensionName: search.homepageExtensionName as string,
    };
  },
  component: () => {
    const { worldId, worldName, homepageExtensionName } = configSuccessRoute.useSearch();
    return (
      <CatchBoundary
        getResetKey={() => 'config_success_main_reset'}
        errorComponent={RouteErrorComponent}
      >
        <ConfigSuccessPage
          worldId={worldId}
          worldName={worldName}
          homepageExtensionName={homepageExtensionName}
        />
      </CatchBoundary>
    );
  },
});

const createSuccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: `/create-success`,
  notFoundComponent: () => <NotFoundComponent />,
  validateSearch: (search: Record<string, unknown>): WorldSuccessSearch => {
    return { worldId: search.worldId as string, worldName: search.worldName as string };
  },
  component: () => {
    const { worldId, worldName } = createSuccessRoute.useSearch();
    return (
      <CatchBoundary
        getResetKey={() => 'create_success_main_reset'}
        errorComponent={RouteErrorComponent}
      >
        <CreateSuccessPage worldId={worldId} worldName={worldName} />
      </CatchBoundary>
    );
  },
});

const worldCreateRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: `/world-create-form`,
  notFoundComponent: () => <NotFoundComponent />,
  component: () => {
    return (
      <CatchBoundary
        getResetKey={() => 'world_create_form_main_reset'}
        errorComponent={RouteErrorComponent}
      >
        <WorldCreateFormPage />
      </CatchBoundary>
    );
  },
});

const worldConfigMainRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: `/world-config-form/$worldId`,
  notFoundComponent: () => <NotFoundComponent />,
  component: () => {
    const { worldId } = worldConfigMainRoute.useParams();
    return (
      <CatchBoundary
        getResetKey={() => 'world_config_main_main_reset'}
        errorComponent={RouteErrorComponent}
      >
        <WorldConfigMainPage worldId={worldId} />
      </CatchBoundary>
    );
  },
});

const worldConfigStep1Route = createRoute({
  getParentRoute: () => worldConfigMainRoute,
  path: `/step1`,
  notFoundComponent: () => <NotFoundComponent />,
  component: () => {
    const { worldId } = worldConfigMainRoute.useParams();
    return (
      <CatchBoundary
        getResetKey={() => 'world_config_form_step1_reset'}
        errorComponent={RouteErrorComponent}
      >
        <WorldConfigFormStep1Page worldId={worldId} />
      </CatchBoundary>
    );
  },
});

const worldConfigStep2Route = createRoute({
  getParentRoute: () => worldConfigMainRoute,
  path: `/step2`,
  notFoundComponent: () => <NotFoundComponent />,
  component: () => {
    const { worldId } = worldConfigMainRoute.useParams();
    return (
      <CatchBoundary
        getResetKey={() => 'world_config_form_step2_reset'}
        errorComponent={RouteErrorComponent}
      >
        <WorldConfigFormStep2Page worldId={worldId} />
      </CatchBoundary>
    );
  },
});

const worldCustomizeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: `/world-customize-form`,
  notFoundComponent: () => <NotFoundComponent />,
  component: () => {
    return (
      <CatchBoundary
        getResetKey={() => 'world_customize_form_main_reset'}
        errorComponent={RouteErrorComponent}
      >
        <WorldCustomiseFormPage />
      </CatchBoundary>
    );
  },
});

const routeTree = rootRoute.addChildren([
  defaultRoute,
  configSuccessRoute,
  dashboardRoute,
  createSuccessRoute,
  worldCreateRoute,
  worldConfigMainRoute.addChildren([worldConfigStep1Route, worldConfigStep2Route]),
  worldCustomizeRoute,
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
