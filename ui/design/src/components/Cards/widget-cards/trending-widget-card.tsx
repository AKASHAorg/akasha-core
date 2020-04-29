import { Box, Text, Tabs } from 'grommet';
import * as React from 'react';
import { SubtitleTextIcon } from '../../TextIcon/index';
import { Icon } from '../../Icon/index';
import { ProfileAvatarButton, IconLink } from '../../Buttons/index';
import { WidgetAreaCardBox } from '../common/basic-card-box';
import { StyledTab } from './styled-widget-cards';

export interface ITrendingWidgetCardProps {
  // data
  tags: ITag[];
  profiles: IProfile[];
  userSubscribtions?: { profileEthAddresses: string[]; tagNames: string[] };
  // labels
  titleLabel: string;
  topicsLabel: string;
  profilesLabel: string;
  showMoreLabel: string;
  // handlers
  onClickTag: (tagName: string) => void;
  onClickProfile: (ethAddress: string) => void;
  onClickSubscribeTag: (tagName: string) => void;
  onClickSubscribeProfile: (ethAddress: string) => void;
  onClickMoreTags: React.EventHandler<React.SyntheticEvent>;
  onClickMoreProfiles: React.EventHandler<React.SyntheticEvent>;
  // css
  className?: string;
}

export interface ITag {
  tagName: string;
  numberOfPosts: number;
}

export interface IProfile {
  ethAddress: string;
  avatar?: string;
  userName?: string;
  followers?: number;
}

const TrendingWidgetCard: React.FC<ITrendingWidgetCardProps> = props => {
  const {
    className,
    onClickTag,
    onClickProfile,
    onClickSubscribeTag,
    onClickSubscribeProfile,
    onClickMoreTags,
    onClickMoreProfiles,
    titleLabel,
    tags,
    profiles,
    userSubscribtions,
    topicsLabel,
    profilesLabel,
    showMoreLabel,
  } = props;

  return (
    <WidgetAreaCardBox className={className}>
      <Box pad="medium" gap="medium">
        <Text weight="bold">{titleLabel}</Text>
      </Box>
      <Tabs>
        <StyledTab title={topicsLabel}>
          <Box pad="medium" gap="medium">
            {tags.map((tag, index) => (
              <Box key={index} direction="row" justify="between" align="center">
                <SubtitleTextIcon
                  onClick={() => onClickTag(tag.tagName)}
                  label={tag.tagName}
                  subtitle={`Used in ${tag.numberOfPosts} posts`}
                  labelSize="large"
                  iconType={'app'}
                  iconSize={'2.5rem'}
                  gap="xxsmall"
                />
                <Icon
                  type="subscribe"
                  onClick={() => onClickSubscribeTag(tag.tagName)}
                  clickable={true}
                  primaryColor={userSubscribtions?.tagNames.includes(tag.tagName)}
                />
              </Box>
            ))}
            <Box align="center">
              <IconLink label={showMoreLabel} onClick={onClickMoreTags} size="medium" />
            </Box>
          </Box>
        </StyledTab>
        <StyledTab title={profilesLabel}>
          <Box pad="medium" gap="medium">
            {profiles.map((profile, index) => (
              <Box key={index} direction="row" justify="between" align="center">
                <ProfileAvatarButton
                  ethAddress={profile.ethAddress}
                  onClick={() => onClickProfile(profile.ethAddress)}
                  label={profile.userName}
                  info={`${profile.followers} followers`}
                  size="md"
                  avatarImage={profile.avatar}
                />
                <Icon
                  type="following"
                  onClick={() => onClickSubscribeProfile(profile.ethAddress)}
                  clickable={true}
                  primaryColor={userSubscribtions?.profileEthAddresses.includes(profile.ethAddress)}
                />
              </Box>
            ))}
            <Box align="center">
              <IconLink label={showMoreLabel} onClick={onClickMoreProfiles} size="medium" />
            </Box>
          </Box>
        </StyledTab>
      </Tabs>
    </WidgetAreaCardBox>
  );
};

TrendingWidgetCard.defaultProps = {
  titleLabel: 'Trending Right Now',
  topicsLabel: 'Topics',
  profilesLabel: 'Profiles',
  showMoreLabel: 'Show more',
};

export default TrendingWidgetCard;
