import React from 'react';
import { Box, Text } from 'grommet';

import Icon from '../Icon';
import DuplexButton from '../DuplexButton';
import ProfileAvatarButton from '../ProfileAvatarButton';
import { StyledAnchor } from '../EntryCard/basic-card-box';
import useIntersectionObserver from '../../utils/intersection-observer';
import { Profile } from '@akashaorg/typings/sdk/graphql-types-new';

export interface IProfileEntry {
  followedProfiles?: string[];
  followLabel: string;
  unfollowLabel: string;
  followingLabel: string;

  // anchor link
  profileAnchorLink: string;

  // handles load more on scroll
  profiles?: Profile[];
  status?: 'loading' | 'success' | 'error' | 'idle';
  hasNextPage?: boolean;
  loadingMoreLabel?: string;
  onLoadMore?: () => void;

  // handlers
  onClickProfile: (profileId: string) => void;
  handleFollowProfile: (profileId: string) => void;
  handleUnfollowProfile: (profileId: string) => void;
}

const ProfileEntry: React.FC<IProfileEntry> = props => {
  const {
    followedProfiles,
    followLabel,
    unfollowLabel,
    followingLabel,
    profileAnchorLink,
    profiles,
    status,
    hasNextPage,
    loadingMoreLabel,
    onLoadMore,
    onClickProfile,
    handleFollowProfile,
    handleUnfollowProfile,
  } = props;

  const loadmoreRef = React.createRef<HTMLDivElement>();

  useIntersectionObserver({
    target: loadmoreRef,
    onIntersect: onLoadMore,
    threshold: 0,
  });

  return (
    <Box flex={false} pad={{ top: 'large' }} gap="medium">
      {profiles.map((profile, index) => (
        <Box key={index} direction="row" justify="between" align="center">
          <StyledAnchor
            onClick={e => {
              e.preventDefault();
              return false;
            }}
            weight="normal"
            href={`${profileAnchorLink}/${profile.did.id}`}
            reducedWidth={true}
            label={
              <Box width="100%" pad="none">
                <ProfileAvatarButton
                  profileId={profile.did.id}
                  onClick={() => onClickProfile(profile.did.id)}
                  label={profile.name || profile.did.id}
                  // info={`@${entry.userName ? entry.userName : 'username'}`}
                  size="md"
                  avatarImage={profile.avatar}
                />
              </Box>
            }
          />
          {!profile.did.isViewer && (
            <Box>
              <DuplexButton
                inactiveLabel={followLabel}
                activeLabel={followingLabel}
                activeHoverLabel={unfollowLabel}
                onClickInactive={() => handleFollowProfile(profile.did.id)}
                onClickActive={() => handleUnfollowProfile(profile.did.id)}
                active={followedProfiles?.includes(profile.did.id)}
                icon={<Icon type="following" />}
                allowMinimization
              />
            </Box>
          )}
        </Box>
      ))}

      {/* loading state indicator for fetch on scroll */}
      {(status === 'loading' || hasNextPage) && (
        <Box pad="large" align="center">
          <Icon type="loading" accentColor={true} clickable={false} ref={loadmoreRef} />
          <Text color="accentText">{loadingMoreLabel}</Text>
        </Box>
      )}
    </Box>
  );
};

export default ProfileEntry;
