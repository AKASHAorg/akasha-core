import React from 'react';
import Tooltip from '@akashaorg/design-system-core/lib/components/Tooltip';
import { useTranslation } from 'react-i18next';
import { useGetFollowDocumentsByDidQuery } from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import { hasOwn, useAkashaStore } from '@akashaorg/ui-awf-hooks';
import { FollowButton, FollowButtonProps } from './follow-button';

export type FollowProfileButtonProps = Omit<
  FollowButtonProps,
  'followDocumentId' | 'isFollowing' | 'isLoggedIn'
>;

const FollowProfileButton: React.FC<FollowProfileButtonProps> = props => {
  const { profileID, iconOnly, customizeButton, showLoginModal } = props;
  const { t } = useTranslation('app-profile');
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
  const followDocument =
    data?.node && hasOwn(data.node, 'akashaFollowList')
      ? data?.node.akashaFollowList?.edges[0]
      : null;
  const followDocumentId = followDocument?.node?.id;
  const isFollowing = !!followDocument?.node?.isFollowing;
  const disableActions = !profileID;

  // if already following and variant is specified as primary, convert to secondary
  const _customizeButton = {
    ...customizeButton,
    variant:
      isFollowing && customizeButton?.variant === 'primary'
        ? 'secondary'
        : customizeButton?.variant,
  };

  if (error) return null;

  return disableActions ? (
    <Tooltip
      placement="bottom"
      content={t('Unfollowable profile due to missing basic information like name and Bio.')}
      trigger="click"
      contentCustomStyle="w-52"
    >
      <FollowButton
        profileID={profileID}
        followDocumentId={followDocumentId}
        iconOnly={iconOnly}
        isFollowing={isFollowing}
        isLoggedIn={isLoggedIn}
        customizeButton={_customizeButton}
        showLoginModal={showLoginModal}
      />
    </Tooltip>
  ) : (
    <FollowButton
      profileID={profileID}
      followDocumentId={followDocumentId}
      iconOnly={iconOnly}
      isFollowing={isFollowing}
      isLoggedIn={isLoggedIn}
      customizeButton={_customizeButton}
      showLoginModal={showLoginModal}
    />
  );
};

export default FollowProfileButton;
