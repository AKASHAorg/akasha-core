import React, { Suspense } from 'react';
import GlobalAntennaPage from '../pages/global-antenna-page';
import MyAntennaPage from '../pages/my-antenna-page';
import ProfileFeedPage from '../pages/profile-feed-page/profile-feed-page';
import BeamPage from '../pages/entry-page/beam-page';
import ReflectionPage from '../pages/entry-page/reflection-page';
import TagFeedPage from '../pages/tag-feed-page/tag-feed-page';
import EditorPage from '../pages/editor-page/editor-page';
import ErrorComponent from './error-component';
import EntrySectionLoading from '../pages/entry-page/entry-section-loading';
import routes, {
  GLOBAL_ANTENNA,
  MY_ANTENNA,
  PROFILE_FEED,
  BEAM,
  REFLECT,
  TAGS,
  EDITOR,
  REFLECTION,
} from '../../routes';
import {
  redirect,
  createRootRouteWithContext,
  createRoute,
  createRouter,
  Outlet,
} from '@tanstack/react-router';
import { CreateRouter, RouterContext } from '@akashaorg/typings/lib/ui';

const rootRoute = createRootRouteWithContext<RouterContext>()({
  component: Outlet,
});

const defaultRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: routes[GLOBAL_ANTENNA], replace: true });
  },
});

const antennaRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: routes[GLOBAL_ANTENNA],
  component: () => {
    return <GlobalAntennaPage />;
  },
});

const myAntennaRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: routes[MY_ANTENNA],
  component: () => {
    return <MyAntennaPage />;
  },
});

const beamRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: `${routes[BEAM]}/$beamId`,
  component: () => {
    const { beamId } = beamRoute.useParams();
    return (
      <Suspense fallback={<EntrySectionLoading />}>
        <BeamPage beamId={beamId} />
      </Suspense>
    );
  },
});

const beamReflectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: `${routes[BEAM]}/$beamId${routes[REFLECT]}`,
  component: () => {
    const { beamId } = beamReflectRoute.useParams();
    return (
      <Suspense fallback={<EntrySectionLoading />}>
        <BeamPage beamId={beamId} />
      </Suspense>
    );
  },
});

const reflectionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: `${routes[REFLECTION]}/$reflectionId`,
  component: () => {
    const { reflectionId } = reflectionsRoute.useParams();
    return (
      <Suspense fallback={<EntrySectionLoading />}>
        <ReflectionPage reflectionId={reflectionId} />
      </Suspense>
    );
  },
});

const reflectionsReflectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: `${routes[REFLECTION]}/$reflectionId${routes[REFLECT]}`,
  component: () => {
    const { reflectionId } = reflectionsReflectRoute.useParams();
    return (
      <Suspense fallback={<EntrySectionLoading />}>
        <ReflectionPage reflectionId={reflectionId} />
      </Suspense>
    );
  },
});

const tagFeedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: `${routes[TAGS]}/$tagName`,
  component: () => {
    const { tagName } = tagFeedRoute.useParams();
    return <TagFeedPage tagName={tagName} />;
  },
});

const profileFeedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: `${routes[PROFILE_FEED]}/$did`,
  component: () => {
    const { did } = profileFeedRoute.useParams();
    return <ProfileFeedPage did={did} />;
  },
});

const editorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: routes[EDITOR],
  component: () => {
    return <EditorPage />;
  },
});

const routeTree = rootRoute.addChildren([
  defaultRoute,
  antennaRoute,
  myAntennaRoute,
  beamRoute,
  beamReflectRoute,
  reflectionsRoute,
  reflectionsReflectRoute,
  tagFeedRoute,
  profileFeedRoute,
  editorRoute,
]);

export const createAppRouter = ({ baseRouteName, apolloClient }: CreateRouter) =>
  createRouter({
    routeTree,
    basepath: baseRouteName,
    context: {
      apolloClient,
    },
    defaultErrorComponent: ({ error }) => {
      return <ErrorComponent error={(error as unknown as Error).message} />;
    },
  });
