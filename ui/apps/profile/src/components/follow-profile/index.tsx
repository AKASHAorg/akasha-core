import React, { useState } from 'react';
import DuplexButton from '@akashaorg/design-system-core/lib/components/DuplexButton';
import { ModalNavigationOptions } from '@akashaorg/typings/ui';
import { useTranslation } from 'react-i18next';
import {
  useCreateFollowMutation,
  useInfiniteGetFollowersListByDidQuery,
  useUpdateFollowMutation,
} from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';
import { useQueryClient } from '@tanstack/react-query';

export type FollowProfileProps = {
  loggedInProfileId: string;
  profileStreamId: string;
  isLoggedIn: boolean;
  isFollowing: boolean;
  followStreamId: string | null;
  showLoginModal: (redirectTo?: { modal: ModalNavigationOptions }) => void;
};

const FollowProfile: React.FC<FollowProfileProps> = props => {
  const {
    loggedInProfileId,
    profileStreamId,
    isLoggedIn,
    isFollowing,
    followStreamId,
    showLoginModal,
  } = props;

  const queryClient = useQueryClient();

  const [following, setFollowing] = useState(isFollowing);

  const { t } = useTranslation('app-profile');

  const [loading, setLoading] = useState(false);

  const createFollowMutation = useCreateFollowMutation({
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: async ({ createFollow }) => {
      setFollowing(createFollow.document.isFollowing);
      await queryClient.invalidateQueries(
        useInfiniteGetFollowersListByDidQuery.getKey({ id: loggedInProfileId }),
      );
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const updateFollowMutation = useUpdateFollowMutation({
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: async ({ updateFollow }) => {
      setFollowing(updateFollow.document.isFollowing);
      await queryClient.invalidateQueries(
        useInfiniteGetFollowersListByDidQuery.getKey({ id: loggedInProfileId }),
      );
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const handleFollow = (profileStreamId: string, followStreamId?: string) => {
    if (!isLoggedIn) {
      return showLoginModal();
    }
    if (!followStreamId) {
      createFollowMutation.mutate({
        i: { content: { isFollowing: true, profileID: profileStreamId } },
      });
    } else {
      updateFollowMutation.mutate({
        i: {
          id: followStreamId,
          content: {
            isFollowing: true,
            profileID: profileStreamId,
          },
        },
      });
    }
  };

  const handleUnfollow = (profileStreamId: string, followStreamId?: string) => {
    if (!isLoggedIn) {
      return showLoginModal();
    }
    updateFollowMutation.mutate({
      i: {
        id: followStreamId,
        content: {
          isFollowing: false,
          profileID: profileStreamId,
        },
      },
    });
  };

  return (
    <DuplexButton
      inactiveLabel={t('Follow')}
      activeLabel={t('Following')}
      activeHoverLabel={t('Unfollow')}
      onClickInactive={() => handleFollow(profileStreamId, followStreamId)}
      onClickActive={() => handleUnfollow(profileStreamId, followStreamId)}
      active={!!following}
      size="sm"
      loading={loading}
      allowMinimization
    />
  );
};

export default FollowProfile;
