import React from 'react';
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
  IModalNavigationOptions,
  NotificationEvents,
  NotificationTypes,
} from '@akashaorg/typings/lib/ui';
import { useTranslation } from 'react-i18next';
import {
  useCreateFollowMutation,
  useGetFollowDocumentsByDidQuery,
  useUpdateFollowMutation,
} from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import { hasOwn, useAkashaStore, useRootComponentProps } from '@akashaorg/ui-awf-hooks';

export type FollowProfileButtonProps = {
  profileID?: string;
  iconOnly?: boolean;
  showLoginModal: (redirectTo?: { modal: IModalNavigationOptions }) => void;
};

const FollowProfileButton: React.FC<FollowProfileButtonProps> = props => {
  const { profileID, iconOnly, showLoginModal } = props;
  const { t } = useTranslation('app-profile');
  const { uiEvents } = useRootComponentProps();
  const {
    data: { authenticatedDID },
  } = useAkashaStore();
  const isLoggedIn = !!authenticatedDID;
  const { data, error } = useGetFollowDocumentsByDidQuery({
    fetchPolicy: 'cache-and-network',
    variables: {
      id: authenticatedDID,
      following: [profileID],
      last: 1,
    },
    skip: !isLoggedIn || !profileID,
  });
  const sdk = getSDK();
  const followDocument =
    data?.node && hasOwn(data.node, 'akashaFollowList')
      ? data?.node.akashaFollowList?.edges[0]
      : null;

  const followDocumentId = followDocument?.node?.id;
  const isFollowing = followDocument?.node?.isFollowing;

  const sendSuccessNotification = (profileName: string, following: boolean) => {
    uiEvents.next({
      event: NotificationEvents.ShowNotification,
      data: {
        type: NotificationTypes.Success,
        title: t('{{message}} {{name}}', {
          message: following ? 'You are now following' : 'You are no longer following',
          name: profileName,
        }),
      },
    });
  };

  const [createFollowMutation, { loading: createFollowLoading }] = useCreateFollowMutation({
    context: { source: sdk.services.gql.contextSources.composeDB },
    onCompleted: async ({ setAkashaFollow }) => {
      const document = setAkashaFollow.document;
      if (iconOnly) sendSuccessNotification(document.profile?.name, isFollowing);
    },
  });

  const [updateFollowMutation, { loading: updateFollowLoading }] = useUpdateFollowMutation({
    context: { source: sdk.services.gql.contextSources.composeDB },
    onCompleted: async ({ updateAkashaFollow }) => {
      const document = updateAkashaFollow.document;
      if (iconOnly) sendSuccessNotification(document.profile?.name, isFollowing);
    },
  });

  const loading = createFollowLoading || updateFollowLoading;

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

  if (error) return null;

  const FollowButton = () =>
    iconOnly ? (
      <Button
        aria-label="follow"
        onClick={
          isFollowing
            ? () => handleUnFollow(profileID, followDocumentId)
            : () => handleFollow(profileID, followDocumentId)
        }
        icon={isFollowing ? <Following role="img" aria-label="following" /> : <UserPlusIcon />}
        variant={'primary'}
        loading={loading}
        greyBg={true}
        iconOnly={true}
        customStyle={disabledStyle}
      />
    ) : (
      <DuplexButton
        inactiveLabel={t('Follow')}
        activeLabel={t('Following')}
        activeHoverLabel={t('Unfollow')}
        active={isFollowing}
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
        customStyle={disabledStyle}
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
