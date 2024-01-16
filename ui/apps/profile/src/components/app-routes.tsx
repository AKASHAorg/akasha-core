import React, { Suspense } from 'react';
import InterestsPage from './pages/interests';
import EditProfilePage from './pages/edit-profile';
import FollowingPage from './pages/profile-engagement/following-page';
import FollowersPage from './pages/profile-engagement/followers-page';
import ProfileInfoPage from './pages/profile-info';
import ProfileBeamsPage from './pages/profile-beams';
import ProfileEngagementLoading from '@akashaorg/design-system-components/lib/components/ProfileEngagements/placeholders/profile-engagement-loading';
import ErrorBoundary, {
  ErrorBoundaryProps,
} from '@akashaorg/design-system-core/lib/components/ErrorBoundary';
import menuRoute, { BEAMS, EDIT, INTERESTS, FOLLOWERS, FOLLOWING } from '../routes';
import { ProfileLoading } from '@akashaorg/design-system-components/lib/components/Profile';
import {
  rootRouteWithContext,
  Route,
  Router,
  Outlet,
  ScrollRestoration,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { useApolloClient } from '@apollo/client';
import {
  GetProfileByDidDocument,
  GetFollowersListByDidDocument,
  GetFollowingListByDidDocument,
} from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import { getStats } from '@akashaorg/ui-awf-hooks/lib/use-profile-stats';
import { useTranslation } from 'react-i18next';
import { useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import EngagementTab from './pages/profile-engagement/engagement-tab';

type ApolloClient = ReturnType<typeof useApolloClient>;
interface RouterContext {
  apolloClient: ApolloClient;
}

const RootComponent = () => {
  const { t } = useTranslation('app-profile');
  const { logger } = useRootComponentProps();

  const errorBoundaryProps: Pick<ErrorBoundaryProps, 'errorObj' | 'logger'> = {
    errorObj: {
      type: t('script-error'),
      title: t('Error in profile app'),
    },
    logger,
  };

  return (
    <>
      <ScrollRestoration getKey={location => location.pathname} />
      <ErrorBoundary {...errorBoundaryProps}>
        <Outlet />
      </ErrorBoundary>
      <TanStackRouterDevtools />
    </>
  );
};

const rootRoute = rootRouteWithContext<RouterContext>()({
  component: RootComponent,
});

const profileInfoRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '$profileId',
  loader: ({ context, params }) => {
    getStats(params.profileId);
    context.apolloClient.query({
      query: GetProfileByDidDocument,
      variables: {
        id: params.profileId,
      },
    });
  },
  component: () => {
    return (
      <Suspense fallback={<ProfileLoading />}>
        <ProfileInfoPage />
      </Suspense>
    );
  },
});

const profileEditRoute = new Route({
  getParentRoute: () => rootRoute,
  path: `$profileId${menuRoute[EDIT]}`,
  wrapInSuspense: true,
  component: () => {
    return (
      <Suspense fallback={<ProfileLoading />}>
        <EditProfilePage />
      </Suspense>
    );
  },
});

const followersRoute = new Route({
  getParentRoute: () => rootRoute,
  path: `$profileId${menuRoute[FOLLOWERS]}`,
  loader: ({ context, params }) => {
    context.apolloClient.query({
      query: GetFollowersListByDidDocument,
      variables: {
        id: params.profileId,
        first: 10,
      },
    });
  },
  wrapInSuspense: true,
  component: () => {
    return (
      <Suspense
        fallback={
          <EngagementTab>
            <ProfileEngagementLoading />
          </EngagementTab>
        }
      >
        <FollowersPage />
      </Suspense>
    );
  },
});

const followingRoute = new Route({
  getParentRoute: () => rootRoute,
  path: `$profileId${menuRoute[FOLLOWING]}`,
  loader: ({ context, params }) => {
    context.apolloClient.query({
      query: GetFollowingListByDidDocument,
      variables: {
        id: params.profileId,
        first: 10,
      },
    });
  },
  wrapInSuspense: true,
  component: () => {
    return (
      <Suspense
        fallback={
          <EngagementTab>
            <ProfileEngagementLoading />
          </EngagementTab>
        }
      >
        <FollowingPage />
      </Suspense>
    );
  },
});

const interestsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: `$profileId${menuRoute[INTERESTS]}`,
  component: () => {
    return <InterestsPage />;
  },
});

const beamsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: `$profileId${menuRoute[BEAMS]}`,
  component: () => {
    return <ProfileBeamsPage />;
  },
});

const routeTree = rootRoute.addChildren([
  profileInfoRoute,
  profileEditRoute,
  followersRoute,
  followingRoute,
  interestsRoute,
  beamsRoute,
]);

export const createRouter = (baseRouteName: string, apolloClient: ApolloClient) =>
  new Router({
    routeTree,
    basepath: baseRouteName,
    context: {
      apolloClient,
    },
  });
