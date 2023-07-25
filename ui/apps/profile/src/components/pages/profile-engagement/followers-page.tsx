import React, { useMemo } from 'react';
import FollowProfile from '../../follow-profile';
import Followers from '@akashaorg/design-system-components/lib/components/ProfileEngagements/Engagement/Followers';
import MasterPage from './master-page';
import { useTranslation } from 'react-i18next';
import { RootComponentProps } from '@akashaorg/typings/ui';
import { useParams } from 'react-router-dom';
import { useInfiniteGetFollowersListByDidQuery } from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';
import { useGetLogin } from '@akashaorg/ui-awf-hooks';

const FollowersPage: React.FC<RootComponentProps> = props => {
  const { t } = useTranslation('app-profile');
  const { profileId } = useParams<{ profileId: string }>();

  const loginQuery = useGetLogin();

  const navigateTo = props.plugins['@akashaorg/app-routing']?.routing?.navigateTo;

  const followersReq = useInfiniteGetFollowersListByDidQuery(
    null,
    {
      id: profileId,
      last: 10,
    },
    {
      enabled: !!loginQuery.data?.id,
    },
  );

  const followers = [];
  /*TODO: Fix the following */
  //  useMemo(
  //   () =>
  //     followersReq.data?.pages
  //       ? followersReq.data.pages?.flatMap(page =>
  //           'isViewer' in page.node
  //             ? page.node?.profile?.followers?.edges?.map(edge => edge?.node) || []
  //             : [],
  //         )
  //       : [],
  //   [followersReq.data?.pages],
  // );

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
    <MasterPage isLoggedIn={!!loginQuery.data?.id} navigateTo={navigateTo}>
      <Followers
        engagement={{
          status: followersReq.status,
          data: followers,
        }}
        loadingMoreLabel={`${t('Loading more')} ...`}
        profileAnchorLink={'/@akashaorg/app-profile'}
        renderFollowElement={(streamId, isFollowing) => (
          <FollowProfile streamId={streamId} isFollowing={isFollowing} navigateTo={navigateTo} />
        )}
        onError={onError}
        onProfileClick={onProfileClick}
      />
    </MasterPage>
  );
};

export default FollowersPage;
