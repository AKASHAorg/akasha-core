import React, { useMemo, useState } from 'react';
import FollowProfile from '../../follow-profile';
import Followers from '@akashaorg/design-system-components/lib/components/ProfileEngagements/Engagement/Followers';
import EngagementTab from './engagement-tab';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import EntryError from '@akashaorg/design-system-components/lib/components/ProfileEngagements/Entry/EntryError';
import ProfileEngagementLoading from '@akashaorg/design-system-components/lib/components/ProfileEngagements/placeholders/profile-engagement-loading';
import { RootComponentProps, ModalNavigationOptions } from '@akashaorg/typings/ui';
import { useParams } from 'react-router-dom';
import {
  useGetProfileByDidQuery,
  useInfiniteGetFollowersListByDidQuery,
} from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';
import { getProfileImageVersionsWithMediaUrl, hasOwn, useGetLogin } from '@akashaorg/ui-awf-hooks';

const FollowersPage: React.FC<RootComponentProps> = props => {
  const { plugins, navigateToModal } = props;
  const { profileId } = useParams<{ profileId: string }>();

  const navigateTo = plugins['@akashaorg/app-routing']?.routing?.navigateTo;

  const [loadMore, setLoadingMore] = useState(false);
  const loginQuery = useGetLogin();

  const showLoginModal = (redirectTo?: { modal: ModalNavigationOptions }) => {
    navigateToModal({ name: 'login', redirectTo });
  };

  const profileDataReq = useGetProfileByDidQuery(
    {
      id: profileId,
    },
    {
      select: response => response.node,
      enabled: !!loginQuery.data?.id,
    },
  );
  const followersReq = useInfiniteGetFollowersListByDidQuery(
    'first',
    {
      id: profileId,
      first: 10,
    },
    {
      getNextPageParam: lastPage => {
        const pageInfo =
          lastPage?.node && hasOwn(lastPage?.node, 'isViewer')
            ? lastPage.node?.akashaProfile?.followers?.pageInfo
            : null;
        if (pageInfo && pageInfo.hasNextPage) {
          return { after: pageInfo.endCursor };
        }
      },
      getPreviousPageParam: firstPage => {
        const pageInfo =
          firstPage?.node && hasOwn(firstPage?.node, 'isViewer')
            ? firstPage.node?.akashaProfile?.followers?.pageInfo
            : null;
        if (pageInfo && pageInfo.hasPreviousPage) {
          return { before: pageInfo.startCursor };
        }
      },
      onSettled: () => {
        setLoadingMore(false);
      },
      enabled: !!loginQuery.data?.id,
    },
  );
  const followers = useMemo(
    () =>
      followersReq.data?.pages
        ? followersReq.data.pages?.flatMap(page =>
            hasOwn(page.node, 'isViewer')
              ? page.node?.akashaProfile?.followers?.edges?.map(edge => edge?.node) || []
              : [],
          )
        : [],
    [followersReq.data],
  );
  const isViewer =
    profileDataReq.data && 'isViewer' in profileDataReq.data ? profileDataReq.data.isViewer : null;

  const lastPageInfo = React.useMemo(() => {
    const lastPage = followersReq.data?.pages?.[followersReq.data?.pages?.length - 1];
    return lastPage?.node && hasOwn(lastPage?.node, 'isViewer')
      ? lastPage?.node.akashaProfile?.followers?.pageInfo
      : null;
  }, [followersReq]);

  if (!loginQuery.data?.id) {
    return navigateTo({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: () => `/${profileId}`,
    });
  }

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
    <EngagementTab isLoggedIn={!!loginQuery.data?.id} navigateTo={navigateTo}>
      {followersReq.status === 'loading' && <ProfileEngagementLoading />}
      {followersReq.status === 'error' && (
        <Stack customStyle="mt-8">
          <EntryError onError={onError} />
        </Stack>
      )}
      {followersReq.status === 'success' && (
        <Followers
          followers={followers}
          profileAnchorLink={'/@akashaorg/app-profile'}
          viewerIsOwner={isViewer}
          loadMore={loadMore}
          onLoadMore={() => {
            if (lastPageInfo && lastPageInfo.hasNextPage) {
              setLoadingMore(true);
              followersReq.fetchNextPage();
            }
          }}
          renderFollowElement={(profileStreamId, followStreamId, isFollowing) => (
            <FollowProfile
              loggedInProfileId={loginQuery.data?.id}
              profileStreamId={profileStreamId}
              isLoggedIn={!!loginQuery.data?.id}
              followStreamId={followStreamId}
              isFollowing={isFollowing}
              showLoginModal={showLoginModal}
            />
          )}
          onProfileClick={onProfileClick}
          getMediaUrl={getProfileImageVersionsWithMediaUrl}
        />
      )}
    </EngagementTab>
  );
};

export default FollowersPage;
