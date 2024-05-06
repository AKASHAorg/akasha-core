import React, { useEffect, useState } from 'react';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Tooltip from '@akashaorg/design-system-core/lib/components/Tooltip';
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
  profileID?: string;
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

  const sendSuccessNotification = (profileName: string, following: boolean) => {
    uiEvents.next({
      event: NotificationEvents.ShowNotification,
      data: {
        type: NotificationTypes.Success,
        message: t('{{message}} {{name}}', {
          message: following ? 'You are now following' : 'You are no longer following',
          name: profileName,
        }),
      },
    });
  };

  const onCompleted = (followId: string, isFollowing: boolean, profileName: string) => {
    setFollowing(isFollowing);
    setFollowDocumentId(followId);
    if (iconOnly) sendSuccessNotification(profileName, isFollowing);
  };

  const [createFollowMutation, { loading: createFollowLoading }] = useCreateFollowMutation({
    context: { source: sdk.services.gql.contextSources.composeDB },
    onCompleted: async ({ setAkashaFollow }) => {
      const document = setAkashaFollow.document;
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

  // this approach is required to have a clickable tooltip, if btn is disabled via prop, tooltip can only be hover based
  const disableActions = !profileID;
  const disabledStyle = disableActions ? 'opacity-50' : '';

  const handleFollow = (profileID: string, followId?: string) => {
    if (disableActions) {
      return;
    }
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
            },
          },
        },
      });
    }
  };

  const handleUnFollow = (profileID: string, followId?: string) => {
    if (disableActions) {
      return;
    }
    if (!isLoggedIn) {
      return showLoginModal();
    }
    updateFollowMutation({
      variables: {
        i: {
          id: followId,
          content: {
            isFollowing: false,
          },
        },
      },
    });
  };

  const FollowButton = () =>
    iconOnly ? (
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
        customStyle={disabledStyle}
      />
    ) : (
      <DuplexButton
        size="sm"
        customStyle={disabledStyle}
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

  return disableActions ? (
    <Tooltip
      placement="bottom"
      content={t('Unfollowable profile due to missing basic information like name and Bio.')}
      trigger="click"
      contentCustomStyle="w-52"
    >
      <FollowButton />
    </Tooltip>
  ) : (
    <FollowButton />
  );
};

export default FollowProfileButton;
