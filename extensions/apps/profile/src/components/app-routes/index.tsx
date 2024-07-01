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
  ScrollRestoration,
} from '@tanstack/react-router';
import {
  GetProfileByDidDocument,
  GetFollowersListByDidDocument,
  GetFollowingListByDidDocument,
} from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import { ENGAGEMENTS_PER_PAGE } from '../pages/profile-engagement/types';
import { ICreateRouter, IRouterContext } from '@akashaorg/typings/lib/ui';

const rootRoute = createRootRouteWithContext<IRouterContext>()({
  component: () => (
    <>
      <ScrollRestoration getKey={location => location.pathname} />
      <Outlet />
    </>
  ),
});

const profileInfoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '$profileDID',
  loader: ({ context, params }) => {
    context.apolloClient.query({
      query: GetProfileByDidDocument,
      variables: {
        id: params.profileDID,
      },
    });
  },
  component: () => {
    const { profileDID } = profileInfoRoute.useParams();
    return (
      <Suspense fallback={<ProfileLoading />}>
        <ProfileInfoPage profileDID={profileDID} />
      </Suspense>
    );
  },
});

const profileEditRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: `$profileDID${menuRoute[EDIT]}`,
  component: () => {
    const { profileDID } = profileEditRoute.useParams();
    return (
      <Suspense fallback={<ProfileLoading />}>
        <ProfileWithAuthorization editingProfile={true} profileDID={profileDID}>
          <EditProfilePage profileDID={profileDID} />
        </ProfileWithAuthorization>
      </Suspense>
    );
  },
});

const followersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: `$profileDID${menuRoute[FOLLOWERS]}`,
  loader: ({ context, params }) => {
    context.apolloClient.query({
      query: GetFollowersListByDidDocument,
      variables: {
        id: params.profileDID,
        first: ENGAGEMENTS_PER_PAGE,
      },
    });
  },
  component: () => {
    const { profileDID } = followersRoute.useParams();
    return (
      <ProfileWithAuthorization profileDID={profileDID}>
        <Card radius={20} padding="p-0">
          <ProfileHeader profileDID={profileDID} plain={true} customStyle="sticky top-3.5 z-50" />
          <FollowersPage profileDID={profileDID} />
        </Card>
      </ProfileWithAuthorization>
    );
  },
});

const followingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: `$profileDID${menuRoute[FOLLOWING]}`,
  loader: ({ context, params }) => {
    context.apolloClient.query({
      query: GetFollowingListByDidDocument,
      variables: {
        id: params.profileDID,
        first: ENGAGEMENTS_PER_PAGE,
      },
    });
  },
  component: () => {
    const { profileDID } = followingRoute.useParams();
    return (
      <ProfileWithAuthorization profileDID={profileDID}>
        <Card radius={20} padding="p-0">
          <ProfileHeader profileDID={profileDID} plain={true} customStyle="sticky top-3.5 z-50" />
          <FollowingPage profileDID={profileDID} />
        </Card>
      </ProfileWithAuthorization>
    );
  },
});

const interestsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: `$profileDID${menuRoute[INTERESTS]}`,
  component: () => {
    const { profileDID } = interestsRoute.useParams();
    return (
      <ProfileWithAuthorization profileDID={profileDID}>
        <ProfileHeader profileDID={profileDID} />
        <InterestsPage profileDID={profileDID} />
      </ProfileWithAuthorization>
    );
  },
});

const beamsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: `$profileDID${menuRoute[BEAMS]}`,
  component: () => {
    const { profileDID } = beamsRoute.useParams();
    return (
      <ProfileWithAuthorization profileDID={profileDID}>
        <ProfileHeader profileDID={profileDID} />
        <ProfileBeamsPage profileDID={profileDID} />
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

export const router = ({ baseRouteName, apolloClient }: ICreateRouter) =>
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
