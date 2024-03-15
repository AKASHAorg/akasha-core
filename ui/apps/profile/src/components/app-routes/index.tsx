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
  path: '$profileDid',
  loader: ({ context, params }) => {
    context.apolloClient.query({
      query: GetProfileByDidDocument,
      variables: {
        id: params.profileDid,
      },
    });
  },
  component: () => {
    const { profileDid } = profileInfoRoute.useParams();
    return (
      <Suspense fallback={<ProfileLoading />}>
        <ProfileInfoPage profileDid={profileDid} />
      </Suspense>
    );
  },
});

const profileEditRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: `$profileDid${menuRoute[EDIT]}`,
  component: () => {
    const { profileDid } = profileEditRoute.useParams();
    return (
      <Suspense fallback={<ProfileLoading />}>
        <ProfileWithAuthorization editingProfile={true} profileDid={profileDid}>
          <EditProfilePage profileDid={profileDid} />
        </ProfileWithAuthorization>
      </Suspense>
    );
  },
});

const followersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: `$profileDid${menuRoute[FOLLOWERS]}`,
  loader: ({ context, params }) => {
    context.apolloClient.query({
      query: GetFollowersListByDidDocument,
      variables: {
        id: params.profileDid,
        first: ENGAGEMENTS_PER_PAGE,
      },
    });
  },
  component: () => {
    const { profileDid } = followersRoute.useParams();
    return (
      <ProfileWithAuthorization profileDid={profileDid}>
        <Card radius={20} elevation="1" padding="p-0">
          <ProfileHeader profileDid={profileDid} plain={true} customStyle="sticky top-3.5 z-50" />
          <FollowersPage profileDid={profileDid} />
        </Card>
      </ProfileWithAuthorization>
    );
  },
});

const followingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: `$profileDid${menuRoute[FOLLOWING]}`,
  loader: ({ context, params }) => {
    context.apolloClient.query({
      query: GetFollowingListByDidDocument,
      variables: {
        id: params.profileDid,
        first: ENGAGEMENTS_PER_PAGE,
      },
    });
  },
  component: () => {
    const { profileDid } = followingRoute.useParams();
    return (
      <ProfileWithAuthorization profileDid={profileDid}>
        <Card radius={20} elevation="1" padding="p-0">
          <ProfileHeader profileDid={profileDid} plain={true} customStyle="sticky top-3.5 z-50" />
          <FollowingPage profileDid={profileDid} />
        </Card>
      </ProfileWithAuthorization>
    );
  },
});

const interestsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: `$profileDid${menuRoute[INTERESTS]}`,
  component: () => {
    const { profileDid } = interestsRoute.useParams();
    return (
      <ProfileWithAuthorization profileDid={profileDid}>
        <ProfileHeader profileDid={profileDid} />
        <InterestsPage profileDid={profileDid} />
      </ProfileWithAuthorization>
    );
  },
});

const beamsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: `$profileDid${menuRoute[BEAMS]}`,
  component: () => {
    const { profileDid } = beamsRoute.useParams();
    return (
      <ProfileWithAuthorization profileDid={profileDid}>
        <ProfileHeader profileDid={profileDid} />
        <ProfileBeamsPage profileDid={profileDid} />
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
