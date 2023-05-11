import { Box, Text } from 'grommet';
import { MarginType } from 'grommet/utils';
import * as React from 'react';
import styled from 'styled-components';
import TextIcon from '../TextIcon';
import { IconType } from '../Icon';
import { MainAreaCardBox } from '../EntryCard/basic-card-box';
import { Profile } from '@akashaorg/typings/sdk/graphql-types-new';

export type ProfileStatsProps = {
  className?: string;
  statsTitleLabel?: string;
  profileData: Profile;
  postsLabel: string;
  followersLabel: string;
  followingLabel: string;
  interestsLabel?: string;
  onClickPosts?: React.EventHandler<React.SyntheticEvent>;
  onClickFollowers?: React.EventHandler<React.SyntheticEvent>;
  onClickFollowing?: React.EventHandler<React.SyntheticEvent>;
  onClickInterests?: React.EventHandler<React.SyntheticEvent>;
  margin?: MarginType;
};

interface IStat {
  iconType: IconType;
  count: string;
  label: string;
  clickHandler: (event: React.SyntheticEvent<Element, Event>) => void;
  dataTestId: string;
}

const ProfileStatsCard: React.FC<ProfileStatsProps> = props => {
  const { profileData, className, margin } = props;
  const statsInfo = React.useRef({
    posts: {
      label: props.postsLabel,
      clickHandler: props.onClickPosts,
    },
    followers: {
      label: props.followersLabel,
      clickHandler: props.onClickFollowers,
    },
    following: {
      label: props.followingLabel,
      clickHandler: props.onClickFollowing,
    },
    interests: {
      label: props.interestsLabel,
      clickHandler: props.onClickInterests,
    },
  });
  const stats: IStat[] = React.useMemo(
    () => [
      {
        iconType: 'quote',
        count: '0', //`${profileData.totalPosts || 0}`,
        dataTestId: 'posts-button',
        ...statsInfo.current.posts,
      },
      {
        iconType: 'follower',
        count: '0', // `${profileData.totalFollowers || 0}`,
        dataTestId: 'followers-button',
        ...statsInfo.current.followers,
      },
      {
        iconType: 'following',
        count: '0', //`${profileData.totalFollowing || 0}`,
        dataTestId: 'following-button',
        ...statsInfo.current.following,
      },
      {
        iconType: 'hashtagGray',
        count: '0', //`${profileData.totalInterests || 0}`,
        dataTestId: 'interests-button',
        ...statsInfo.current.interests,
      },
    ],
    [profileData],
  );
  return (
    <MainAreaCardBox className={className} pad="medium" margin={margin}>
      <Box>
        <Text size="large" weight="bold" color="primaryText" style={{ lineHeight: 1.7 }}>
          {props.statsTitleLabel}
        </Text>
      </Box>
      <Box direction="row" justify="between">
        {stats.map((stat, idx) => (
          <StatIconWrapper
            key={stat.label + idx}
            /* isMobile={isMobileOnly} */
            onClick={stat.clickHandler}
            align="center"
          >
            <StyledTextIcon
              iconType={stat.iconType}
              iconBackground={true}
              iconSize="md"
              datatestid={stat.dataTestId}
              clickable={true}
              spacing="0"
            />
            <Text>{stat.label}</Text>
            <Text weight="bold">{stat.count}</Text>
          </StatIconWrapper>
        ))}
      </Box>
    </MainAreaCardBox>
  );
};

const StatIconWrapper = styled(Box)<{ isMobile?: boolean }>`
  color: ${props => props.theme.colors.secondaryText};

  &:hover {
    color: ${props => props.theme.colors.accent};
  }
`;

const StyledTextIcon = styled(TextIcon)`
  ${StatIconWrapper}:hover & {
    color: ${props => props.theme.colors.accent};

    svg {
      stroke: ${props => props.theme.colors.accent};
    }

    svg * {
      stroke: ${props => props.theme.colors.accent};
    }
  }
`;
export default ProfileStatsCard;
