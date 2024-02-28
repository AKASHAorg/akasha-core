import React, { Suspense } from 'react';
import GlobalAntennaPage from '../pages/global-antenna-page';
import MyAntennaPage from '../pages/my-antenna-page';
import ProfileFeedPage from '../pages/profile-feed-page/profile-feed-page';
import BeamPage from '../pages/entry-page/beam-page';
import ReflectionPage from '../pages/entry-page/reflection-page';
import TagFeedPage from '../pages/tag-feed-page/tag-feed-page';
import EditorPage from '../pages/editor-page/editor-page';
import RootComponent from './root-component';
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
} from '../../routes';
import { useApolloClient } from '@apollo/client';
import { rootRouteWithContext, Route, Router } from '@tanstack/react-router';

type ApolloClient = ReturnType<typeof useApolloClient>;

interface RouterContext {
  apolloClient: ApolloClient;
}

const rootRoute = rootRouteWithContext<RouterContext>()({
  component: RootComponent,
});

const antennaRoute = new Route({
  getParentRoute: () => rootRoute,
  path: routes[GLOBAL_ANTENNA],
  component: () => {
    return <GlobalAntennaPage />;
  },
});

const myAntennaRoute = new Route({
  getParentRoute: () => rootRoute,
  path: routes[MY_ANTENNA],
  component: () => {
    return <MyAntennaPage />;
  },
});

const beamRoute = new Route({
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

const beamReflectRoute = new Route({
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

const reflectionsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: `${routes[REFLECT]}/$reflectionId`,
  component: () => {
    const { reflectionId } = reflectionsRoute.useParams();
    return (
      <Suspense fallback={<EntrySectionLoading />}>
        <ReflectionPage reflectionId={reflectionId} />
      </Suspense>
    );
  },
});

const reflectionsReflectRoute = new Route({
  getParentRoute: () => rootRoute,
  path: `${routes[REFLECT]}/$reflectionId${routes[REFLECT]}`,
  component: () => {
    const { reflectionId } = reflectionsReflectRoute.useParams();
    return (
      <Suspense fallback={<EntrySectionLoading />}>
        <ReflectionPage reflectionId={reflectionId} />
      </Suspense>
    );
  },
});

const tagFeedRoute = new Route({
  getParentRoute: () => rootRoute,
  path: `${routes[TAGS]}/$tagName`,
  component: () => {
    const { tagName } = tagFeedRoute.useParams();
    return <TagFeedPage tagName={tagName} />;
  },
});

const profileFeedRoute = new Route({
  getParentRoute: () => rootRoute,
  path: `${routes[PROFILE_FEED]}/$did`,
  component: () => {
    const { did } = profileFeedRoute.useParams();
    return <ProfileFeedPage did={did} />;
  },
});

const editorRoute = new Route({
  getParentRoute: () => rootRoute,
  path: routes[EDITOR],
  component: () => {
    return <EditorPage />;
  },
});

const routeTree = rootRoute.addChildren([
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

interface CreateRouter {
  baseRouteName: string;
  apolloClient: ApolloClient;
}

export const createRouter = ({ baseRouteName, apolloClient }: CreateRouter) =>
  new Router({
    routeTree,
    basepath: baseRouteName,
    context: {
      apolloClient,
    },
    defaultErrorComponent: ({ error }) => {
      return <ErrorComponent error={(error as unknown as Error).message} />;
    },
  });
