import * as React from 'react';
import { Box, Text } from 'grommet';
import { BasicCardBox } from '../EntryCard/basic-card-box';
import { IProfileData } from '@akashaorg/ui-awf-typings/lib/profile';
import { TagButton } from './TagButton';
import ProfileAvatarButton from '../ProfileAvatarButton';
import DuplexButton from '../DuplexButton';
import Icon from '../Icon';
import { ITag } from '@akashaorg/ui-awf-typings/lib/entry';

export interface OnboardingSuggestionsCardProps {
  topicsLabel?: string;
  peopleLabel?: string;
  followLabel?: string;
  unfollowLabel?: string;
  followingLabel?: string;
  loggedEthAddress?: string;
  tags?: ITag[];
  profiles?: IProfileData[];
  subscribedTags?: string[];
  followedProfiles?: string[];
  onClickTag?: (tagName: string) => void;
  onClickProfile?: (pubKey: string) => void;
  onClickFollow?: (pubKey: string) => void;
  onClickUnfollow?: (pubKey: string) => void;
}

export const OnboardingSuggestionsCard: React.FC<OnboardingSuggestionsCardProps> = props => {
  const {
    topicsLabel,
    peopleLabel,
    followLabel,
    unfollowLabel,
    followingLabel,
    loggedEthAddress,
    tags,
    profiles,
    subscribedTags,
    followedProfiles,
    onClickTag,
    onClickProfile,
    onClickFollow,
    onClickUnfollow,
  } = props;

  return (
    <BasicCardBox>
      <Box pad="medium" gap="medium">
        <Box gap="medium">
          <Text weight={'bold'} size="xlarge">
            {topicsLabel}
          </Text>
          <Box gap="small" direction="row" wrap={true}>
            {tags?.map((tag, index) => (
              <Box key={index} pad={{ bottom: 'small' }}>
                <TagButton
                  tagName={tag.name}
                  onClickTag={() => onClickTag(tag.name)}
                  isSubscribed={subscribedTags.includes(tag.name)}
                />
              </Box>
            ))}
          </Box>
        </Box>
        <Box gap="medium">
          <Text weight={'bold'} size="xlarge">
            {peopleLabel}
          </Text>
          <Box gap="small"></Box>
          {profiles?.map((profile, index) => (
            <Box direction="row" justify="between" align="center" key={index}>
              <ProfileAvatarButton
                ethAddress={profile.ethAddress}
                onClick={() => onClickProfile(profile.pubKey)}
                label={profile.name}
                info={profile.userName && `@${profile.userName}`}
                size="md"
                avatarImage={profile.avatar}
              />
              {profile.ethAddress !== loggedEthAddress && (
                <Box>
                  <DuplexButton
                    inactiveLabel={followLabel}
                    activeLabel={followingLabel}
                    activeHoverLabel={unfollowLabel}
                    onClickInactive={() => onClickFollow(profile.pubKey)}
                    onClickActive={() => onClickUnfollow(profile.pubKey)}
                    active={followedProfiles?.includes(profile.pubKey)}
                    icon={<Icon type="following" />}
                    allowMinimization
                  />
                </Box>
              )}
            </Box>
          ))}
        </Box>
      </Box>
    </BasicCardBox>
  );
};
