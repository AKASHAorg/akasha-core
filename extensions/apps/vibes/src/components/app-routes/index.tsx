import React from 'react';
import {
  Outlet,
  createRootRouteWithContext,
  createRoute,
  createRouter,
  redirect,
  CatchBoundary,
} from '@tanstack/react-router';
import { ICreateRouter, IRouterContext } from '@akashaorg/typings/lib/ui';
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
import { NotFoundComponent } from './not-found-component';

const rootRoute = createRootRouteWithContext<IRouterContext>()({
  component: Outlet,
  notFoundComponent: () => <NotFoundComponent />,
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
    return (
      <CatchBoundary getResetKey={() => 'overview_reset'} errorComponent={NotFoundComponent}>
        <Overview isModerator={false} />
      </CatchBoundary>
    );
  },
});

const moderationValueRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: `${baseOverviewUrl}/values/$value`,
  component: () => {
    const { value } = moderationValueRoute.useParams();
    return (
      <CatchBoundary
        getResetKey={() => 'moderation_value_reset'}
        errorComponent={NotFoundComponent}
      >
        <VibesValue value={value} />
      </CatchBoundary>
    );
  },
});

const moderatorsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: routes[MODERATORS],
  component: () => {
    const getModeratorsQuery = { data: [], isFetching: false };
    const allModerators = getModeratorsQuery.data;

    return (
      <CatchBoundary getResetKey={() => 'moderators_reset'} errorComponent={NotFoundComponent}>
        <Moderators
          isFetchingModerators={getModeratorsQuery.isFetching}
          moderators={allModerators}
        />
      </CatchBoundary>
    );
  },
});

const viewModeratorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: `${baseModeratorsUrl}/$moderatorId`,
  component: () => {
    const { moderatorId } = viewModeratorRoute.useParams();
    return (
      <CatchBoundary getResetKey={() => 'moderator_reset'} errorComponent={NotFoundComponent}>
        <ModeratorDetailPage moderatorId={moderatorId} />
      </CatchBoundary>
    );
  },
});

const historyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: routes[HISTORY],
  component: () => {
    return (
      <CatchBoundary getResetKey={() => 'history_reset'} errorComponent={NotFoundComponent}>
        <TransparencyLog />
      </CatchBoundary>
    );
  },
});

const historyItemRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: `${baseHistoryUrl}/$itemId`,
  component: () => {
    const { itemId } = historyItemRoute.useParams();
    return (
      <CatchBoundary getResetKey={() => 'history_item_reset'} errorComponent={NotFoundComponent}>
        <TransparencyLogItem itemId={itemId} />
      </CatchBoundary>
    );
  },
});

const reportItemRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/report/$itemType/$itemId',
  component: () => {
    const { itemType, itemId } = reportItemRoute.useParams();
    return (
      <CatchBoundary getResetKey={() => 'report_item_reset'} errorComponent={NotFoundComponent}>
        <ReportItemPage itemType={itemType} itemId={itemId} />
      </CatchBoundary>
    );
  },
});

const routeTree = rootRoute.addChildren([
  defaultRoute,
  overviewRoute.addChildren([moderationValueRoute]),
  moderatorsRoute.addChildren([viewModeratorRoute]),
  historyRoute.addChildren([historyItemRoute]),
  reportItemRoute,
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
