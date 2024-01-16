import React, { useMemo, useState } from 'react';
import FollowProfileButton from '../../follow-profile-button';
import Following from '@akashaorg/design-system-components/lib/components/ProfileEngagements/Engagement/Following';
import EngagementTab from './engagement-tab';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import EntryError from '@akashaorg/design-system-components/lib/components/ProfileEngagements/Entry/EntryError';
import ProfileEngagementLoading from '@akashaorg/design-system-components/lib/components/ProfileEngagements/placeholders/profile-engagement-loading';
import routes, { FOLLOWING } from '../../../routes';
import { ModalNavigationOptions } from '@akashaorg/typings/lib/ui';
import { useParams } from '@tanstack/react-router';
import {
  useGetFollowDocumentsByDidSuspenseQuery,
  useGetFollowingListByDidSuspenseQuery,
} from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import {
  transformSource,
  hasOwn,
  getFollowList,
  useRootComponentProps,
  useGetLogin,
  useGetLoginProfile,
} from '@akashaorg/ui-awf-hooks';

const FollowingPage: React.FC<unknown> = () => {
  const { data: loginData, loading: authenticating } = useGetLogin();
  const { profileId } = useParams({ strict: false });
  const { getRoutingPlugin, navigateToModal } = useRootComponentProps();
  const [loadMore, setLoadingMore] = useState(false);
  const authenticatedDID = loginData?.id;
  const isLoggedIn = !!loginData?.id;
  const navigateTo = getRoutingPlugin().navigateTo;

  const authenticatedProfileDataReq = useGetLoginProfile();
  const { data, error, fetchMore } = useGetFollowingListByDidSuspenseQuery({
    fetchPolicy: 'cache-first',
    variables: {
      id: profileId,
      first: 10,
    },
    skip: !isLoggedIn,
  });
  const following = useMemo(
    () =>
      data?.node && hasOwn(data.node, 'akashaFollowList')
        ? data?.node?.akashaFollowList?.edges?.map(edge => edge?.node) || []
        : [],
    [data?.node],
  );
  const pageInfo = useMemo(() => {
    return data?.node && hasOwn(data?.node, 'akashaFollowList')
      ? data?.node.akashaFollowList?.pageInfo
      : null;
  }, [data]);
  const followProfileIds = useMemo(() => following.map(follow => follow.profile?.id), [following]);
  const { data: followDocuments } = useGetFollowDocumentsByDidSuspenseQuery({
    fetchPolicy: 'cache-and-network',
    variables: {
      id: authenticatedDID,
      following: followProfileIds,
      last: followProfileIds.length,
    },
    skip: !isLoggedIn || !followProfileIds.length,
  });
  const authenticatedProfile = authenticatedProfileDataReq?.akashaProfile;

  if (authenticating)
    return (
      <EngagementTab navigateTo={navigateTo}>
        <ProfileEngagementLoading />
      </EngagementTab>
    );

  if (!isLoggedIn) {
    return navigateTo({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: () => `/${profileId}`,
    });
  }

  const followList = getFollowList(
    followDocuments?.node && hasOwn(followDocuments.node, 'akashaFollowList')
      ? followDocuments.node?.akashaFollowList?.edges.map(edge => edge?.node)
      : null,
  );

  const showLoginModal = (redirectTo?: { modal: ModalNavigationOptions }) => {
    navigateToModal({
      name: 'login',
      redirectTo,
    });
  };
  const onProfileClick = (profileId: string) => {
    navigateTo?.({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: navRoutes => `${navRoutes.rootRoute}/${profileId}`,
    });
  };

  const onError = () => {
    navigateTo?.({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: navRoutes => `${navRoutes.rootRoute}/${profileId}${routes[FOLLOWING]}`,
    });
  };

  return (
    <EngagementTab navigateTo={navigateTo}>
      {error && (
        <Stack customStyle="mt-8">
          <EntryError onError={onError} />
        </Stack>
      )}
      {data && (
        <Following
          authenticatedDID={authenticatedDID}
          followList={followList}
          following={following}
          profileAnchorLink={'/@akashaorg/app-profile'}
          ownerUserName={authenticatedProfile?.name}
          viewerIsOwner={authenticatedDID === authenticatedProfile?.did.id}
          loadMore={loadMore}
          onLoadMore={async () => {
            if (pageInfo && pageInfo.hasNextPage) {
              setLoadingMore(true);
              await fetchMore({
                variables: {
                  after: pageInfo.endCursor,
                },
              });
              setLoadingMore(false);
            }
          }}
          renderFollowElement={(profileId, followId, isFollowing) => (
            <FollowProfileButton
              profileID={profileId}
              isLoggedIn={isLoggedIn}
              followId={followId}
              isFollowing={isFollowing}
              showLoginModal={showLoginModal}
            />
          )}
          onProfileClick={onProfileClick}
          transformSource={transformSource}
        />
      )}
    </EngagementTab>
  );
};

export default FollowingPage;
