import React from 'react';
import ProfileEngagements from '@akashaorg/design-system-components/lib/components/ProfileEngagements';
import { ProfileEngagementLoading } from '@akashaorg/design-system-components/lib/components/ProfileEngagements/placeholders/ProfileEngagementLoading';
import { useTranslation } from 'react-i18next';
import { RootComponentProps, EngagementType } from '@akashaorg/typings/ui';

import { useParams } from 'react-router-dom';
import {
  useGetFollowersListByDidQuery,
  useGetFollowingListByDidQuery,
  useGetProfileByDidQuery,
  useUpdateFollowMutation,
} from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';

type ProfileEngagementsPageProps = {
  engagementType: EngagementType;
};

const ProfileEngagementsPage: React.FC<
  RootComponentProps & ProfileEngagementsPageProps
> = props => {
  const { t } = useTranslation('app-profile');
  const { profileId } = useParams<{ profileId: string }>();

  const navigateTo = props.plugins['@akashaorg/app-routing']?.routing?.navigateTo;

  const profileDataReq = useGetProfileByDidQuery(
    {
      id: profileId,
    },
    {
      select: response => response.node,
      enabled: !!profileId,
    },
  );

  const followersReq = useGetFollowersListByDidQuery(
    { id: profileId },
    { select: resp => resp.node },
  );

  const followingReq = useGetFollowingListByDidQuery(
    { id: profileId },
    { select: resp => resp.node },
  );

  const followMutation = useUpdateFollowMutation();

  if (
    followersReq.status === 'loading' ||
    followingReq.status === 'loading' ||
    profileDataReq.status === 'loading'
  ) {
    return <ProfileEngagementLoading />;
  }

  const { isViewer, profile: profileData } =
    'isViewer' in profileDataReq.data ? profileDataReq.data : { isViewer: null, profile: null };

  const followers =
    followersReq.data && 'isViewer' in followersReq.data
      ? followersReq.data?.profile?.followers?.edges?.map(edge => edge.node)
      : [];

  const following =
    followingReq.data && 'isViewer' in followingReq.data
      ? followingReq.data?.followList?.edges?.map(edge => edge.node)
      : [];

  const onProfileClick = (profileId: string) => {
    navigateTo?.({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: navRoutes => `${navRoutes.rootRoute}/${profileId}`,
    });
  };

  const onFollow = (profileId: string) => {
    followMutation.mutate({ i: { id: profileId, content: { isFollowing: true } } });
  };

  const onUnfollow = (profileId: string) => {
    followMutation.mutate({ i: { id: profileId, content: { isFollowing: false } } });
  };

  const onError = () => {
    navigateTo?.({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: navRoutes => `${navRoutes.rootRoute}`,
    });
  };

  return (
    <ProfileEngagements
      engagementType={props.engagementType}
      followers={{
        label: t('Followers'),
        status: followersReq.status,
        data: followers,
      }}
      following={{
        label: t('Following'),
        status: followingReq.status,
        data: following,
      }}
      followLabel={t('Follow')}
      unFollowLabel={t('Unfollow')}
      followingLabel={t('Following')}
      loadingMoreLabel={`${t('Loading more')} ...`}
      profileAnchorLink={'/@akashaorg/app-profile'}
      ownerUserName={profileData.name}
      viewerIsOwner={isViewer}
      onError={onError}
      onProfileClick={onProfileClick}
      onFollow={onFollow}
      onUnfollow={onUnfollow}
      onChange={engagementType => {
        navigateTo?.({
          appName: '@akashaorg/app-profile',
          getNavigationUrl: () => `${profileId}/${engagementType}`,
        });
      }}
    />
  );
};

export default ProfileEngagementsPage;
