import React from 'react';
import routes, { CONNECT, WEB3MODAL } from '../../routes';
import {
  Outlet,
  createRootRouteWithContext,
  createRoute,
  createRouter,
  redirect,
  CatchBoundary,
} from '@tanstack/react-router';
import { ICreateRouter, IRouterContext } from '@akashaorg/typings/lib/ui';
import ChooseProvider from '../pages/choose-provider';
import ConnectWallet from '../pages/connect-wallet';
import MainPage from '../pages/main-page';
import { NotFoundComponent } from './not-found-component';

const rootRoute = createRootRouteWithContext<IRouterContext>()({
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
  notFoundComponent: () => <NotFoundComponent />,
  component: () => (
    <CatchBoundary getResetKey={() => 'root_reset'} errorComponent={NotFoundComponent}>
      <MainPage />
    </CatchBoundary>
  ),
});

const connectRoute = createRoute({
  getParentRoute: () => mainRoute,
  path: `${routes[CONNECT]}`,
  notFoundComponent: () => <NotFoundComponent />,
  component: () => (
    <CatchBoundary getResetKey={() => 'connect_reset'} errorComponent={NotFoundComponent}>
      <ChooseProvider />
    </CatchBoundary>
  ),
});

const web3ModalRoute = createRoute({
  getParentRoute: () => mainRoute,
  path: `${routes[CONNECT]}${routes[WEB3MODAL]}`,
  notFoundComponent: () => <NotFoundComponent />,
  component: () => (
    <CatchBoundary getResetKey={() => 'web3_modal_reset'} errorComponent={NotFoundComponent}>
      <ConnectWallet />
    </CatchBoundary>
  ),
});

const routeTree = rootRoute.addChildren([
  defaultRoute,
  mainRoute.addChildren([connectRoute, web3ModalRoute]),
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
