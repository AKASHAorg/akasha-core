import React, { useMemo } from 'react';
import FollowProfile from '../../follow-profile';
import Following from '@akashaorg/design-system-components/lib/components/ProfileEngagements/Engagement/Following';
import EngagementTab from './engagement-tab';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import EntryError from '@akashaorg/design-system-components/lib/components/ProfileEngagements/Entry/EntryError';
import { useTranslation } from 'react-i18next';
import { RootComponentProps } from '@akashaorg/typings/ui';
import { useParams } from 'react-router-dom';
import {
  useGetProfileByDidQuery,
  useInfiniteGetFollowingListByDidQuery,
} from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';
import { getProfileImageVersionsWithMediaUrl, useGetLogin } from '@akashaorg/ui-awf-hooks';
import { ProfileEngagementLoading } from '@akashaorg/design-system-components/lib/components/ProfileEngagements/placeholders/ProfileEngagementLoading';

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
    'last',
    {
      id: profileId,
      last: 10,
    },
    {
      enabled: !!loginQuery.data?.id,
    },
  );
  const following = useMemo(
    () =>
      followingReq.data?.pages
        ? followingReq.data.pages?.flatMap(page =>
            'isViewer' in page.node
              ? page?.node?.followList?.edges?.map(edge => edge?.node) || []
              : [],
          )
        : [],
    [followingReq.data],
  );

  if (!loginQuery.data?.id) {
    return navigateTo({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: () => `/${profileId}`,
    });
  }

  const { isViewer, profile: profileData } = Object.assign(
    { isViewer: null, profile: null },
    profileDataReq.data,
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
      getNavigationUrl: navRoutes => `${navRoutes.rootRoute}`,
    });
  };

  return (
    <EngagementTab isLoggedIn={!!loginQuery.data?.id} navigateTo={navigateTo}>
      {followingReq.status === 'loading' && <ProfileEngagementLoading />}
      {followingReq.status === 'error' && (
        <Box customStyle="mt-8">
          <EntryError onError={onError} />
        </Box>
      )}
      {followingReq.status === 'success' && (
        <Following
          following={following}
          loadingMoreLabel={`${t('Loading more')} ...`}
          profileAnchorLink={'/@akashaorg/app-profile'}
          ownerUserName={profileData.name}
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
    </EngagementTab>
  );
};

export default FollowingPage;
