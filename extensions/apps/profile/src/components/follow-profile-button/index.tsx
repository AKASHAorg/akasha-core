import React from 'react';
import Tooltip from '@akashaorg/design-system-core/lib/components/Tooltip';
import { IModalNavigationOptions } from '@akashaorg/typings/lib/ui';
import { useTranslation } from 'react-i18next';
import { useGetFollowDocumentsByDidQuery } from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import { hasOwn, useAkashaStore } from '@akashaorg/ui-awf-hooks';
import { FollowButton } from './follow-button';

export type FollowProfileButtonProps = {
  profileID?: string;
  iconOnly?: boolean;
  showLoginModal: (redirectTo?: { modal: IModalNavigationOptions }) => void;
};

const FollowProfileButton: React.FC<FollowProfileButtonProps> = props => {
  const { profileID, iconOnly, showLoginModal } = props;
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
      showLoginModal={showLoginModal}
    />
  );
};

export default FollowProfileButton;
