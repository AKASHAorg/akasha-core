import React from 'react';
import AppsOption from '../pages/apps-option';
import NsfwOption from '../pages/nsfw-option';
import PrivacyOption from '../pages/privacy-option';
import ThemeOption from '../pages/theme-option';
import SettingsPage from '../pages/settings-page';
import routes, { APPS, NSFW, PRIVACY, THEME, HOME } from '../../routes';
import {
  CatchBoundary,
  Outlet,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from '@tanstack/react-router';

import { ICreateRouter } from '@akashaorg/typings/lib/ui';
import { NotFoundComponent } from './not-found-component';

const rootRoute = createRootRoute({
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

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: `${routes[HOME]}`,
  component: () => (
    <CatchBoundary getResetKey={() => 'settings_reset'} errorComponent={NotFoundComponent}>
      <SettingsPage />
    </CatchBoundary>
  ),
});

const nsfwRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: `${routes[NSFW]}`,
  component: () => (
    <CatchBoundary getResetKey={() => 'nsfw_reset'} errorComponent={NotFoundComponent}>
      <NsfwOption />
    </CatchBoundary>
  ),
});

const appsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: `${routes[APPS]}`,
  component: () => (
    <CatchBoundary getResetKey={() => 'apps_reset'} errorComponent={NotFoundComponent}>
      <AppsOption />
    </CatchBoundary>
  ),
});

const privacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: `${routes[PRIVACY]}`,
  component: () => (
    <CatchBoundary getResetKey={() => 'privacy_reset'} errorComponent={NotFoundComponent}>
      <PrivacyOption />
    </CatchBoundary>
  ),
});

const themeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: `${routes[THEME]}`,
  component: () => (
    <CatchBoundary getResetKey={() => 'theme_reset'} errorComponent={NotFoundComponent}>
      <ThemeOption />
    </CatchBoundary>
  ),
});

const routeTree = rootRoute.addChildren([
  defaultRoute,
  settingsRoute,
  appsRoute,
  nsfwRoute,
  privacyRoute,
  themeRoute,
]);

export const router = ({ baseRouteName }: ICreateRouter) =>
  createRouter({
    routeTree,
    basepath: baseRouteName,

    defaultErrorComponent: ({ error }) => <NotFoundComponent error={error} />,
  });
