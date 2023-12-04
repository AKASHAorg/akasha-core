import React, { useEffect, useState } from 'react';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import DuplexButton from '@akashaorg/design-system-core/lib/components/DuplexButton';
import getSDK from '@akashaorg/awf-sdk';
import {
  CheckIcon,
  UserPlusIcon,
  XMarkIcon,
} from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import { Following } from '@akashaorg/design-system-core/lib/components/Icon/akasha-icons';
import { ModalNavigationOptions } from '@akashaorg/typings/lib/ui';
import { useTranslation } from 'react-i18next';
import {
  useCreateFollowMutation,
  useUpdateFollowMutation,
} from '@akashaorg/ui-awf-hooks/lib/generated/apollo';

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

  const sdk = getSDK();

  const [createFollowMutation, { loading: createFollowLoading }] = useCreateFollowMutation({
    context: { source: sdk.services.gql.contextSources.composeDB },
    onCompleted: async ({ createAkashaFollow }) => {
      setFollowing(createAkashaFollow.document.isFollowing);
    },
  });

  const [updateFollowMutation, { loading: updateFollowLoading }] = useUpdateFollowMutation({
    context: { source: sdk.services.gql.contextSources.composeDB },
    onCompleted: async ({ updateAkashaFollow }) => {
      setFollowing(updateAkashaFollow.document.isFollowing);
    },
  });

  const loading = createFollowLoading || updateFollowLoading;

  //reset `following` whenever isFollowing prop changes
  useEffect(() => {
    setFollowing(isFollowing);
  }, [isFollowing]);

  const handleFollow = (profileID: string, followId?: string) => {
    if (!isLoggedIn) {
      return showLoginModal();
    }
    if (!followId) {
      createFollowMutation({
        variables: { i: { content: { isFollowing: true, profileID } } },
      });
    } else {
      updateFollowMutation({
        variables: {
          i: {
            id: followId,
            content: {
              isFollowing: true,
              profileID,
            },
          },
        },
      });
    }
  };

  const handleUnfollow = (profileID: string, followId?: string) => {
    if (!isLoggedIn) {
      return showLoginModal();
    }
    updateFollowMutation({
      variables: {
        i: {
          id: followId,
          content: {
            isFollowing: false,
            profileID,
          },
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
      icon={following ? <Following /> : <UserPlusIcon />}
      variant={'primary'}
      loading={loading}
      greyBg={true}
      iconOnly={true}
    />
  ) : (
    <DuplexButton
      size="sm"
      inactiveLabel={t('Follow')}
      activeLabel={t('Following')}
      activeHoverLabel={t('Unfollow')}
      active={following}
      iconDirection="left"
      activeIcon={<CheckIcon />}
      activeHoverIcon={<XMarkIcon />}
      inactiveVariant="secondary"
      loading={loading}
      fixedWidth={'w-[7rem]'}
      hoverColors={{
        background: { light: 'transparent', dark: 'transparent' },
        border: { light: 'errorLight', dark: 'errorDark' },
        text: { light: 'errorLight', dark: 'errorDark' },
        icon: { light: 'errorLight', dark: 'errorDark' },
      }}
      onClickInactive={() => handleFollow(profileID, followId)}
      onClickActive={() => handleUnfollow(profileID, followId)}
    />
  );
};

export default FollowProfileButton;
