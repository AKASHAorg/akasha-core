import React, { useMemo } from 'react';
import FollowProfile from '../../follow-profile';
import Followers from '@akashaorg/design-system-components/lib/components/ProfileEngagements/Engagement/Followers';
import MasterPage from './master-page';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import EntryError from '@akashaorg/design-system-components/lib/components/ProfileEngagements/Entry/EntryError';
import { useTranslation } from 'react-i18next';
import { RootComponentProps } from '@akashaorg/typings/ui';
import { useParams } from 'react-router-dom';
import {
  useGetProfileByDidQuery,
  useInfiniteGetFollowersListByDidQuery,
} from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';
import { getProfileImageVersionsWithMediaUrl, useGetLogin } from '@akashaorg/ui-awf-hooks';
import { ProfileEngagementLoading } from '@akashaorg/design-system-components/lib/components/ProfileEngagements/placeholders/ProfileEngagementLoading';

const FollowersPage: React.FC<RootComponentProps> = props => {
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

  const followersReq = useInfiniteGetFollowersListByDidQuery(
    'last',
    {
      id: profileId,
      last: 10,
    },
    {
      enabled: !!loginQuery.data?.id,
    },
  );

  const followers = useMemo(
    () =>
      followersReq.data?.pages
        ? followersReq.data.pages?.flatMap(page =>
            'isViewer' in page.node
              ? page.node?.profile?.followers?.edges?.map(edge => edge?.node) || []
              : [],
          )
        : [],
    [followersReq.data],
  );

  const isViewer =
    profileDataReq.data && 'isViewer' in profileDataReq.data ? profileDataReq.data.isViewer : null;

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
      {followersReq.status === 'loading' && <ProfileEngagementLoading />}
      {followersReq.status === 'error' && (
        <Box customStyle="mt-8">
          <EntryError onError={onError} />
        </Box>
      )}
      {followersReq.status === 'success' && (
        <Followers
          followers={followers}
          loadingMoreLabel={`${t('Loading more')} ...`}
          profileAnchorLink={'/@akashaorg/app-profile'}
          viewerIsOwner={isViewer}
          renderFollowElement={(profileStreamId, followStreamId, isFollowing) => (
            <FollowProfile
              loggedInProfileId={loginQuery.data?.id}
              profileStreamId={profileStreamId}
              isLoggedIn={!!loginQuery.data?.id}
              followStreamId={followStreamId}
              isFollowing={isFollowing}
              navigateTo={navigateTo}
            />
          )}
          onProfileClick={onProfileClick}
          getMediaUrl={getProfileImageVersionsWithMediaUrl}
        />
      )}
    </MasterPage>
  );
};

export default FollowersPage;
