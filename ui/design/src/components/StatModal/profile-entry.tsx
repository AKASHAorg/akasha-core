import React from 'react';
import { Box, Text } from 'grommet';

import Icon from '../Icon';
import DuplexButton from '../DuplexButton';
import ProfileAvatarButton from '../ProfileAvatarButton';
import { StyledAnchor } from '../EntryCard/basic-card-box';
import useIntersectionObserver from '../../utils/intersection-observer';

export interface IProfileEntry {
  ipfsGateway?: string;

  // hides follow button it matches with entry's pubKey
  loggedUser?: string;

  followedProfiles?: string[];

  followLabel: string;
  unfollowLabel: string;
  followingLabel: string;

  // anchor link
  profileAnchorLink: string;

  // handles load more on scroll
  pages?: any[];
  status?: 'loading' | 'success' | 'error' | 'idle';
  hasNextPage?: boolean;
  loadingMoreLabel?: string;
  onLoadMore?: () => void;

  // handlers
  onClickProfile: (ethAddress: string) => void;
  handleFollowProfile: (ethAddress: string) => void;
  handleUnfollowProfile: (ethAddress: string) => void;
}

const ProfileEntry: React.FC<IProfileEntry> = props => {
  const {
    ipfsGateway,
    loggedUser,
    followedProfiles,
    followLabel,
    unfollowLabel,
    followingLabel,
    profileAnchorLink,
    pages,
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
    <Box flex={false} pad={{ top: 'large' }}>
      {pages.map((page, index) => (
        <Box key={index} flex={false} gap="medium">
          {page.results.map((entry, index) => (
            <Box key={index} direction="row" justify="between" align="center">
              <StyledAnchor
                onClick={e => {
                  e.preventDefault();
                  return false;
                }}
                weight="normal"
                href={`${profileAnchorLink}/${entry.pubKey}`}
                label={
                  <Box width="15rem" pad="none">
                    <ProfileAvatarButton
                      ethAddress={entry.ethAddress}
                      onClick={() => onClickProfile(entry.pubKey)}
                      label={entry.name || entry.userName}
                      info={`@${entry.userName ? entry.userName : 'username'}`}
                      size="md"
                      avatarImage={entry.avatar ? `${ipfsGateway}/${entry.avatar}` : entry.avatar}
                    />
                  </Box>
                }
              />
              {loggedUser !== entry.pubKey && (
                <Box width="7rem">
                  <DuplexButton
                    inactiveLabel={followLabel}
                    activeLabel={followingLabel}
                    activeHoverLabel={unfollowLabel}
                    onClickInactive={() => handleFollowProfile(entry.ethAddress)}
                    onClickActive={() => handleUnfollowProfile(entry.ethAddress)}
                    active={followedProfiles?.includes(entry.ethAddress)}
                    icon={<Icon type="following" />}
                  />
                </Box>
              )}
            </Box>
          ))}
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
