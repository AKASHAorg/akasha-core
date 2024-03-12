import React from 'react';
import { Outlet } from '@tanstack/react-router';
import TermsOfService from '../pages/terms-of-service';
import TermsOfUse from '../pages/terms-of-use';
import CodeOfConduct from '../pages/code-of-conduct';
import PrivacyPolicy from '../pages/privacy-policy';
import DeveloperGuidelines from '../pages/developer-guidelines';
import ErrorComponent from './error-component';
import route, { TOS, TOU, PP, COC, DG } from '../../routes';
import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router';

import { CreateRouter } from '@akashaorg/typings/lib/ui';

const rootRoute = createRootRoute({
  component: Outlet,
});

const termsOfServiceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: `${route[TOS]}`,
  component: () => {
    return <TermsOfService />;
  },
});

const termsOfUseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: `${route[TOU]}`,
  component: () => {
    return <TermsOfUse />;
  },
});

const codeOfConductRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: `${route[COC]}`,
  component: () => {
    return <CodeOfConduct />;
  },
});

const privacyPolicyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: `${route[PP]}`,
  component: () => {
    return <PrivacyPolicy />;
  },
});

const developerGuidelinesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: `${route[DG]}`,
  component: () => {
    return <DeveloperGuidelines />;
  },
});

const routeTree = rootRoute.addChildren([
  termsOfServiceRoute,
  termsOfUseRoute,
  codeOfConductRoute,
  privacyPolicyRoute,
  developerGuidelinesRoute,
]);

export const router = ({ baseRouteName }: CreateRouter) =>
  createRouter({
    routeTree,
    basepath: baseRouteName,

    defaultErrorComponent: ({ error }) => (
      <ErrorComponent error={(error as unknown as Error).message} />
    ),
  });
