import React from 'react';
import { Outlet, Route, Router, rootRouteWithContext } from '@tanstack/react-router';
import ErrorComponent from './error-component';
import { CreateRouter } from '@akashaorg/typings/lib/ui';
import {
  ModeratorDetailPage,
  Moderators,
  Overview,
  ReportItemPage,
  TransparencyLog,
  TransparencyLogItem,
  VibesValue,
} from '../../pages';

import { generateModerators } from '../../utils';

const rootRoute = rootRouteWithContext()({
  component: Outlet,
});

const overviewRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/overview',
  component: () => {
    return <Overview isModerator={false} />;
  },
});

const moderationValueRoute = new Route({
  getParentRoute: () => rootRoute,
  path: `/overview/values/$value`,
  component: () => {
    const { value } = moderationValueRoute.useParams();
    return <VibesValue value={value} />;
  },
});

const moderatorsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/moderators',
  component: () => {
    const getModeratorsQuery = { data: generateModerators(), isFetching: false };
    const allModerators = getModeratorsQuery.data;

    return (
      <Moderators isFetchingModerators={getModeratorsQuery.isFetching} moderators={allModerators} />
    );
  },
});

const viewModeratorRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/moderators/$moderatorId',
  component: () => {
    const { moderatorId } = viewModeratorRoute.useParams();
    return <ModeratorDetailPage moderatorId={moderatorId} />;
  },
});

const historyRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/history',
  component: () => {
    return <TransparencyLog />;
  },
});

const historyItemRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/history/$itemId',
  component: () => {
    const { itemId } = historyItemRoute.useParams();
    return <TransparencyLogItem itemId={itemId} />;
  },
});

const reportItemRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/report/$itemType/$itemId',
  component: () => {
    const { itemType, itemId } = reportItemRoute.useParams();
    return <ReportItemPage itemType={itemType} itemId={itemId} />;
  },
});

const routeTree = rootRoute.addChildren([
  overviewRoute,
  moderationValueRoute,
  moderatorsRoute,
  viewModeratorRoute,
  historyRoute,
  historyItemRoute,
  reportItemRoute,
]);

export const createRouter = ({ baseRouteName }: CreateRouter) =>
  new Router({
    routeTree,
    basepath: baseRouteName,
    defaultErrorComponent: ({ error }) => (
      <ErrorComponent error={(error as unknown as Error).message} />
    ),
  });
