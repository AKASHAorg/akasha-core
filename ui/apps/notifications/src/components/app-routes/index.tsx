import React from 'react';
import CustomizeNotificationPage from '../pages/customize-notification-page';
import NotificationsPage from '../pages/notifications-page';
import WelcomePage from '../pages/welcome-page';
import ErrorComponent from './error-component';
import routes, {
  CUSTOMIZE_NOTIFICATION_WELCOME_PAGE,
  CUSTOMIZE_NOTIFICATION_OPTIONS_PAGE,
  CUSTOMIZE_NOTIFICATION_CONFIRMATION_PAGE,
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
import { CreateRouter, RouterContext } from '@akashaorg/typings/lib/ui';

const rootRoute = createRootRouteWithContext<RouterContext>()({
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
  component: () => <CustomizeNotificationPage initial={false} />,
});

const customizeNotificationsOptionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: `${routes[CUSTOMIZE_NOTIFICATION_OPTIONS_PAGE]}`,
  component: () => <CustomizeNotificationPage initial={true} />,
});

const customizeNotificationsWelcomePageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: `${routes[CUSTOMIZE_NOTIFICATION_WELCOME_PAGE]}`,
  component: () => {
    return <WelcomePage finalStep={false} />;
  },
});

const customizeNotificationsConfirmationPageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: `${routes[CUSTOMIZE_NOTIFICATION_CONFIRMATION_PAGE]}`,
  component: () => {
    return <WelcomePage finalStep={true} />;
  },
});

const routeTree = rootRoute.addChildren([
  defaultRoute,
  settingsRoute,
  showNotificationsRoute,
  customizeNotificationsOptionsRoute,
  customizeNotificationsWelcomePageRoute,
  customizeNotificationsConfirmationPageRoute,
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
