import React, { useState } from 'react';
import DuplexButton from '@akashaorg/design-system-core/lib/components/DuplexButton';
import { useGetLogin } from '@akashaorg/ui-awf-hooks';
import { NavigateToParams } from '@akashaorg/typings/ui';
import { useTranslation } from 'react-i18next';
import {
  useCreateFollowMutation,
  useGetMyProfileQuery,
  useUpdateFollowMutation,
} from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';

type FollowProfileProps = {
  isFollowing?: string;
  streamId?: string;
  navigateTo?: (args: NavigateToParams) => void;
};

const FollowProfile: React.FC<FollowProfileProps> = props => {
  const { isFollowing, streamId, navigateTo } = props;

  const { t } = useTranslation('app-profile');

  const loginQuery = useGetLogin();

  const [loading, setLoading] = useState(false);

  const createFollowMutation = useCreateFollowMutation({
    onMutate: () => {
      setLoading(true);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const updateFollowMutation = useUpdateFollowMutation({
    onMutate: () => {
      setLoading(true);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const profileDataReq = useGetMyProfileQuery(null, {
    select: response => response?.viewer?.profile,
    enabled: !!loginQuery.data?.id,
  });

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

  const handleFollow = (profileStreamId: string, streamId?: string) => {
    if (!checkAuth()) return;
    if (!streamId) {
      createFollowMutation.mutate({
        i: { content: { isFollowing: true, profileID: profileStreamId } },
      });
    } else {
      updateFollowMutation.mutate({
        i: {
          id: streamId,
          content: { isFollowing: true, profileID: profileStreamId },
        },
      });
    }
  };

  const handleUnfollow = (profileStreamId: string, streamId?: string) => {
    if (!checkAuth()) return;
    updateFollowMutation.mutate({
      i: {
        id: streamId,
        content: { isFollowing: false, profileID: profileStreamId },
      },
    });
  };

  return (
    <DuplexButton
      inactiveLabel={t('Follow')}
      activeLabel={t('Following')}
      activeHoverLabel={t('Unfollow')}
      onClickInactive={() => handleFollow(profileDataReq.data?.id, streamId)}
      onClickActive={() => handleUnfollow(profileDataReq.data?.id, streamId)}
      active={!!isFollowing}
      size="sm"
      loading={loading}
      allowMinimization
    />
  );
};

export default FollowProfile;
