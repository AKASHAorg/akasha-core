import React, { useMemo, useState } from 'react';
import FollowProfileButton from '../../follow-profile-button';
import Followers from '@akashaorg/design-system-components/lib/components/ProfileEngagements/Engagement/Followers';
import EngagementTab from './engagement-tab';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import TextLine from '@akashaorg/design-system-core/lib/components/TextLine';
import EntryError from '@akashaorg/design-system-components/lib/components/ProfileEngagements/Entry/EntryError';
import ProfileEngagementLoading from '@akashaorg/design-system-components/lib/components/ProfileEngagements/placeholders/profile-engagement-loading';
import { ModalNavigationOptions } from '@akashaorg/typings/lib/ui';
import { useParams } from 'react-router-dom';
import {
  useGetFollowDocumentsQuery,
  useInfiniteGetFollowersListByDidQuery,
} from '@akashaorg/ui-awf-hooks/lib/generated';
import {
  transformImageVersions,
  hasOwn,
  getFollowList,
  useRootComponentProps,
} from '@akashaorg/ui-awf-hooks';

export type FollowersPageProps = {
  isLoggedIn: boolean;
  authenticatedDID: string;
  showLoginModal: (redirectTo?: { modal: ModalNavigationOptions }) => void;
};

const FollowersPage: React.FC<FollowersPageProps> = props => {
  const { isLoggedIn, authenticatedDID, showLoginModal } = props;
  const [loadMore, setLoadingMore] = useState(false);
  const { profileId } = useParams<{ profileId: string }>();

  const { getRoutingPlugin } = useRootComponentProps();
  const navigateTo = getRoutingPlugin().navigateTo;

  const followersReq = useInfiniteGetFollowersListByDidQuery(
    'first',
    {
      id: profileId,
      first: 10,
    },
    {
      getNextPageParam: lastPage => {
        const pageInfo =
          lastPage?.node && hasOwn(lastPage?.node, 'akashaProfile')
            ? lastPage.node?.akashaProfile?.followers?.pageInfo
            : null;
        if (pageInfo && pageInfo.hasNextPage) {
          return { after: pageInfo.endCursor };
        }
      },
      getPreviousPageParam: firstPage => {
        const pageInfo =
          firstPage?.node && hasOwn(firstPage?.node, 'akashaProfile')
            ? firstPage.node?.akashaProfile?.followers?.pageInfo
            : null;
        if (pageInfo && pageInfo.hasPreviousPage) {
          return { before: pageInfo.startCursor };
        }
      },
      onSettled: () => {
        setLoadingMore(false);
      },
      enabled: isLoggedIn,
    },
  );
  const followers = useMemo(
    () =>
      followersReq.data?.pages
        ? followersReq.data.pages?.flatMap(page =>
            hasOwn(page.node, 'akashaProfile')
              ? page.node?.akashaProfile?.followers?.edges
                  ?.map(edge => edge?.node)
                  .filter(node => node.did.akashaProfile) || []
              : [],
          )
        : [],
    [followersReq.data],
  );
  const lastPageInfo = useMemo(() => {
    const lastPage = followersReq.data?.pages?.[followersReq.data?.pages?.length - 1];
    return lastPage?.node && hasOwn(lastPage?.node, 'akashaProfile')
      ? lastPage?.node.akashaProfile?.followers?.pageInfo
      : null;
  }, [followersReq]);
  const followProfileIds = useMemo(
    () => followers.map(follower => follower.did?.akashaProfile?.id).filter(id => !!id),
    [followers],
  );
  const followDocumentsReq = useGetFollowDocumentsQuery(
    {
      following: followProfileIds,
      last: followProfileIds.length,
    },
    {
      select: response => response.viewer?.akashaFollowList,
      enabled: isLoggedIn && !!followProfileIds.length,
    },
  );

  if (!isLoggedIn) {
    return navigateTo({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: () => `/${profileId}`,
    });
  }

  const followList = getFollowList(followDocumentsReq.data?.edges?.map(edge => edge?.node));

  const onProfileClick = (profileId: string) => {
    navigateTo?.({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: navRoutes => `${navRoutes.rootRoute}/${profileId}`,
    });
  };

  const onError = () => {
    navigateTo?.({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: navRoutes => `${navRoutes.rootRoute}`,
    });
  };

  return (
    <EngagementTab navigateTo={navigateTo}>
      {followersReq.status === 'loading' && <ProfileEngagementLoading />}
      {followersReq.status === 'error' && (
        <Stack customStyle="mt-8">
          <EntryError onError={onError} />
        </Stack>
      )}
      {followersReq.status === 'success' && (
        <Followers
          authenticatedDID={authenticatedDID}
          followers={followers}
          followList={followList}
          profileAnchorLink={'/@akashaorg/app-profile'}
          loadMore={loadMore}
          onLoadMore={() => {
            if (lastPageInfo && lastPageInfo.hasNextPage) {
              setLoadingMore(true);
              followersReq.fetchNextPage();
            }
          }}
          renderFollowElement={(profileId, followId, isFollowing) =>
            followDocumentsReq.status === 'loading' ? (
              <TextLine width="w-24" animated />
            ) : (
              <FollowProfileButton
                profileID={profileId}
                isLoggedIn={isLoggedIn}
                followId={followId}
                isFollowing={isFollowing}
                showLoginModal={showLoginModal}
              />
            )
          }
          onProfileClick={onProfileClick}
          transformImageVersions={transformImageVersions}
        />
      )}
    </EngagementTab>
  );
};

export default FollowersPage;
