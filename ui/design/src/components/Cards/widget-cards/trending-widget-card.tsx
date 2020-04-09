import { Box, Text, Tabs } from 'grommet';
import * as React from 'react';
import { SubtitleTextIcon } from '../../TextIcon/index';
import { Icon } from '../../Icon/index';
import { ProfileAvatarButton, IconLink } from '../../Buttons/index';
import { WidgetAreaCardBox } from '../common/basic-card-box';
import { StyledTab } from './styled-widget-cards';

export interface ITrendingWidgetCardProps {
  className?: string;
  titleLabel: string;
  tags: ITag[];
  profiles: IProfile[];
  topicsLabel: string;
  profilesLabel: string;
  showMoreLabel: string;
  onClickTag: (tagName: string) => void;
  onClickProfile: (ethAddress: string) => void;
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
    titleLabel,
    tags,
    profiles,
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
                <Icon type="subscribe" onClick={() => onClickTag(tag.tagName)} clickable={true} />
              </Box>
            ))}
            <Box align="center">
              <IconLink label={showMoreLabel} />
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
                  onClick={() => onClickProfile(profile.ethAddress)}
                  clickable={true}
                />
              </Box>
            ))}
            <Box align="center">
              <IconLink label={showMoreLabel} />
            </Box>
          </Box>
        </StyledTab>
      </Tabs>
    </WidgetAreaCardBox>
  );
};

export default TrendingWidgetCard;
