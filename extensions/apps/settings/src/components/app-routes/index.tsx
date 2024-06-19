import React from 'react';
import AppsOption from '../pages/apps-option';
import NsfwOption from '../pages/nsfw-option';
import PrivacyOption from '../pages/privacy-option';
import ThemeOption from '../pages/theme-option';
import SettingsPage from '../pages/settings-page';
import ErrorComponent from './error-component';
import routes, { APPS, NSFW, PRIVACY, THEME, HOME } from '../../routes';
import {
  Outlet,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from '@tanstack/react-router';

import { CreateRouter } from '@akashaorg/typings/lib/ui';

const rootRoute = createRootRoute({
  component: Outlet,
});

const defaultRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: routes[HOME], replace: true });
  },
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: `${routes[HOME]}`,
  component: SettingsPage,
});

const nsfwRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: `${routes[NSFW]}`,
  component: NsfwOption,
});

const appsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: `${routes[APPS]}`,
  component: AppsOption,
});

const privacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: `${routes[PRIVACY]}`,
  component: PrivacyOption,
});

const themeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: `${routes[THEME]}`,
  component: ThemeOption,
});

const routeTree = rootRoute.addChildren([
  defaultRoute,
  settingsRoute,
  appsRoute,
  nsfwRoute,
  privacyRoute,
  themeRoute,
]);

export const router = ({ baseRouteName }: CreateRouter) =>
  createRouter({
    routeTree,
    basepath: baseRouteName,

    defaultErrorComponent: ({ error }) => (
      <ErrorComponent error={(error as unknown as Error).message} />
    ),
  });
