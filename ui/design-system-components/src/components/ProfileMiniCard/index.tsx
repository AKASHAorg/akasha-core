import * as React from 'react';
import { tw } from '@twind/core';
import Avatar from '@akashaorg/design-system-core/lib/components/Avatar';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import DuplexButton from '@akashaorg/design-system-core/lib/components/DuplexButton';
import { truncateMiddle } from '../../utils/string-utils';
import { Profile } from '@akashaorg/typings/ui';

export interface IProfileMiniCard {
  // data
  profileData: Profile;
  isViewer?: boolean;
  loggedEthAddress?: string | null;
  isFollowing?: boolean;
  // labels
  followLabel?: string;
  followingLabel?: string;
  followersLabel?: string;
  unfollowLabel?: string;
  postsLabel?: string;
  // handlers
  handleClick?: (arg1?: string) => void;
  handleFollow?: (profileEthAddress: string) => void;
  handleUnfollow?: (profileEthAddress: string) => void;
  disableFollowing?: boolean;
  footerExt?: React.ReactNode;
}

const ProfileMiniCard: React.FC<IProfileMiniCard> = props => {
  const {
    profileData,
    followLabel,
    followingLabel,
    followersLabel,
    unfollowLabel,
    postsLabel,
    isViewer,
    handleClick,
    handleFollow,
    handleUnfollow,
    isFollowing,
    disableFollowing,
    footerExt,
  } = props;

  const onFollow = (ev: React.SyntheticEvent) => {
    if (handleFollow) {
      handleFollow(profileData.id);
    }
    ev.stopPropagation();
  };

  const onUnfollow = (ev: React.SyntheticEvent) => {
    if (handleUnfollow) {
      handleUnfollow(profileData.id);
    }
    ev.stopPropagation();
  };

  const onClick = () => {
    if (handleClick) {
      handleClick(profileData.id);
    }
  };

  return (
    <Card elevation={{ light: '1', dark: '1' }} radius={'rounded-2xl'}>
      <div onClick={onClick}>
        <div
          style={{ backgroundImage: `url(${profileData.background})` }}
          className={tw(`flex items-center justify-center w-full h-28 rounded-t-2xl`)}
        >
          <div className={tw(`relative top-4`)}>
            <Avatar
              size="xl"
              border="sm"
              borderColor="darkerBlue"
              avatar={profileData.avatar}
              profileId={profileData.did.id}
            />
          </div>
        </div>
        <div className={tw(`flex flex-col items-center justify-items-center px-1`)}>
          <div className={tw(`pb-4 mt-4 items-center`)}>
            {profileData.name && (
              <Text variant="h6" breakWord={true} align="center">
                {profileData.name}
              </Text>
            )}
            <Text variant="subtitle2" breakWord={true} align="center">
              {/* {(profileData.userName && `@${profileData.userName}`) || */}
              {truncateMiddle(profileData.did.id)}
            </Text>
          </div>
          <div className={tw(`flex flex-row gap-2`)}>
            {/*<Text variant="subtitle2">{`${profileData.did.id || 0} ${postsLabel}`}</Text>*/}
            <Text variant="subtitle2">{`${profileData.did || 0} ${followersLabel}`}</Text>
            {/* <Text variant="subtitle2">{`${
              profileData.totalFollowing || 0
            } ${followingLabel}`}</Text> */}
          </div>
        </div>

        <div className={tw(`flex flex-col p-4 gap-4`)}>
          <Text breakWord={true} truncate={true}>
            {profileData.description}
          </Text>

          {!disableFollowing && isViewer && (
            <DuplexButton
              inactiveLabel={followLabel}
              activeLabel={followingLabel}
              activeHoverLabel={unfollowLabel}
              onClickInactive={onFollow}
              onClickActive={onUnfollow}
              active={isFollowing}
            />
          )}
          {footerExt}
        </div>
      </div>
    </Card>
  );
};

ProfileMiniCard.defaultProps = {
  followLabel: 'Follow',
  followingLabel: 'Following',
  followersLabel: 'Followers',
  unfollowLabel: 'Unfollow',
  postsLabel: 'Posts',
};

export default ProfileMiniCard;
