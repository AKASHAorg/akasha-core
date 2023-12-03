import React from 'react';
import FollowProfileButton from '../follow-profile-button';
import getSDK from '@akashaorg/awf-sdk';
import { useGetFollowDocumentsSuspenseQuery } from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import { useLoggedIn } from '@akashaorg/ui-awf-hooks';
import { ModalNavigationOptions } from '@akashaorg/typings/lib/ui';

type FollowButtonProps = {
  profileID: string;
  showLoginModal: (redirectTo?: { modal: ModalNavigationOptions }) => void;
};

const FollowButton: React.FC<FollowButtonProps> = props => {
  const { profileID, showLoginModal } = props;
  const { isLoggedIn } = useLoggedIn();
  const sdk = getSDK();
  const { data, error } = useGetFollowDocumentsSuspenseQuery({
    context: { source: sdk.services.gql.contextSources.composeDB },
    variables: {
      following: [profileID],
      last: 1,
    },
  });

  if (error) return null;

  const followDocument = data.viewer?.akashaFollowList?.edges[0];

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
