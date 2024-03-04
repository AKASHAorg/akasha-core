import React, { Suspense } from 'react';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import InterestsPage from '../pages/interests';
import EditProfilePage from '../pages/edit-profile';
import FollowingPage from '../pages/profile-engagement/following-page';
import FollowersPage from '../pages/profile-engagement/followers-page';
import ProfileInfoPage from '../pages/profile-info';
import ProfileBeamsPage from '../pages/profile-beams';
import ProfileHeader from '../profile-header';
import ErrorComponent from './error-component';
import ProfileWithAuthorization from '../profile-with-authorization';
import menuRoute, { BEAMS, EDIT, INTERESTS, FOLLOWERS, FOLLOWING } from '../../routes';
import { ProfileLoading } from '@akashaorg/design-system-components/lib/components/Profile';
import {
  createRootRouteWithContext,
  createRoute,
  createRouter,
  Outlet,
} from '@tanstack/react-router';
import {
  GetProfileByDidDocument,
  GetFollowersListByDidDocument,
  GetFollowingListByDidDocument,
} from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import { ENGAGEMENTS_PER_PAGE } from '../pages/profile-engagement/types';
import { CreateRouter, RouterContext } from '@akashaorg/typings/lib/ui';

const rootRoute = createRootRouteWithContext<RouterContext>()({
  component: Outlet,
});

const profileInfoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '$profileId',
  loader: ({ context, params }) => {
    context.apolloClient.query({
      query: GetProfileByDidDocument,
      variables: {
        id: params.profileId,
      },
    });
  },
  component: () => {
    const { profileId } = profileInfoRoute.useParams();
    return (
      <Suspense fallback={<ProfileLoading />}>
        <ProfileInfoPage profileId={profileId} />
      </Suspense>
    );
  },
});

const profileEditRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: `$profileId${menuRoute[EDIT]}`,
  component: () => {
    const { profileId } = profileEditRoute.useParams();
    return (
      <Suspense fallback={<ProfileLoading />}>
        <ProfileWithAuthorization editingProfile={true} profileId={profileId}>
          <EditProfilePage profileId={profileId} />
        </ProfileWithAuthorization>
      </Suspense>
    );
  },
});

const followersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: `$profileId${menuRoute[FOLLOWERS]}`,
  loader: ({ context, params }) => {
    context.apolloClient.query({
      query: GetFollowersListByDidDocument,
      variables: {
        id: params.profileId,
        first: ENGAGEMENTS_PER_PAGE,
      },
    });
  },
  component: () => {
    const { profileId } = followersRoute.useParams();
    return (
      <ProfileWithAuthorization profileId={profileId}>
        <Card radius={20} elevation="1" padding="p-0">
          <ProfileHeader profileId={profileId} plain={true} customStyle="sticky top-3.5 z-50" />
          <FollowersPage profileId={profileId} />
        </Card>
      </ProfileWithAuthorization>
    );
  },
});

const followingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: `$profileId${menuRoute[FOLLOWING]}`,
  loader: ({ context, params }) => {
    context.apolloClient.query({
      query: GetFollowingListByDidDocument,
      variables: {
        id: params.profileId,
        first: ENGAGEMENTS_PER_PAGE,
      },
    });
  },
  component: () => {
    const { profileId } = followingRoute.useParams();
    return (
      <ProfileWithAuthorization profileId={profileId}>
        <Card radius={20} elevation="1" padding="p-0">
          <ProfileHeader profileId={profileId} plain={true} customStyle="sticky top-3.5 z-50" />
          <FollowingPage profileId={profileId} />
        </Card>
      </ProfileWithAuthorization>
    );
  },
});

const interestsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: `$profileId${menuRoute[INTERESTS]}`,
  component: () => {
    const { profileId } = interestsRoute.useParams();
    return (
      <ProfileWithAuthorization profileId={profileId}>
        <ProfileHeader profileId={profileId} />
        <InterestsPage profileId={profileId} />
      </ProfileWithAuthorization>
    );
  },
});

const beamsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: `$profileId${menuRoute[BEAMS]}`,
  component: () => {
    const { profileId } = beamsRoute.useParams();
    return (
      <ProfileWithAuthorization profileId={profileId}>
        <ProfileHeader profileId={profileId} />
        <ProfileBeamsPage profileId={profileId} />
      </ProfileWithAuthorization>
    );
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
