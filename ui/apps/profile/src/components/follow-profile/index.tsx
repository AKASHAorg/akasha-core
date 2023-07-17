import React, { useState } from 'react';
import DuplexButton from '@akashaorg/design-system-core/lib/components/DuplexButton';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import { useGetLogin } from '@akashaorg/ui-awf-hooks';
import { NavigateToParams } from '@akashaorg/typings/ui';
import { useTranslation } from 'react-i18next';
import { useFollowIds } from './use-follow-ids';
import {
  useCreateFollowMutation,
  useGetMyProfileQuery,
  useUpdateFollowMutation,
} from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';

type FollowProfileProps = {
  profileId: string;
  isIconButton?: boolean;
  navigateTo?: (args: NavigateToParams) => void;
};

const FollowProfile: React.FC<FollowProfileProps> = props => {
  const { profileId, isIconButton, navigateTo } = props;

  const { t } = useTranslation('app-profile');

  const loginQuery = useGetLogin();

  const [loading, setLoading] = useState(false);

  const { followProfile, unFollowProfile, getFollowId } = useFollowIds(loginQuery.data?.id);

  const createFollowMutation = useCreateFollowMutation({
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: ({ createFollow }) => {
      followProfile(loginQuery.data?.id, String(profileId), createFollow.document.id);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const updateFollowMutation = useUpdateFollowMutation({
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: () => {
      unFollowProfile(loginQuery.data?.id, String(profileId));
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const profileDataReq = useGetMyProfileQuery(null, {
    select: response => response?.viewer?.profile,
    enabled: !!loginQuery.data?.id,
  });

  const followId = getFollowId(loginQuery.data?.id, String(profileId));

  const isFollowing = !!followId;

  const checkAuth = () => {
    if (!loginQuery.data?.id && navigateTo) {
      navigateTo({
        appName: '@akashaorg/app-auth-ewa',
        getNavigationUrl: navRoutes => navRoutes.CONNECT,
      });
      return false;
    }
    return true;
  };

  const handleFollow = (profileStreamId: string) => {
    if (!checkAuth()) return;
    if (!isFollowing) {
      createFollowMutation.mutate({
        i: { content: { isFollowing: true, profileID: profileStreamId } },
      });
    } else {
      updateFollowMutation.mutate({
        i: {
          id: followId,
          content: { isFollowing: true, profileID: profileStreamId },
        },
      });
    }
  };

  const handleUnfollow = (profileStreamId: string, followStreamId: string) => {
    if (!checkAuth()) return;
    updateFollowMutation.mutate({
      i: {
        id: followStreamId,
        content: { isFollowing: false, profileID: profileStreamId },
      },
    });
  };

  if (isIconButton) {
    return (
      <>
        {isFollowing ? (
          <Button
            size="sm"
            icon="UserPlusIcon"
            onClick={() => handleUnfollow(profileDataReq.data?.id, followId)}
            variant="primary"
            loading={loading}
            iconOnly
          />
        ) : (
          <Button
            onClick={() => handleFollow(profileDataReq.data?.id)}
            icon="UsersIcon"
            loading={loading}
            greyBg
            iconOnly
          />
        )}
      </>
    );
  }

  return (
    <DuplexButton
      inactiveLabel={t('Follow')}
      activeLabel={t('Following')}
      activeHoverLabel={t('Following')}
      onClickInactive={() => handleFollow(String(profileId))}
      onClickActive={() => handleUnfollow(String(profileId), followId)}
      active={!!isFollowing}
      size="sm"
      loading={loading}
      allowMinimization
    />
  );
};

export default FollowProfile;
