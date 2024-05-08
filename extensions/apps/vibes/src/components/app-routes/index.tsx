import React from 'react';
import {
  Outlet,
  createRootRouteWithContext,
  createRoute,
  createRouter,
  redirect,
} from '@tanstack/react-router';
import { CreateRouter, RouterContext } from '@akashaorg/typings/lib/ui';
import ErrorComponent from './error-component';
import {
  ModeratorDetailPage,
  Moderators,
  Overview,
  ReportItemPage,
  TransparencyLog,
  TransparencyLogItem,
  VibesValue,
} from '../../pages';
import routes, {
  HISTORY,
  HOME,
  MODERATORS,
  baseHistoryUrl,
  baseModeratorsUrl,
  baseOverviewUrl,
} from '../../routes';

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
  component: () => {
    return <Overview isModerator={false} />;
  },
});

const moderationValueRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: `${baseOverviewUrl}/values/$value`,
  component: () => {
    const { value } = moderationValueRoute.useParams();
    return <VibesValue value={value} />;
  },
});

const moderatorsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: routes[MODERATORS],
  component: () => {
    const getModeratorsQuery = { data: [], isFetching: false };
    const allModerators = getModeratorsQuery.data;

    return (
      <Moderators isFetchingModerators={getModeratorsQuery.isFetching} moderators={allModerators} />
    );
  },
});

const viewModeratorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: `${baseModeratorsUrl}/$moderatorId`,
  component: () => {
    const { moderatorId } = viewModeratorRoute.useParams();
    return <ModeratorDetailPage moderatorId={moderatorId} />;
  },
});

const historyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: routes[HISTORY],
  component: () => {
    return <TransparencyLog />;
  },
});

const historyItemRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: `${baseHistoryUrl}/$itemId`,
  component: () => {
    const { itemId } = historyItemRoute.useParams();
    return <TransparencyLogItem itemId={itemId} />;
  },
});

const reportItemRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/report/$itemType/$itemId',
  component: () => {
    const { itemType, itemId } = reportItemRoute.useParams();
    return <ReportItemPage itemType={itemType} itemId={itemId} />;
  },
});

const routeTree = rootRoute.addChildren([
  defaultRoute,
  overviewRoute.addChildren([moderationValueRoute]),
  moderatorsRoute.addChildren([viewModeratorRoute]),
  historyRoute.addChildren([historyItemRoute]),
  reportItemRoute,
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
