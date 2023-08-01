import React, { useState } from 'react';
import DuplexButton from '@akashaorg/design-system-core/lib/components/DuplexButton';
import { useGetLogin } from '@akashaorg/ui-awf-hooks';
import { ModalNavigationOptions } from '@akashaorg/typings/ui';
import { useTranslation } from 'react-i18next';
import {
  useCreateFollowMutation,
  useGetMyProfileQuery,
  useUpdateFollowMutation,
} from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';

type FollowProfileProps = {
  isFollowing?: string;
  streamId?: string;
  showLoginModal: (redirectTo?: { modal: ModalNavigationOptions }) => void;
};

const FollowProfile: React.FC<FollowProfileProps> = props => {
  const { isFollowing, streamId, showLoginModal } = props;

  const { t } = useTranslation('app-profile');

  const loginQuery = useGetLogin();

  const isLoggedIn = React.useMemo(() => {
    return !!loginQuery.data?.id;
  }, [loginQuery.data]);

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
    enabled: isLoggedIn,
  });

  const handleFollow = (profileStreamId: string, streamId?: string) => {
    if (!isLoggedIn) {
      return showLoginModal();
    }
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
    if (!isLoggedIn) {
      return showLoginModal();
    }
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
