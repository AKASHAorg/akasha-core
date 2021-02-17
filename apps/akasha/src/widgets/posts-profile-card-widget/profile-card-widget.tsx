import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { RootComponentProps, IAkashaError } from '@akashaproject/ui-awf-typings';
import { useRouteMatch } from 'react-router-dom';
import DS from '@akashaproject/design-system';
import { useProfile, useFollow, useLoginState } from '@akashaproject/ui-awf-hooks';

const { Box, ProfileMiniCard } = DS;

const ProfileCardWidget: React.FC<RootComponentProps> = props => {
  const { sdkModules, logger, globalChannel } = props;

  const { params } = useRouteMatch<{ postId: string }>();
  const { t } = useTranslation();

  const [profileState, profileActions] = useProfile({
    onError: err => {
      if (props.logger) {
        props.logger.error('profile-card-widget error %j %j', err);
      }
    },
    ipfsService: props.sdkModules.commons.ipfsService,
    profileService: props.sdkModules.profiles.profileService,
    postsService: props.sdkModules.posts,
  });

  const [loginState] = useLoginState({
    globalChannel: props.globalChannel,
    authService: props.sdkModules.auth.authService,
    profileService: props.sdkModules.profiles.profileService,
    ipfsService: props.sdkModules.commons.ipfsService,
    onError: (errorInfo: IAkashaError) => {
      logger.error(errorInfo.error.message, errorInfo.errorKey);
    },
  });
  const [followedProfiles, followActions] = useFollow({
    globalChannel,
    profileService: sdkModules.profiles.profileService,
    onError: (errorInfo: IAkashaError) => {
      logger.error(errorInfo.error.message, errorInfo.errorKey);
    },
  });

  React.useEffect(() => {
    if (params.postId) {
      profileActions.getEntryAuthor({ entryId: params.postId });
    }
  }, [params.postId]);

  React.useEffect(() => {
    if (loginState.ethAddress && profileState.ethAddress) {
      followActions.isFollowing(loginState.ethAddress, profileState.ethAddress);
    }
  }, [loginState.ethAddress, profileState.ethAddress]);

  const handleFollow = () => {
    if (profileState?.ethAddress) {
      followActions.follow(profileState.ethAddress);
    }
  };

  const handleUnfollow = () => {
    if (profileState?.ethAddress) {
      followActions.unfollow(profileState.ethAddress);
    }
  };

  if (!profileState?.ethAddress) {
    return null;
  }

  return (
    <Box pad={{ bottom: 'medium' }}>
      <ProfileMiniCard
        handleFollow={handleFollow}
        handleUnfollow={handleUnfollow}
        isFollowing={followedProfiles.includes(profileState?.ethAddress)}
        loggedEthAddress={loginState.ethAddress}
        profileData={profileState as any}
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
