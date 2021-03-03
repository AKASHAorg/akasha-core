import { Box, Text, Tabs } from 'grommet';
import * as React from 'react';
import { SubtitleTextIcon } from '../../TextIcon/index';
import { Icon } from '../../Icon/index';
import { ProfileAvatarButton } from '../../Buttons/index';
import { WidgetAreaCardBox } from '../common/basic-card-box';
import { StyledTab } from './styled-widget-cards';
import { DuplexButton } from '../../Buttons';

export interface ITrendingWidgetCardProps {
  // data
  tags: ITag[];
  profiles: IProfile[];
  followedProfiles?: string[];
  subscribedTags?: string[];
  loggedEthAddress?: string | null;
  // labels
  titleLabel: string;
  topicsLabel: string;
  profilesLabel: string;
  followLabel?: string;
  followingLabel?: string;
  followersLabel?: string;
  unfollowLabel?: string;
  subscribeLabel?: string;
  unsubscribeLabel?: string;
  subscribedLabel?: string;
  // handlers
  onClickTag: (tagName: string) => void;
  onClickProfile: (ethAddress: string) => void;
  handleFollowProfile: (ethAddress: string) => void;
  handleUnfollowProfile: (ethAddress: string) => void;
  handleSubscribeTag: (tagName: string) => void;
  handleUnsubscribeTag: (tagName: string) => void;
  // css
  className?: string;
}

export interface ITag {
  name: string;
  totalPosts: number;
}

export interface IProfile {
  ethAddress: string;
  pubKey: string;
  avatar?: string;
  coverImage?: string;
  description?: string;
  userName?: string;
  name?: string;
  totalFollowers?: number | string;
  totalFollowing?: number | string;
}

const TrendingWidgetCard: React.FC<ITrendingWidgetCardProps> = props => {
  const {
    className,
    onClickTag,
    onClickProfile,
    handleFollowProfile,
    handleUnfollowProfile,
    handleSubscribeTag,
    handleUnsubscribeTag,
    loggedEthAddress,
    titleLabel,
    tags,
    profiles,
    topicsLabel,
    profilesLabel,
    followLabel,
    followingLabel,
    unfollowLabel,
    followersLabel,
    subscribeLabel,
    subscribedLabel,
    unsubscribeLabel,
    followedProfiles,
    subscribedTags,
  } = props;

  return (
    <WidgetAreaCardBox className={className}>
      <Box pad="medium" gap="medium">
        <Text weight="bold" size="large">
          {titleLabel}
        </Text>
      </Box>
      <Tabs>
        <StyledTab title={topicsLabel}>
          <Box pad="medium" gap="medium">
            {tags.slice(0, 4).map((tag, index) => (
              <Box key={index} direction="row" justify="between" align="center">
                <SubtitleTextIcon
                  onClick={() => onClickTag(tag.name)}
                  label={`#${tag.name}`}
                  subtitle={`Used in ${tag.totalPosts} posts`}
                  labelSize="large"
                  gap="xxsmall"
                />
                {loggedEthAddress && (
                  <Box width="7rem">
                    <DuplexButton
                      inactiveLabel={subscribeLabel}
                      activeLabel={subscribedLabel}
                      activeHoverLabel={unsubscribeLabel}
                      onClickInactive={() => handleSubscribeTag(tag.name)}
                      onClickActive={() => handleUnsubscribeTag(tag.name)}
                      active={subscribedTags?.includes(tag.name)}
                      icon={<Icon type="subscribe" />}
                    />
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        </StyledTab>
        <StyledTab title={profilesLabel}>
          <Box pad="medium" gap="medium">
            {profiles.slice(0, 4).map((profile, index) => (
              <Box key={index} direction="row" justify="between" align="center">
                <Box width="11rem" pad="none">
                  <ProfileAvatarButton
                    ethAddress={profile.ethAddress}
                    onClick={() => onClickProfile(profile.pubKey)}
                    label={profile.userName || profile.name}
                    info={`${profile.totalFollowers} ${followersLabel}`}
                    size="md"
                    avatarImage={profile.avatar}
                  />
                </Box>
                {loggedEthAddress && profile.ethAddress !== loggedEthAddress && (
                  <Box width="7rem">
                    <DuplexButton
                      inactiveLabel={followLabel}
                      activeLabel={followingLabel}
                      activeHoverLabel={unfollowLabel}
                      onClickInactive={() => handleFollowProfile(profile.ethAddress)}
                      onClickActive={() => handleUnfollowProfile(profile.ethAddress)}
                      active={followedProfiles?.includes(profile.ethAddress)}
                      icon={<Icon type="following" />}
                    />
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        </StyledTab>
      </Tabs>
    </WidgetAreaCardBox>
  );
};

TrendingWidgetCard.defaultProps = {
  titleLabel: 'Trending Right Now',
  topicsLabel: 'Topics',
  profilesLabel: 'People',
  followLabel: 'Follow',
  unfollowLabel: 'Unfollow',
  followersLabel: 'Followers',
  followingLabel: 'Following',
  subscribedLabel: 'Subscribed',
  subscribeLabel: 'Subscribe',
  unsubscribeLabel: 'Unsubscribe',
};

export default TrendingWidgetCard;
