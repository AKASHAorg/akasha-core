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
  defer,
  Await,
} from '@tanstack/react-router';
import { CreateRouter, RouterContext } from '@akashaorg/typings/lib/ui';
import {
  getAuthenticatedProfile,
  getBeamById,
  getBeamStream,
  getReflectionById,
} from './data-loaders';

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
  loader: ({ context: { authenticatedDID, apolloClient } }) =>
    getAuthenticatedProfile({ authenticatedDID, apolloClient }),
  component: () => {
    const authenticatedProfile = antennaRoute.useLoaderData();
    const authenticatedDID = antennaRoute.useRouteContext().authenticatedDID;
    return (
      <GlobalAntennaPage
        authenticatedProfile={authenticatedProfile}
        authenticatedDID={authenticatedDID}
      />
    );
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
  loader: ({ context, params }) => ({
    beam: defer(getBeamById({ apolloClient: context.apolloClient, beamId: params.beamId })),
    beamStream: defer(
      getBeamStream({
        apolloClient: context.apolloClient,
        beamId: params.beamId,
      }),
    ),
  }),
  component: () => {
    const { beamId } = beamRoute.useParams();
    const { beam, beamStream } = beamRoute.useLoaderData();
    return (
      <Suspense fallback={<EntrySectionLoading />}>
        <Await promise={beamStream}>
          {beamStreamData => (
            <Await promise={beam}>
              {beamData => <BeamPage beamId={beamId} beam={beamData} beamStream={beamStreamData} />}
            </Await>
          )}
        </Await>
      </Suspense>
    );
  },
});

const beamReflectRoute = createRoute({
  getParentRoute: () => beamRoute,
  path: routes[REFLECT],
  component: () => {
    const { beamId } = beamReflectRoute.useParams();
    const { beam, beamStream } = beamRoute.useLoaderData();
    return (
      <Suspense fallback={<EntrySectionLoading />}>
        <Await promise={beamStream}>
          {beamStreamData => (
            <Await promise={beam}>
              {beamData => <BeamPage beamId={beamId} beam={beamData} beamStream={beamStreamData} />}
            </Await>
          )}
        </Await>
      </Suspense>
    );
  },
});

const reflectionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: `${routes[REFLECTION]}/$reflectionId`,
  loader: ({ context, params }) => ({
    reflection: defer(
      getReflectionById({
        apolloClient: context.apolloClient,
        reflectionId: params.reflectionId,
      }),
    ),
    isLoggedIn: !!context?.authenticatedDID,
  }),
  component: () => {
    const { reflectionId } = reflectionsRoute.useParams();
    const { reflection, isLoggedIn } = reflectionsRoute.useLoaderData();
    return (
      <Suspense fallback={<EntrySectionLoading />}>
        <Await promise={reflection}>
          {data => (
            <ReflectionPage reflectionId={reflectionId} reflection={data} isLoggedIn={isLoggedIn} />
          )}
        </Await>
      </Suspense>
    );
  },
});

const reflectionsReflectRoute = createRoute({
  getParentRoute: () => reflectionsRoute,
  path: routes[REFLECT],
  component: () => {
    const { reflectionId } = reflectionsReflectRoute.useParams();
    const { reflection, isLoggedIn } = reflectionsRoute.useLoaderData();
    return (
      <Suspense fallback={<EntrySectionLoading />}>
        <Await promise={reflection}>
          {data => (
            <ReflectionPage reflectionId={reflectionId} reflection={data} isLoggedIn={isLoggedIn} />
          )}
        </Await>
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
  path: `${routes[PROFILE_FEED]}/$profileDID`,
  component: () => {
    const { profileDID } = profileFeedRoute.useParams();
    return <ProfileFeedPage profileDID={profileDID} />;
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
  beamRoute.addChildren([beamReflectRoute]),
  reflectionsRoute.addChildren([reflectionsReflectRoute]),
  tagFeedRoute,
  profileFeedRoute,
  editorRoute,
]);

export const router = ({ baseRouteName, apolloClient, authenticatedDID }: CreateRouter) =>
  createRouter({
    routeTree,
    basepath: baseRouteName,
    context: {
      apolloClient,
      authenticatedDID,
    },
    defaultErrorComponent: ({ error }) => {
      return <ErrorComponent error={(error as unknown as Error).message} />;
    },
  });
