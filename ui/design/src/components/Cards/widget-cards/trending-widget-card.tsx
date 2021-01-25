import { Box, Text, Tabs } from 'grommet';
import * as React from 'react';
import { SubtitleTextIcon } from '../../TextIcon/index';
import { Icon } from '../../Icon/index';
import { ProfileAvatarButton } from '../../Buttons/index';
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
  // handlers
  onClickTag: (tagName: string) => void;
  onClickProfile: (ethAddress: string) => void;
  onClickSubscribeTag: (tagName: string) => void;
  onClickSubscribeProfile: (ethAddress: string) => void;
  // css
  className?: string;
}

export interface ITag {
  name: string;
  posts: number;
}

export interface IProfile {
  ethAddress: string;
  pubKey?: string;
  avatar?: string;
  coverImage?: string;
  description?: string;
  userName?: string;
  name?: string;
  followers?: number;
}

const TrendingWidgetCard: React.FC<ITrendingWidgetCardProps> = props => {
  const {
    className,
    onClickTag,
    onClickProfile,
    onClickSubscribeTag,
    onClickSubscribeProfile,
    titleLabel,
    tags,
    profiles,
    userSubscribtions,
    topicsLabel,
    profilesLabel,
  } = props;

  return (
    <WidgetAreaCardBox className={className}>
      <Box pad="medium" gap="medium">
        <Text weight="bold">{titleLabel}</Text>
      </Box>
      <Tabs>
        <StyledTab title={topicsLabel}>
          <Box pad="medium" gap="medium">
            {tags.slice(0, 4).map((tag, index) => (
              <Box key={index} direction="row" justify="between" align="center">
                <SubtitleTextIcon
                  onClick={() => onClickTag(tag.name)}
                  label={`#${tag.name}`}
                  subtitle={`Used in ${tag.posts} posts`}
                  labelSize="large"
                  gap="xxsmall"
                />
                <Icon
                  type="subscribe"
                  onClick={() => onClickSubscribeTag(tag.name)}
                  clickable={true}
                  primaryColor={userSubscribtions?.tagNames.includes(tag.name)}
                />
              </Box>
            ))}
          </Box>
        </StyledTab>
        <StyledTab title={profilesLabel}>
          <Box pad="medium" gap="medium">
            {profiles.slice(0, 4).map((profile, index) => (
              <Box key={index} direction="row" justify="between" align="center">
                <ProfileAvatarButton
                  ethAddress={profile.ethAddress}
                  onClick={() => onClickProfile(profile.ethAddress)}
                  label={profile.userName || profile.name}
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
};

export default TrendingWidgetCard;
