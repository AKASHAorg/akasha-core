import React, { useState } from 'react';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import DuplexButton from '@akashaorg/design-system-core/lib/components/DuplexButton';
import { ModalNavigationOptions } from '@akashaorg/typings/ui';
import { useTranslation } from 'react-i18next';
import {
  useCreateFollowMutation,
  useInfiniteGetFollowersListByDidQuery,
  useGetFollowDocumentsQuery,
  useUpdateFollowMutation,
} from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';
import { useQueryClient } from '@tanstack/react-query';

export type FollowProfileButtonProps = {
  loggedInProfileId: string;
  profileStreamId: string;
  isLoggedIn: boolean;
  isFollowing: boolean;
  followStreamId: string | null;
  iconOnly?: boolean;
  showLoginModal: (redirectTo?: { modal: ModalNavigationOptions }) => void;
};

const FollowProfileButton: React.FC<FollowProfileButtonProps> = props => {
  const {
    loggedInProfileId,
    profileStreamId,
    isLoggedIn,
    isFollowing,
    followStreamId,
    iconOnly,
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
    onSuccess: async ({ createAkashaFollow }) => {
      setFollowing(createAkashaFollow.document.isFollowing);
      await queryClient.invalidateQueries(
        useInfiniteGetFollowersListByDidQuery.getKey({ id: loggedInProfileId }),
      );
      await queryClient.invalidateQueries(
        useGetFollowDocumentsQuery.getKey({ following: [profileStreamId], last: 1 }),
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
    onSuccess: async ({ updateAkashaFollow }) => {
      setFollowing(updateAkashaFollow.document.isFollowing);
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

  return iconOnly ? (
    <Button
      onClick={
        following
          ? () => handleUnfollow(profileStreamId, followStreamId)
          : () => handleFollow(profileStreamId, followStreamId)
      }
      icon={following ? 'UsersIcon' : 'UserPlusIcon'}
      variant={following ? 'secondary' : 'primary'}
      loading={loading}
      greyBg={following}
      iconOnly={true}
    />
  ) : (
    <DuplexButton
      inactiveLabel={t('Follow')}
      activeLabel={t('Following')}
      activeHoverLabel={t('Unfollow')}
      onClickInactive={() => handleFollow(profileStreamId, followStreamId)}
      onClickActive={() => handleUnfollow(profileStreamId, followStreamId)}
      active={!!following}
      size="sm"
      loading={loading}
      hoverColor={{
        background: { light: 'errorLight/20', dark: 'errorDark/20' },
        border: { light: 'errorLight', dark: 'errorDark' },
        text: { light: 'errorLight', dark: 'errorDark' },
      }}
    />
  );
};

export default FollowProfileButton;
