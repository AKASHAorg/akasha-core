import React from 'react';
import {
  Outlet,
  createRootRouteWithContext,
  createRoute,
  createRouter,
  redirect,
} from '@tanstack/react-router';
import { CreateRouter, RouterContext } from '@akashaorg/typings/lib/ui';
import {
  ExplorePage,
  ExtensionsHubPage,
  InfoPage,
  InstalledExtensionsPage,
  MyExtensionsPage,
  DeveloperModePage,
  DevMode,
} from '../pages';
import {
  DevInfoPage,
  CollaboratorsPage,
  VersionInfoPage,
  VersionHistoryPage,
  AuditLogPage,
  PermissionsPage,
  LicensePage,
  ContactSupportPage,
  AppDescriptionPage,
} from '../pages/sub-pages';
import ErrorComponent from './error-component';
import routes, { EXTENSIONS, INSTALLED, HOME, MY_EXTENSIONS, DEVELOPER_MODE } from '../../routes';
import { DEV_MODE_KEY } from '../../constants';

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

const exploreRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: routes[HOME],
  component: ExplorePage,
});

const extensionsHubRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: routes[EXTENSIONS],
  component: ExtensionsHubPage,
});

const installedExtensionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: routes[INSTALLED],
  component: InstalledExtensionsPage,
});

const MyExtensionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: routes[MY_EXTENSIONS],
  beforeLoad: () => {
    if (window.localStorage.getItem(DEV_MODE_KEY) !== DevMode.ENABLED) {
      throw redirect({ to: routes[HOME], replace: true });
    }
  },
  component: MyExtensionsPage,
});

const DeveloperModeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: routes[DEVELOPER_MODE],
  component: DeveloperModePage,
});

const infoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/info/$appId',
  component: () => {
    const { appId } = infoRoute.useParams();
    return <InfoPage appId={appId} />;
  },
});

const devInfoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/info/$appId/developer/$devDid',
  component: () => {
    const { devDid } = devInfoRoute.useParams();
    return <DevInfoPage devDid={devDid} />;
  },
});

const collaboratorsInfoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/info/$appId/collaborators',
  component: () => {
    const { appId } = infoRoute.useParams();
    return <CollaboratorsPage appId={appId} />;
  },
});

const versionInfoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/info/$appId/versions',
  component: () => {
    const { appId } = infoRoute.useParams();
    return <VersionInfoPage appId={appId} />;
  },
});

const versionHistoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/info/$appId/version-history',
  component: () => {
    const { appId } = versionHistoryRoute.useParams();
    return <VersionHistoryPage appId={appId} />;
  },
});

const auditLogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/info/$appId/audit-log',
  component: () => {
    const { appId } = auditLogRoute.useParams();
    return <AuditLogPage appId={appId} />;
  },
});

const permissionInfoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/info/$appId/permissions',
  component: () => {
    const { appId } = permissionInfoRoute.useParams();
    return <PermissionsPage appId={appId} />;
  },
});

const appLicenseInfoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/info/$appId/license',
  component: () => {
    const { appId } = appLicenseInfoRoute.useParams();
    return <LicensePage appId={appId} />;
  },
});

const supportInfoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/info/$appId/contact',
  component: () => {
    const { appId } = supportInfoRoute.useParams();
    return <ContactSupportPage appId={appId} />;
  },
});

const appDescriptionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/info/$appId/description',
  component: () => {
    const { appId } = appDescriptionRoute.useParams();
    return <AppDescriptionPage appId={appId} />;
  },
});

const routeTree = rootRoute.addChildren([
  defaultRoute,
  exploreRoute,
  extensionsHubRoute,
  installedExtensionsRoute,
  MyExtensionsRoute,
  DeveloperModeRoute,
  infoRoute,
  devInfoRoute,
  collaboratorsInfoRoute,
  versionInfoRoute,
  versionHistoryRoute,
  auditLogRoute,
  permissionInfoRoute,
  appLicenseInfoRoute,
  supportInfoRoute,
  appDescriptionRoute,
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
