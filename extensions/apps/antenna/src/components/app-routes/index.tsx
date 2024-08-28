import React, { Suspense } from 'react';
import GlobalAntennaPage from '../pages/global-antenna-page';
import MyAntennaPage from '../pages/my-antenna-page';
import BeamPage from '../pages/entry-page/beam-page';
import ReflectionPage from '../pages/entry-page/reflection-page';
import TagFeedPage from '../pages/tag-feed-page/tag-feed-page';
import EditorPage from '../pages/editor-page/editor-page';
import ErrorComponent from './error-component';
import EntrySectionLoading from '../pages/entry-page/entry-section-loading';
import routes, {
  GLOBAL_ANTENNA,
  MY_ANTENNA,
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
import { ICreateRouter, IRouterContext } from '@akashaorg/typings/lib/ui';
import {
  getBeamById,
  getBeamStreamById,
  getReflectionById,
  getReflectionStreamById,
  selectBeamActiveField,
  selectBeamNode,
  selectBeamStatusField,
  selectReflectionActiveField,
  selectReflectionNode,
} from './data-loaders';
import { mapBeamEntryData, mapReflectEntryData } from '@akashaorg/ui-awf-hooks';

const rootRoute = createRootRouteWithContext<IRouterContext>()({
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
  loader: ({ context, params }) => ({
    beam: defer(getBeamById({ apolloClient: context.apolloClient, beamId: params.beamId })),
    beamStream: defer(
      getBeamStreamById({
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
          {({ data: beamStreamData }) => (
            <Await promise={beam}>
              {({ data: beamById }) => {
                return (
                  <BeamPage
                    beamId={beamId}
                    isActive={selectBeamActiveField(beamStreamData)}
                    beamData={mapBeamEntryData(selectBeamNode(beamById))}
                    beamStatus={selectBeamStatusField(beamStreamData)}
                  />
                );
              }}
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
          {({ data: beamStreamData }) => (
            <Await promise={beam}>
              {({ data: beamById }) => {
                return (
                  <BeamPage
                    beamId={beamId}
                    isActive={selectBeamActiveField(beamStreamData)}
                    beamData={mapBeamEntryData(selectBeamNode(beamById))}
                    beamStatus={selectBeamStatusField(beamStreamData)}
                  />
                );
              }}
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
    reflectionStream: defer(
      getReflectionStreamById({
        apolloClient: context.apolloClient,
        reflectionId: params.reflectionId,
      }),
    ),
  }),
  component: () => {
    const { reflection, reflectionStream } = reflectionsRoute.useLoaderData();
    return (
      <Suspense fallback={<EntrySectionLoading />}>
        <Await promise={reflectionStream}>
          {({ data: reflectionStreamData }) => (
            <Await promise={reflection}>
              {({ data: reflectionById }) => (
                <ReflectionPage
                  isActive={selectReflectionActiveField(reflectionStreamData)}
                  reflectionData={mapReflectEntryData(selectReflectionNode(reflectionById))}
                />
              )}
            </Await>
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
    const { reflection, reflectionStream } = reflectionsRoute.useLoaderData();
    return (
      <Suspense fallback={<EntrySectionLoading />}>
        <Await promise={reflectionStream}>
          {({ data: reflectionStreamData }) => (
            <Await promise={reflection}>
              {({ data: reflectionById }) => (
                <ReflectionPage
                  isActive={selectReflectionActiveField(reflectionStreamData)}
                  reflectionData={mapReflectEntryData(selectReflectionNode(reflectionById))}
                />
              )}
            </Await>
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
  editorRoute,
]);

export const router = ({ baseRouteName, apolloClient }: ICreateRouter) =>
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
