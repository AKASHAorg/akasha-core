import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { RootComponentProps, IAkashaError } from '@akashaproject/ui-awf-typings';
import { useRouteMatch } from 'react-router-dom';
import DS from '@akashaproject/design-system';
import { useGetEntryAuthor } from '@akashaproject/ui-awf-hooks/lib/use-profile.new';
import {
  useIsFollowing,
  useFollow,
  useUnfollow,
} from '@akashaproject/ui-awf-hooks/lib/use-follow.new';
import { useGetLogin } from '@akashaproject/ui-awf-hooks/lib/use-login.new';

const { Box, ProfileMiniCard } = DS;

const ProfileCardWidget: React.FC<RootComponentProps> = props => {
  const { params } = useRouteMatch<{ postId: string }>();
  const { t } = useTranslation();

  const loginQuery = useGetLogin({
    onError: (errorInfo: IAkashaError) => {
      props.logger.error(`${JSON.stringify(errorInfo)}, ${errorInfo.errorKey}`);
    },
  });

  const profileDataReq = useGetEntryAuthor(params.postId);
  const profileData = profileDataReq.data;

  const isFollowingReq = useIsFollowing(loginQuery.data.ethAddress, profileData.ethAddress);
  const followedProfiles = isFollowingReq.data;
  const followReq = useFollow();
  const unfollowReq = useUnfollow();

  // React.useEffect(() => {
  //   if (loginState.ethAddress && profileState.ethAddress) {
  //     followActions.isFollowing(loginState.ethAddress, profileState.ethAddress);
  //   }
  // }, [loginState.ethAddress, profileState.ethAddress]);

  const handleFollow = () => {
    if (profileData?.ethAddress) {
      followReq.mutate(profileData.ethAddress);
    }
  };

  const handleUnfollow = () => {
    if (profileData?.ethAddress) {
      unfollowReq.mutate(profileData.ethAddress);
    }
  };

  const isFollowing = React.useMemo(() => {
    if (followedProfiles.includes(profileData?.ethAddress)) {
      return true;
    }
    return false;
  }, [followedProfiles, profileData.ethAddress]);

  if (!profileData?.ethAddress) {
    return null;
  }

  return (
    <Box pad={{ bottom: 'medium' }}>
      <ProfileMiniCard
        handleFollow={handleFollow}
        handleUnfollow={handleUnfollow}
        isFollowing={isFollowing}
        loggedEthAddress={loginQuery.data.ethAddress}
        profileData={profileData}
        followLabel={t('Follow')}
        unfollowLabel={t('Unfollow')}
        followingLabel={t('Following')}
        followersLabel={t('Followers')}
        postsLabel={t('Posts')}
      />
    </Box>
  );
};

export default ProfileCardWidget;
