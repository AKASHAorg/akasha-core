import React, { useEffect, useState } from 'react';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import DuplexButton from '@akashaorg/design-system-core/lib/components/DuplexButton';
import { ModalNavigationOptions } from '@akashaorg/typings/ui';
import { useTranslation } from 'react-i18next';
import {
  useCreateFollowMutation,
  useUpdateFollowMutation,
} from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';

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

  const createFollowMutation = useCreateFollowMutation({
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: ({ createAkashaFollow }) => {
      setFollowing(createAkashaFollow.document.isFollowing);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const updateFollowMutation = useUpdateFollowMutation({
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: ({ updateAkashaFollow }) => {
      setFollowing(updateAkashaFollow.document.isFollowing);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  //reset `following` whenever isFollowing prop changes
  useEffect(() => {
    setFollowing(isFollowing);
  }, [isFollowing]);

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
        i: { content: { isFollowing: true, profileID: profileID } },
      });
    } else {
      updateFollowMutation.mutate({
        i: {
          id: followId,
          content: {
            isFollowing: true,
            profileID: profileID,
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
          profileID: profileID,
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
    <DuplexButton
      inactiveLabel={t('Follow')}
      activeLabel={t('Following')}
      activeHoverLabel={t('Unfollow')}
      onClickInactive={() => handleFollow(profileID, followId)}
      onClickActive={() => handleUnfollow(profileID, followId)}
      active={following}
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
