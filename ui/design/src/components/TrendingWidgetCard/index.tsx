import { Box, Text, Tabs } from 'grommet';
import * as React from 'react';
import SubtitleTextIcon from '../SubtitleTextIcon';
import Icon from '../Icon';
import ProfileAvatarButton from '../ProfileAvatarButton';
import { WidgetAreaCardBox, StyledAnchor } from '../EntryCard/basic-card-box';
import { StyledTab } from '../AppInfoWidgetCard/styled-widget-cards';
import DuplexButton from '../DuplexButton';
import { TextLine } from '../VirtualList/placeholders/entry-card-placeholder';
import { ITag } from '@akashaorg/ui-awf-typings/lib/entry';
import { IProfileData } from '@akashaorg/ui-awf-typings/lib/profile';

export interface ITrendingWidgetCardProps {
  // data
  tags: ITag[];
  profiles: IProfileData[];
  followedProfiles?: string[];
  subscribedTags?: string[];
  loggedEthAddress?: string | null;
  isLoadingTags?: boolean;
  isLoadingProfiles?: boolean;
  // labels
  noTagsLabel?: string;
  noProfilesLabel?: string;
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
  // anchor link
  tagAnchorLink: string;
  profileAnchorLink: string;
  // handlers
  onClickTag: (tagName: string) => void;
  onClickProfile: (ethAddress: string) => void;
  handleFollowProfile: (ethAddress: string) => void;
  handleUnfollowProfile: (ethAddress: string) => void;
  handleSubscribeTag: (tagName: string) => void;
  handleUnsubscribeTag: (tagName: string) => void;
  // css
  className?: string;

  // zero-based index of the current tab
  onActiveTabChange?: (tabIdx: number) => void;
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
    isLoadingTags,
    isLoadingProfiles,
    noTagsLabel,
    noProfilesLabel,
    topicsLabel,
    profilesLabel,
    followLabel,
    followingLabel,
    unfollowLabel,
    followersLabel,
    subscribeLabel,
    subscribedLabel,
    unsubscribeLabel,
    tagAnchorLink,
    profileAnchorLink,
    followedProfiles,
    subscribedTags,
  } = props;

  const handleTabChange = (tabIdx: number) => {
    if (props.onActiveTabChange) {
      props.onActiveTabChange(tabIdx);
    }
  };

  return (
    <WidgetAreaCardBox className={className}>
      <Box pad="medium" gap="medium">
        <Text weight="bold" size="large">
          {titleLabel}
        </Text>
      </Box>
      <Tabs onActive={handleTabChange}>
        <StyledTab title={topicsLabel}>
          <Box pad="medium" gap="medium">
            {tags.length === 0 && !isLoadingTags && (
              <Box pad="medium" align="center" justify="center">
                <Text>{noTagsLabel}</Text>
              </Box>
            )}
            {tags.length === 0 &&
              isLoadingTags &&
              Array.from({ length: 4 }, (_el, index: number) => (
                <Box key={index} direction="row" justify="between" align="center">
                  <Box gap="xxsmall">
                    <TextLine title="tagName" animated={false} width="140px" />
                    <TextLine title="tagName" animated={false} width="80px" />
                  </Box>
                  <TextLine title="tagName" animated={false} width="7rem" height="2rem" />
                </Box>
              ))}
            {tags.length !== 0 &&
              tags.slice(0, 4).map((tag, index) => (
                <Box key={index} direction="row" justify="between">
                  <StyledAnchor
                    onClick={e => {
                      e.preventDefault();
                      return false;
                    }}
                    weight="normal"
                    href={`${tagAnchorLink}/${tag.name}`}
                    label={
                      <Box width="100%" pad="none" align="start">
                        <SubtitleTextIcon
                          onClick={() => onClickTag(tag.name)}
                          label={`#${tag.name}`}
                          subtitle={`Used in ${tag.totalPosts} posts`}
                          labelSize="large"
                          gap="xxsmall"
                          maxWidth="10rem"
                        />
                      </Box>
                    }
                  />
                  <Box>
                    <DuplexButton
                      inactiveLabel={subscribeLabel}
                      activeLabel={subscribedLabel}
                      activeHoverLabel={unsubscribeLabel}
                      onClickInactive={() => handleSubscribeTag(tag.name)}
                      onClickActive={() => handleUnsubscribeTag(tag.name)}
                      active={subscribedTags?.includes(tag.name)}
                      icon={<Icon type="subscribe" />}
                      allowMinimization
                    />
                  </Box>
                </Box>
              ))}
          </Box>
        </StyledTab>
        <StyledTab title={profilesLabel}>
          <Box pad="medium" gap="medium">
            {profiles.length === 0 && !isLoadingProfiles && (
              <Box pad="medium" align="center" justify="center">
                <Text>{noProfilesLabel}</Text>
              </Box>
            )}
            {profiles.length === 0 &&
              isLoadingProfiles &&
              Array.from({ length: 4 }, (_el, index: number) => (
                <Box key={index} direction="row" justify="between" align="center">
                  <Box direction="row" gap="xsmall">
                    <TextLine title="avatar" width="40px" height="40px" round={{ size: '50%' }} />
                    <Box gap="xxsmall">
                      <TextLine title="tagName" animated={false} width="140px" />
                      <TextLine title="tagName" animated={false} width="80px" />
                    </Box>
                  </Box>
                  <TextLine title="tagName" animated={false} width="7rem" height="2rem" />
                </Box>
              ))}
            {profiles.length !== 0 &&
              profiles.slice(0, 4).map((profile, index) => (
                <Box key={index} direction="row" justify="between" align="center">
                  <StyledAnchor
                    onClick={e => {
                      e.preventDefault();
                      return false;
                    }}
                    weight="normal"
                    href={`${profileAnchorLink}/${profile.pubKey}`}
                    label={
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
                    }
                  />
                  {profile.ethAddress !== loggedEthAddress && (
                    <Box>
                      <DuplexButton
                        inactiveLabel={followLabel}
                        activeLabel={followingLabel}
                        activeHoverLabel={unfollowLabel}
                        onClickInactive={() => handleFollowProfile(profile.pubKey)}
                        onClickActive={() => handleUnfollowProfile(profile.pubKey)}
                        active={followedProfiles?.includes(profile.pubKey)}
                        icon={<Icon type="following" />}
                        allowMinimization
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
  noTagsLabel: 'No tags found!',
  noProfilesLabel: 'No profiles found!',
};

export default TrendingWidgetCard;
