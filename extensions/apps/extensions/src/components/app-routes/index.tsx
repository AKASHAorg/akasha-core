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

import { DEV_MODE_KEY } from '../../constants';
import { NotFoundComponent } from './not-found-component';

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
  notFoundComponent: () => <NotFoundComponent />,
  component: () => (
    <CatchBoundary getResetKey={() => 'explore_reset'} errorComponent={NotFoundComponent}>
      <ExplorePage />
    </CatchBoundary>
  ),
});

const extensionsHubRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/extensions-hub',
  notFoundComponent: () => <NotFoundComponent />,
  component: ExtensionsHubPage,
});

const installedExtensionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/installed-extensions',
  notFoundComponent: () => <NotFoundComponent />,
  component: () => (
    <CatchBoundary getResetKey={() => 'installed_reset'} errorComponent={NotFoundComponent}>
      <InstalledExtensionsPage />
    </CatchBoundary>
  ),
});

const myExtensionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/my-extensions',
  notFoundComponent: () => <NotFoundComponent />,
  beforeLoad: () => {
    if (window.localStorage.getItem(DEV_MODE_KEY) !== DevMode.ENABLED) {
      throw redirect({ to: '/explore', replace: true });
    }
  },
  component: () => (
    <CatchBoundary getResetKey={() => 'my_extensions_reset'} errorComponent={NotFoundComponent}>
      <MyExtensionsPage />
    </CatchBoundary>
  ),
});

const developerModeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/developer-mode',
  notFoundComponent: () => <NotFoundComponent />,
  component: () => (
    <CatchBoundary getResetKey={() => 'dev_mode_reset'} errorComponent={NotFoundComponent}>
      <DeveloperModePage />
    </CatchBoundary>
  ),
});

const infoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/info/$appId',
  notFoundComponent: () => <NotFoundComponent />,
  component: () => {
    const { appId } = infoRoute.useParams();
    return (
      <CatchBoundary getResetKey={() => 'app_info_root_reset'} errorComponent={NotFoundComponent}>
        <InfoPage appId={appId} />
      </CatchBoundary>
    );
  },
});

const devInfoRoute = createRoute({
  getParentRoute: () => infoRoute,
  path: '/developer/$devDid',
  notFoundComponent: () => <NotFoundComponent />,
  component: () => {
    const { devDid } = devInfoRoute.useParams();
    return (
      <CatchBoundary getResetKey={() => 'dev_info_root_reset'} errorComponent={NotFoundComponent}>
        <DevInfoPage devDid={devDid} />
      </CatchBoundary>
    );
  },
});

const collaboratorsInfoRoute = createRoute({
  getParentRoute: () => infoRoute,
  path: '/collaborators',
  notFoundComponent: () => <NotFoundComponent />,
  component: () => {
    const { appId } = infoRoute.useParams();
    return (
      <CatchBoundary getResetKey={() => 'collaborators_reset'} errorComponent={NotFoundComponent}>
        <CollaboratorsPage appId={appId} />
      </CatchBoundary>
    );
  },
});

const versionInfoRoute = createRoute({
  getParentRoute: () => infoRoute,
  path: '/versions',
  notFoundComponent: () => <NotFoundComponent />,
  component: () => {
    const { appId } = infoRoute.useParams();
    return (
      <CatchBoundary getResetKey={() => 'app_info_root_reset'} errorComponent={NotFoundComponent}>
        <VersionInfoPage appId={appId} />
      </CatchBoundary>
    );
  },
});

const versionHistoryRoute = createRoute({
  getParentRoute: () => infoRoute,
  path: '/version-history',
  notFoundComponent: () => <NotFoundComponent />,
  component: () => {
    const { appId } = versionHistoryRoute.useParams();
    return (
      <CatchBoundary getResetKey={() => 'version_history_reset'} errorComponent={NotFoundComponent}>
        <VersionHistoryPage appId={appId} />
      </CatchBoundary>
    );
  },
});

const auditLogRoute = createRoute({
  getParentRoute: () => infoRoute,
  path: '/audit-log',
  notFoundComponent: () => <NotFoundComponent />,
  component: () => {
    const { appId } = auditLogRoute.useParams();
    return (
      <CatchBoundary getResetKey={() => 'audit_log_reset'} errorComponent={NotFoundComponent}>
        <AuditLogPage appId={appId} />
      </CatchBoundary>
    );
  },
});

