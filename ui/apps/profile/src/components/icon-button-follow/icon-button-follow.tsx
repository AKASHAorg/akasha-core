import React, { useState } from 'react';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import { useGetLogin } from '@akashaorg/ui-awf-hooks';
import { ModalNavigationOptions } from '@akashaorg/typings/ui';
import { useFollowingsOfLoggedInProfile } from './use-followings-of-logged-in-profile';
import {
  useCreateFollowMutation,
  useUpdateFollowMutation,
} from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';
import { Follow } from './type';

export type IconButtonFollowProps = {
  profileId: string;
  showLoginModal: (redirectTo?: { modal: ModalNavigationOptions }) => void;
  profileStreamId: string;
};

/* TODO: Some of the logic inside this component is a work around until we have a hook that fetches the isFollowing flag and stream id of a profile being viewed.
 **      The component will be refactored once the hook is ready.
 */
const IconButtonFollow: React.FC<IconButtonFollowProps> = props => {
  const { profileId, profileStreamId, showLoginModal } = props;

  const loginQuery = useGetLogin();

  const isLoggedIn = React.useMemo(() => {
    return !!loginQuery.data?.id;
  }, [loginQuery.data]);

  const [loading, setLoading] = useState(false);

  const { followProfile, unFollowProfile, getFollowing } = useFollowingsOfLoggedInProfile(
    loginQuery.data?.id,
  );

  const following = getFollowing(loginQuery.data?.id, String(profileId));

  const createFollowMutation = useCreateFollowMutation({
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: ({ createAkashaFollow }) => {
      followProfile(loginQuery.data?.id, String(profileId), createAkashaFollow.document.id);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const updateFollowMutation = useUpdateFollowMutation({
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: () => {
      if (!following) return null;

      if (following.isFollowing) {
        unFollowProfile(loginQuery.data?.id, String(profileId));
        return;
      }

      followProfile(loginQuery.data?.id, String(profileId), following.streamId);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const handleFollow = (profileStreamId: string, following?: Follow) => {
    if (!isLoggedIn) {
      return showLoginModal();
    }
    if (!following) {
      createFollowMutation.mutate({
        i: { content: { isFollowing: true, profileID: profileStreamId } },
      });
    } else {
      updateFollowMutation.mutate({
        i: {
          id: following.streamId,
          content: { isFollowing: true, profileID: profileStreamId },
        },
      });
    }
  };

  const handleUnfollow = (profileStreamId: string, following?: Follow) => {
    if (!following) return null;
    if (!isLoggedIn) {
      return showLoginModal();
    }
    updateFollowMutation.mutate({
      i: {
        id: following.streamId,
        content: { isFollowing: false, profileID: profileStreamId },
      },
    });
  };

  return (
    <>
      {following?.isFollowing ? (
        <Button
          icon="UsersIcon"
          onClick={() => handleUnfollow(profileStreamId, following)}
          loading={loading}
          greyBg
          iconOnly
        />
      ) : (
        <Button
          onClick={() => handleFollow(profileStreamId, following)}
          icon="UserPlusIcon"
          variant="primary"
          loading={loading}
          iconOnly
        />
      )}
    </>
  );
};

export default IconButtonFollow;
