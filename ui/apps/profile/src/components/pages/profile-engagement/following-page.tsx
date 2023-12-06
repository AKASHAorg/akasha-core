import React, { useMemo, useState } from 'react';
import FollowProfileButton from '../../follow-profile-button';
import Following from '@akashaorg/design-system-components/lib/components/ProfileEngagements/Engagement/Following';
import EngagementTab from './engagement-tab';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import EntryError from '@akashaorg/design-system-components/lib/components/ProfileEngagements/Entry/EntryError';
import ProfileEngagementLoading from '@akashaorg/design-system-components/lib/components/ProfileEngagements/placeholders/profile-engagement-loading';
import routes, { FOLLOWING } from '../../../routes';
import { ModalNavigationOptions } from '@akashaorg/typings/lib/ui';
import { useParams } from 'react-router-dom';
import {
  useGetFollowDocumentsByDidQuery,
  useGetProfileByDidQuery,
  useGetFollowingListByDidQuery,
} from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import {
  transformImageVersions,
  hasOwn,
  getFollowList,
  useRootComponentProps,
} from '@akashaorg/ui-awf-hooks';

export type FollowingPageProps = {
  isLoggedIn: boolean;
  authenticatedDID: string;
  showLoginModal: (redirectTo?: { modal: ModalNavigationOptions }) => void;
};

const FollowingPage: React.FC<FollowingPageProps> = props => {
  const { isLoggedIn, authenticatedDID, showLoginModal } = props;
  const [loadMore, setLoadingMore] = useState(false);
  const { profileId } = useParams<{ profileId: string }>();
  const { getRoutingPlugin } = useRootComponentProps();
  const navigateTo = getRoutingPlugin().navigateTo;

  const { data: profileDataByDid } = useGetProfileByDidQuery({
    variables: {
      id: profileId,
    },
    skip: !isLoggedIn,
  });
  const { data, error, loading, fetchMore } = useGetFollowingListByDidQuery({
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
  const { data: followDocuments } = useGetFollowDocumentsByDidQuery({
    variables: {
      id: authenticatedDID,
      following: followProfileIds,
      last: followProfileIds.length,
    },
    skip: !isLoggedIn || !followProfileIds.length,
  });

  if (!isLoggedIn) {
    return navigateTo({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: () => `/${profileId}`,
    });
  }

  const { akashaProfile: profileData } =
    profileDataByDid?.node && hasOwn(profileDataByDid.node, 'akashaProfile')
      ? profileDataByDid.node
      : { akashaProfile: null };

  const followList = getFollowList(
    followDocuments?.node && hasOwn(followDocuments.node, 'akashaFollowList')
      ? followDocuments.node?.akashaFollowList?.edges.map(edge => edge?.node)
      : null,
  );

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
      {loading && <ProfileEngagementLoading />}
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
          ownerUserName={profileData.name}
          viewerIsOwner={authenticatedDID === profileData.did.id}
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
          transformImageVersions={transformImageVersions}
        />
      )}
    </EngagementTab>
  );
};

export default FollowingPage;