const permissionInfoRoute = createRoute({
  getParentRoute: () => infoRoute,
  path: '/permissions',
  notFoundComponent: () => <NotFoundComponent />,
  component: () => {
    const { appId } = permissionInfoRoute.useParams();
    return (
      <CatchBoundary getResetKey={() => 'permissions_reset'} errorComponent={NotFoundComponent}>
        <PermissionsPage appId={appId} />
      </CatchBoundary>
    );
  },
});

const appLicenseInfoRoute = createRoute({
  getParentRoute: () => infoRoute,
  path: '/license',
  notFoundComponent: () => <NotFoundComponent />,
  component: () => {
    const { appId } = appLicenseInfoRoute.useParams();
    return (
      <CatchBoundary getResetKey={() => 'license_reset'} errorComponent={NotFoundComponent}>
        <LicensePage appId={appId} />
      </CatchBoundary>
    );
  },
});

const supportInfoRoute = createRoute({
  getParentRoute: () => infoRoute,
  path: '/contact',
  notFoundComponent: () => <NotFoundComponent />,
  component: () => {
    const { appId } = supportInfoRoute.useParams();
    return (
      <CatchBoundary getResetKey={() => 'contact_reset'} errorComponent={NotFoundComponent}>
        <ContactSupportPage appId={appId} />
      </CatchBoundary>
    );
  },
});

const appDescriptionRoute = createRoute({
  getParentRoute: () => infoRoute,
  path: '/description',
  notFoundComponent: () => <NotFoundComponent />,
  component: () => {
    const { appId } = appDescriptionRoute.useParams();
    return (
      <CatchBoundary getResetKey={() => 'description_reset'} errorComponent={NotFoundComponent}>
        <AppDescriptionPage appId={appId} />
      </CatchBoundary>
    );
  },
});

const extensionCreateRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/create-extension',
  notFoundComponent: () => <NotFoundComponent />,
  component: () => {
    return <ExtensionCreationPage />;
  },
});

const extensionEditMainRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: `/edit-extension/$extensionId`,
  notFoundComponent: () => <NotFoundComponent />,
  component: () => {
    const { extensionId } = extensionEditMainRoute.useParams();
    return (
      <CatchBoundary
        getResetKey={() => 'edit_extension_main_reset'}
        errorComponent={NotFoundComponent}
      >
        <ExtensionEditMainPage extensionId={extensionId} />
      </CatchBoundary>
    );
  },
  // beforeLoad: () => {
  //   throw redirect({ to: '/edit-extension/$extensionId/step1', replace: true });
  // },
});

const extensionEditStep1Route = createRoute({
  getParentRoute: () => extensionEditMainRoute,
  path: '/step1',
  notFoundComponent: () => <NotFoundComponent />,
  component: () => {
    const { extensionId } = extensionEditMainRoute.useParams();
    return (
      <CatchBoundary
        getResetKey={() => 'edit_extension_step1_reset'}
        errorComponent={NotFoundComponent}
      >
        <ExtensionEditStep1Page extensionId={extensionId} />
      </CatchBoundary>
    );
  },
});
const extensionEditStep2Route = createRoute({
  getParentRoute: () => extensionEditMainRoute,
  path: '/step2',
  notFoundComponent: () => <NotFoundComponent />,
  component: () => {
    const { extensionId } = extensionEditMainRoute.useParams();
    return (
      <CatchBoundary
        getResetKey={() => 'edit_extension_step2_reset'}
        errorComponent={NotFoundComponent}
      >
        <ExtensionEditStep2Page extensionId={extensionId} />
      </CatchBoundary>
    );
  },
});
const extensionEditStep3Route = createRoute({
  getParentRoute: () => extensionEditMainRoute,
  path: '/step3',
  notFoundComponent: () => <NotFoundComponent />,
  component: () => {
    const { extensionId } = extensionEditMainRoute.useParams();
    return (
      <CatchBoundary
        getResetKey={() => 'edit_extension_step3_reset'}
        errorComponent={NotFoundComponent}
      >
        <ExtensionEditStep3Page extensionId={extensionId} />
      </CatchBoundary>
    );
  },
});
const extensionEditStep4Route = createRoute({
  getParentRoute: () => extensionEditMainRoute,
  path: '/step4',
  notFoundComponent: () => <NotFoundComponent />,
  component: () => {
    const { extensionId } = extensionEditMainRoute.useParams();
    return (
      <CatchBoundary
        getResetKey={() => 'edit_extension_step4_reset'}
        errorComponent={NotFoundComponent}
      >
        <ExtensionEditStep4Page extensionId={extensionId} />
      </CatchBoundary>
    );
  },
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
    defaultErrorComponent: ({ error }) => <NotFoundComponent error={error} />,
  });
