import React from 'react';
import {
  Outlet,
  createRootRouteWithContext,
  createRoute,
  createRouter,
  redirect,
} from '@tanstack/react-router';
import { ICreateRouter, IRouterContext } from '@akashaorg/typings/lib/ui';
import {
  ExplorePage,
  ExtensionsHubPage,
  InfoPage,
  InstalledExtensionsPage,
  MyExtensionsPage,
  DeveloperModePage,
  DevMode,
  ExtensionCreationPage,
} from '../pages';
import {
  ExtensionEditMainPage,
  ExtensionEditStep1Page,
  ExtensionEditStep2Page,
  ExtensionEditStep3Page,
  ExtensionEditStep4Page,
} from '../pages/extension-edit-page';
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
} from '../pages/info-page/sub-pages';
import ErrorComponent from './error-component';

import { DEV_MODE_KEY } from '../../constants';

const rootRoute = createRootRouteWithContext<IRouterContext>()({
  component: Outlet,
});

const defaultRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: '/explore', replace: true });
  },
});

const exploreRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/explore',
  component: ExplorePage,
});

const extensionsHubRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/extensions-hub',
  component: ExtensionsHubPage,
});

const installedExtensionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/installed-extensions',
  component: InstalledExtensionsPage,
});

const myExtensionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/my-extensions',
  beforeLoad: () => {
    if (window.localStorage.getItem(DEV_MODE_KEY) !== DevMode.ENABLED) {
      throw redirect({ to: '/explore', replace: true });
    }
  },
  component: MyExtensionsPage,
});

const developerModeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/developer-mode',
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
  getParentRoute: () => infoRoute,
  path: '/developer/$devDid',
  component: () => {
    const { devDid } = devInfoRoute.useParams();
    return <DevInfoPage devDid={devDid} />;
  },
});

const collaboratorsInfoRoute = createRoute({
  getParentRoute: () => infoRoute,
  path: '/collaborators',
  component: () => {
    const { appId } = infoRoute.useParams();
    return <CollaboratorsPage appId={appId} />;
  },
});

const versionInfoRoute = createRoute({
  getParentRoute: () => infoRoute,
  path: '/versions',
  component: () => {
    const { appId } = infoRoute.useParams();
    return <VersionInfoPage appId={appId} />;
  },
});

const versionHistoryRoute = createRoute({
  getParentRoute: () => infoRoute,
  path: '/version-history',
  component: () => {
    const { appId } = versionHistoryRoute.useParams();
    return <VersionHistoryPage appId={appId} />;
  },
});

const auditLogRoute = createRoute({
  getParentRoute: () => infoRoute,
  path: '/audit-log',
  component: () => {
    const { appId } = auditLogRoute.useParams();
    return <AuditLogPage appId={appId} />;
  },
});

const permissionInfoRoute = createRoute({
  getParentRoute: () => infoRoute,
  path: '/permissions',
  component: () => {
    const { appId } = permissionInfoRoute.useParams();
    return <PermissionsPage appId={appId} />;
  },
});

const appLicenseInfoRoute = createRoute({
  getParentRoute: () => infoRoute,
  path: '/license',
  component: () => {
    const { appId } = appLicenseInfoRoute.useParams();
    return <LicensePage appId={appId} />;
  },
});

const supportInfoRoute = createRoute({
  getParentRoute: () => infoRoute,
  path: '/contact',
  component: () => {
    const { appId } = supportInfoRoute.useParams();
    return <ContactSupportPage appId={appId} />;
  },
});

const appDescriptionRoute = createRoute({
  getParentRoute: () => infoRoute,
  path: '/description',
  component: () => {
    const { appId } = appDescriptionRoute.useParams();
    return <AppDescriptionPage appId={appId} />;
  },
});

const extensionCreateRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/create-extension',
  component: () => {
    return <ExtensionCreationPage />;
  },
});

const extensionEditMainRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: `/edit-extension/$extensionId`,
  component: () => {
    const { extensionId } = extensionEditMainRoute.useParams();
    return <ExtensionEditMainPage extensionId={extensionId} />;
  },
  // beforeLoad: () => {
  //   throw redirect({ to: '/edit-extension/$extensionId/step1', replace: true });
  // },
});

const extensionEditStep1Route = createRoute({
  getParentRoute: () => extensionEditMainRoute,
  path: '/step1',
  component: () => {
    const { extensionId } = extensionEditMainRoute.useParams();
    return <ExtensionEditStep1Page extensionId={extensionId} />;
  },
});
const extensionEditStep2Route = createRoute({
  getParentRoute: () => extensionEditMainRoute,
  path: '/step2',
  component: () => <ExtensionEditStep2Page />,
});
const extensionEditStep3Route = createRoute({
  getParentRoute: () => extensionEditMainRoute,
  path: '/step3',
  component: () => <ExtensionEditStep3Page />,
});
const extensionEditStep4Route = createRoute({
  getParentRoute: () => extensionEditMainRoute,
  path: '/step4',
  component: () => <ExtensionEditStep4Page />,
});

const routeTree = rootRoute.addChildren([
  defaultRoute,
  exploreRoute,
  extensionsHubRoute,
  installedExtensionsRoute,
  myExtensionsRoute,
  developerModeRoute,
  infoRoute.addChildren([
    devInfoRoute,
    collaboratorsInfoRoute,
    versionInfoRoute,
    versionHistoryRoute,
    auditLogRoute,
    permissionInfoRoute,
    appLicenseInfoRoute,
    supportInfoRoute,
    appDescriptionRoute,
  ]),
  extensionCreateRoute,
  extensionEditMainRoute.addChildren([
    extensionEditStep1Route,
    extensionEditStep2Route,
    extensionEditStep3Route,
    extensionEditStep4Route,
  ]),
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
