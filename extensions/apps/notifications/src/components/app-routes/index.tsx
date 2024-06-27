import React from 'react';
import CustomiseNotificationPage from '../pages/customise-notification-page';
import NotificationsPage from '../pages/notifications-page';
import WelcomePage from '../pages/welcome-page';
import ErrorComponent from './error-component';
import routes, {
  CUSTOMISE_NOTIFICATION_WELCOME_PAGE,
  CUSTOMISE_NOTIFICATION_OPTIONS_PAGE,
  CUSTOMISE_NOTIFICATION_CONFIRMATION_PAGE,
  SHOW_NOTIFICATIONS_PAGE,
  SETTINGS_PAGE,
} from '../../routes';
import {
  Outlet,
  createRootRouteWithContext,
  createRoute,
  createRouter,
  redirect,
} from '@tanstack/react-router';
import { ICreateRouter, IRouterContext } from '@akashaorg/typings/lib/ui';

const rootRoute = createRootRouteWithContext<IRouterContext>()({
  component: Outlet,
});

const defaultRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: routes[SHOW_NOTIFICATIONS_PAGE], replace: true });
  },
});

const showNotificationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: `${routes[SHOW_NOTIFICATIONS_PAGE]}`,
  component: () => {
    return <NotificationsPage />;
  },
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: `${routes[SETTINGS_PAGE]}`,
  component: () => <CustomiseNotificationPage initial={false} />,
});

const customiseNotificationsOptionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: `${routes[CUSTOMISE_NOTIFICATION_OPTIONS_PAGE]}`,
  component: () => <CustomiseNotificationPage initial={true} />,
});

const customiseNotificationsWelcomePageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: `${routes[CUSTOMISE_NOTIFICATION_WELCOME_PAGE]}`,
  component: () => {
    return <WelcomePage finalStep={false} />;
  },
});

const customiseNotificationsConfirmationPageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: `${routes[CUSTOMISE_NOTIFICATION_CONFIRMATION_PAGE]}`,
  component: () => {
    return <WelcomePage finalStep={true} />;
  },
});

const routeTree = rootRoute.addChildren([
  defaultRoute,
  settingsRoute,
  showNotificationsRoute,
  customiseNotificationsOptionsRoute,
  customiseNotificationsWelcomePageRoute,
  customiseNotificationsConfirmationPageRoute,
]);

export const router = ({ baseRouteName, apolloClient }: ICreateRouter) =>
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
