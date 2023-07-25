import React, { useMemo } from 'react';
import FollowProfile from '../../follow-profile';
import Following from '@akashaorg/design-system-components/lib/components/ProfileEngagements/Engagement/Following';
import MasterPage from './master-page';
import { useTranslation } from 'react-i18next';
import { RootComponentProps } from '@akashaorg/typings/ui';
import { useParams } from 'react-router-dom';
import {
  useGetProfileByDidQuery,
  useInfiniteGetFollowingListByDidQuery,
} from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';
import { useGetLogin } from '@akashaorg/ui-awf-hooks';

const FollowingPage: React.FC<RootComponentProps> = props => {
  const { t } = useTranslation('app-profile');
  const { profileId } = useParams<{ profileId: string }>();

  const loginQuery = useGetLogin();

  const navigateTo = props.plugins['@akashaorg/app-routing']?.routing?.navigateTo;

  const profileDataReq = useGetProfileByDidQuery(
    {
      id: profileId,
    },
    {
      select: response => response.node,
      enabled: !!loginQuery.data?.id,
    },
  );

  const followingReq = useInfiniteGetFollowingListByDidQuery(
    null,
    {
      id: profileId,
      last: 10,
    },
    {
      enabled: !!loginQuery.data?.id,
    },
  );

  const following = [];

  /*TODO: Fix the following */
  // useMemo(
  //   () =>
  //     followingReq.data?.pages
  //       ? followingReq.data.pages?.flatMap(page =>
  //           'isViewer' in page.node
  //             ? page?.node?.followList?.edges?.map(edge => edge?.node) || []
  //             : [],
  //         )
  //       : [],
  //   [followingReq.data?.pages],
  // );

  if (!loginQuery.data?.id) {
    return navigateTo({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: () => `/${profileId}`,
    });
  }

  const { isViewer, profile: profileData } =
    'isViewer' in profileDataReq.data ? profileDataReq.data : { isViewer: null, profile: null };

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
    <MasterPage isLoggedIn={!!loginQuery.data?.id} navigateTo={navigateTo}>
      <Following
        engagement={{
          status: followingReq.status,
          data: following,
        }}
        loadingMoreLabel={`${t('Loading more')} ...`}
        profileAnchorLink={'/@akashaorg/app-profile'}
        ownerUserName={profileData.name}
        viewerIsOwner={isViewer}
        renderFollowElement={(streamId, isFollowing) => (
          <FollowProfile streamId={streamId} isFollowing={isFollowing} navigateTo={navigateTo} />
        )}
        onError={onError}
        onProfileClick={onProfileClick}
      />
    </MasterPage>
  );
};

export default FollowingPage;
