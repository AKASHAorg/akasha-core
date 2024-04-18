import React from 'react';

import ErrorComponent from './error-component';
import routes, { CONNECT, WEB3MODAL } from '../../routes';
import {
  Outlet,
  createRootRouteWithContext,
  createRoute,
  createRouter,
  redirect,
} from '@tanstack/react-router';
import { CreateRouter, RouterContext } from '@akashaorg/typings/lib/ui';
import ChooseProvider from '../pages/choose-provider';
import ConnectWallet from '../pages/connect-wallet';
import MainPage from '../pages/main-page';

const rootRoute = createRootRouteWithContext<RouterContext>()({
  component: Outlet,
});

const defaultRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: routes[CONNECT], replace: true });
  },
});

const mainRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'main',
  component: MainPage,
});

const connectRoute = createRoute({
  getParentRoute: () => mainRoute,
  path: `${routes[CONNECT]}`,
  component: ChooseProvider,
});

const web3ModalRoute = createRoute({
  getParentRoute: () => mainRoute,
  path: `${routes[CONNECT]}${routes[WEB3MODAL]}`,
  component: ConnectWallet,
});

const routeTree = rootRoute.addChildren([
  defaultRoute,
  mainRoute.addChildren([connectRoute, web3ModalRoute]),
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
