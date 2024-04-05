import React from 'react';
import FollowProfileButton from '../follow-profile-button';
import { useGetFollowDocumentsByDidQuery } from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import { hasOwn, useGetLogin } from '@akashaorg/ui-awf-hooks';
import { ModalNavigationOptions } from '@akashaorg/typings/lib/ui';

type FollowButtonProps = {
  profileID?: string;
  showLoginModal: (redirectTo?: { modal: ModalNavigationOptions }) => void;
};

const FollowButton: React.FC<FollowButtonProps> = props => {
  const { profileID, showLoginModal } = props;
  const { data: loginData } = useGetLogin();
  const authenticatedDID = loginData?.id;
  const isLoggedIn = !!loginData?.id;

  const { data, error } = useGetFollowDocumentsByDidQuery({
    fetchPolicy: 'cache-and-network',
    variables: {
      id: authenticatedDID,
      following: [profileID],
      last: 1,
    },
    skip: !isLoggedIn || !profileID,
  });

  if (error) return null;

  const followDocument =
    data?.node && hasOwn(data.node, 'akashaFollowList')
      ? data?.node.akashaFollowList?.edges[0]
      : null;

  return (
    <FollowProfileButton
      profileID={profileID}
      isLoggedIn={isLoggedIn}
      followId={followDocument?.node?.id}
      isFollowing={followDocument?.node?.isFollowing}
      showLoginModal={showLoginModal}
      iconOnly={true}
    />
  );
};

export default FollowButton;
