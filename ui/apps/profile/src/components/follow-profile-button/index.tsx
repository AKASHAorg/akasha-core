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
import {
  ModalNavigationOptions,
  NotificationEvents,
  NotificationTypes,
} from '@akashaorg/typings/lib/ui';
import { useTranslation } from 'react-i18next';
import {
  useCreateFollowMutation,
  useUpdateFollowMutation,
} from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import { useRootComponentProps } from '@akashaorg/ui-awf-hooks';

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
  const { uiEvents } = useRootComponentProps();
  const [following, setFollowing] = useState(isFollowing);
  const [followDocumentId, setFollowDocumentId] = useState(followId);

  const sdk = getSDK();

  const sendSuccessNotification = (profileName: string) => {
    uiEvents.next({
      event: NotificationEvents.ShowNotification,
      data: {
        type: NotificationTypes.Success,
        message: t('You are now following {{name}}', {
          name: profileName,
        }),
      },
    });
  };

  const onCompleted = (followId: string, isFollowing: boolean, profileName: string) => {
    setFollowing(isFollowing);
    setFollowDocumentId(followId);
    if (iconOnly && isFollowing) sendSuccessNotification(profileName);
  };

  const [createFollowMutation, { loading: createFollowLoading }] = useCreateFollowMutation({
    context: { source: sdk.services.gql.contextSources.composeDB },
    onCompleted: async ({ createAkashaFollow }) => {
      const document = createAkashaFollow.document;
      onCompleted(document.id, document.isFollowing, document.profile?.name);
    },
  });

  const [updateFollowMutation, { loading: updateFollowLoading }] = useUpdateFollowMutation({
    context: { source: sdk.services.gql.contextSources.composeDB },
    onCompleted: async ({ updateAkashaFollow }) => {
      const document = updateAkashaFollow.document;
      onCompleted(document.id, document.isFollowing, document.profile?.name);
    },
  });

  const loading = createFollowLoading || updateFollowLoading;

  //reset `following` whenever isFollowing prop changes
  useEffect(() => {
    setFollowing(isFollowing);
  }, [isFollowing]);

  //reset `followDocumentId` whenever followId prop changes
  useEffect(() => {
    setFollowDocumentId(followId);
  }, [followId]);

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

  const handleUnFollow = (profileID: string, followId?: string) => {
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
          ? () => handleUnFollow(profileID, followDocumentId)
          : () => handleFollow(profileID, followDocumentId)
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
      onClickInactive={() => handleFollow(profileID, followDocumentId)}
      onClickActive={() => handleUnFollow(profileID, followDocumentId)}
    />
  );
};

export default FollowProfileButton;
