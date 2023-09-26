import React, { useEffect, useState } from 'react';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import TrendingWidgetButton from '@akashaorg/design-system-components/lib/components/TrendingWidgetButton';
import { ModalNavigationOptions } from '@akashaorg/typings/lib/ui';
import { useTranslation } from 'react-i18next';
import {
  useCreateFollowMutation,
  useGetFollowDocumentsQuery,
  useUpdateFollowMutation,
  useInfiniteGetFollowersListByDidQuery,
  useInfiniteGetFollowingListByDidQuery,
} from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';
import { useQueryClient } from '@tanstack/react-query';

export type FollowProfileButtonProps = {
  profileID: string;
  isLoggedIn: boolean;
  isFollowing: boolean;
  followId: string | null;
  iconOnly?: boolean;
  showLoginModal: (redirectTo?: { modal: ModalNavigationOptions }) => void;
};

const FollowProfileButton: React.FC<FollowProfileButtonProps> = props => {
  const { profileID, isLoggedIn, isFollowing, followId, iconOnly, showLoginModal } = props;

  const { t } = useTranslation('app-profile');
  const [following, setFollowing] = useState(isFollowing);
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  const createFollowMutation = useCreateFollowMutation({
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: async ({ createAkashaFollow }) => {
      setFollowing(createAkashaFollow.document.isFollowing);
      await queryClient.invalidateQueries(useGetFollowDocumentsQuery.getKey());
      if (createAkashaFollow.document.isFollowing) {
        await Promise.all([
          queryClient.invalidateQueries(
            useInfiniteGetFollowersListByDidQuery.getKey({
              id: createAkashaFollow.document.did.id,
            }),
          ),
          queryClient.invalidateQueries(
            useInfiniteGetFollowingListByDidQuery.getKey({
              id: createAkashaFollow.document.did.id,
            }),
          ),
        ]);
      }
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const updateFollowMutation = useUpdateFollowMutation({
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: async ({ updateAkashaFollow }) => {
      setFollowing(updateAkashaFollow.document.isFollowing);
      await queryClient.invalidateQueries(useGetFollowDocumentsQuery.getKey());
      if (updateAkashaFollow.document.isFollowing) {
        await Promise.all([
          queryClient.invalidateQueries(
            useInfiniteGetFollowersListByDidQuery.getKey({
              id: updateAkashaFollow.document.did.id,
            }),
          ),
          queryClient.invalidateQueries(
            useInfiniteGetFollowingListByDidQuery.getKey({
              id: updateAkashaFollow.document.did.id,
            }),
          ),
        ]);
      }
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  //reset `following` whenever isFollowing prop changes
  useEffect(() => {
    setFollowing(isFollowing);
  }, [isFollowing]);

  //reset `following` whenever user is logged out
  useEffect(() => {
    if (!isLoggedIn) setFollowing(false);
  }, [isLoggedIn]);

  //reset loading flag whenever profile id changes
  useEffect(() => {
    setLoading(false);
  }, [profileID]);

  const handleFollow = (profileID: string, followId?: string) => {
    if (!isLoggedIn) {
      return showLoginModal();
    }
    if (!followId) {
      createFollowMutation.mutate({
        i: { content: { isFollowing: true, profileID } },
      });
    } else {
      updateFollowMutation.mutate({
        i: {
          id: followId,
          content: {
            isFollowing: true,
            profileID,
          },
        },
      });
    }
  };

  const handleUnfollow = (profileID: string, followId?: string) => {
    if (!isLoggedIn) {
      return showLoginModal();
    }
    updateFollowMutation.mutate({
      i: {
        id: followId,
        content: {
          isFollowing: false,
          profileID,
        },
      },
    });
  };

  return iconOnly ? (
    <Button
      onClick={
        following
          ? () => handleUnfollow(profileID, followId)
          : () => handleFollow(profileID, followId)
      }
      icon={following ? 'UsersIcon' : 'UserPlusIcon'}
      variant={following ? 'secondary' : 'primary'}
      loading={loading}
      greyBg={following}
      iconOnly={true}
    />
  ) : (
    <TrendingWidgetButton
      inactiveLabel={t('Follow')}
      activeLabel={t('Following')}
      activeHoverLabel={t('Unfollow')}
      active={following}
      activeIcon="CheckIcon"
      activeHoverIcon="XMarkIcon"
      onClickActive={() => handleUnfollow(profileID, followId)}
      onClickInactive={() => handleFollow(profileID, followId)}
      loading={loading}
    />
  );
};

export default FollowProfileButton;
