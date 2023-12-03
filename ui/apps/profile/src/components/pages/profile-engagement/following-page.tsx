import React, { useMemo, useState } from 'react';
import FollowProfileButton from '../../follow-profile-button';
import Following from '@akashaorg/design-system-components/lib/components/ProfileEngagements/Engagement/Following';
import EngagementTab from './engagement-tab';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import TextLine from '@akashaorg/design-system-core/lib/components/TextLine';
import EntryError from '@akashaorg/design-system-components/lib/components/ProfileEngagements/Entry/EntryError';
import ProfileEngagementLoading from '@akashaorg/design-system-components/lib/components/ProfileEngagements/placeholders/profile-engagement-loading';
import { ModalNavigationOptions } from '@akashaorg/typings/lib/ui';
import { useParams } from 'react-router-dom';
import {
  useGetFollowDocumentsQuery,
  useGetProfileByDidQuery,
  useInfiniteGetFollowingListByDidQuery,
} from '@akashaorg/ui-awf-hooks/lib/generated';
import {
  getProfileImageUrl,
  hasOwn,
  getFollowList,
  useRootComponentProps,
  useLoggedIn,
} from '@akashaorg/ui-awf-hooks';
export type FollowingPageProps = {
  showLoginModal: (redirectTo?: { modal: ModalNavigationOptions }) => void;
};
const FollowingPage: React.FC<FollowingPageProps> = props => {
  const { showLoginModal } = props;
  const [loadMore, setLoadingMore] = useState(false);
  const { profileId } = useParams<{ profileId: string }>();

  const { getRoutingPlugin } = useRootComponentProps();
  const navigateTo = getRoutingPlugin().navigateTo;

  const { isLoggedIn, isLoading, authenticatedDID } = useLoggedIn();
  const profileDataReq = useGetProfileByDidQuery(
    {
      id: profileId,
    },
    {
      select: response => response.node,
      enabled: isLoggedIn,
    },
  );

  const { akashaProfile: profileData } =
    profileDataReq.data && hasOwn(profileDataReq.data, 'akashaProfile')
      ? profileDataReq.data
      : { akashaProfile: null };

  const followingReq = useInfiniteGetFollowingListByDidQuery(
    'first',
    {
      id: profileId,
      first: 10,
    },
    {
      getNextPageParam: lastPage => {
        const pageInfo =
          lastPage?.node && hasOwn(lastPage?.node, 'akashaFollowList')
            ? lastPage.node.akashaFollowList?.pageInfo
            : null;
        if (pageInfo && pageInfo.hasNextPage) {
          return { after: pageInfo.endCursor };
        }
      },
      getPreviousPageParam: firstPage => {
        const pageInfo =
          firstPage?.node && hasOwn(firstPage?.node, 'akashaFollowList')
            ? firstPage.node.akashaFollowList?.pageInfo
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
  const following = useMemo(
    () =>
      followingReq.data?.pages
        ? followingReq.data.pages?.flatMap(page =>
            hasOwn(page.node, 'akashaFollowList')
              ? page?.node?.akashaFollowList?.edges?.map(edge => edge?.node) || []
              : [],
          )
        : [],
    [followingReq.data],
  );
  const lastPageInfo = useMemo(() => {
    const lastPage = followingReq.data?.pages?.[followingReq.data?.pages?.length - 1];
    return lastPage?.node && hasOwn(lastPage?.node, 'akashaFollowList')
      ? lastPage?.node.akashaFollowList?.pageInfo
      : null;
  }, [followingReq]);
  const followProfileIds = useMemo(() => following.map(follow => follow.profile?.id), [following]);
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

  if (!isLoggedIn && !isLoading) {
    return navigateTo({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: () => `/${profileId}`,
    });
  }

  const followList = getFollowList(followDocumentsReq.data?.edges.map(edge => edge?.node));

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
      {followingReq.status === 'loading' && <ProfileEngagementLoading />}
      {followingReq.status === 'error' && (
        <Stack customStyle="mt-8">
          <EntryError onError={onError} />
        </Stack>
      )}
      {followingReq.status === 'success' && (
        <Following
          authenticatedDID={authenticatedDID}
          followList={followList}
          following={following}
          profileAnchorLink={'/@akashaorg/app-profile'}
          ownerUserName={profileData.name}
          viewerIsOwner={authenticatedDID === profileData.did.id}
          loadMore={loadMore}
          onLoadMore={() => {
            if (lastPageInfo && lastPageInfo.hasNextPage) {
              setLoadingMore(true);
              followingReq.fetchNextPage();
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
          getMediaUrl={getProfileImageUrl}
        />
      )}
    </EngagementTab>
  );
};

export default FollowingPage;
