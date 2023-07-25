import React, { useState } from 'react';
import DuplexButton from '@akashaorg/design-system-core/lib/components/DuplexButton';
import { NavigateToParams } from '@akashaorg/typings/ui';
import { useTranslation } from 'react-i18next';
import {
  useCreateFollowMutation,
  useInfiniteGetFollowersListByDidQuery,
  useInfiniteGetFollowingListByDidQuery,
  useUpdateFollowMutation,
} from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';
import { useQueryClient } from '@tanstack/react-query';

export type FollowProfileProps = {
  loggedInProfileId: string;
  profileStreamId: string;
  isLoggedIn: boolean;
  isFollowing: boolean;
  followStreamId: string | null;
  navigateTo: (args: NavigateToParams) => void | null;
};

const FollowProfile: React.FC<FollowProfileProps> = props => {
  const {
    loggedInProfileId,
    profileStreamId,
    isLoggedIn,
    isFollowing,
    followStreamId,
    navigateTo,
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
      await queryClient.invalidateQueries(
        useInfiniteGetFollowingListByDidQuery.getKey({ id: loggedInProfileId }),
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
      await queryClient.invalidateQueries(
        useInfiniteGetFollowingListByDidQuery.getKey({ id: loggedInProfileId }),
      );
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const checkAuth = () => {
    if (!isLoggedIn && navigateTo) {
      navigateTo({
        appName: '@akashaorg/app-auth-ewa',
        getNavigationUrl: navRoutes => navRoutes.CONNECT,
      });
      return false;
    }
    return true;
  };

  const handleFollow = (profileStreamId: string, followStreamId?: string) => {
    if (!checkAuth()) return;
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
    if (!checkAuth()) return;
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
