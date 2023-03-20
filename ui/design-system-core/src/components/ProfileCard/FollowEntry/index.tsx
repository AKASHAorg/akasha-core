import React, { useEffect } from 'react';
import Avatar, { AvatarSrc } from '../../Avatar';
import Stack from '../../Stack';
import Text from '../../Text';
import DuplexButton from '../../DuplexButton';
import Icon from '../../Icon';
import { useIntersection } from 'react-use';
import { getColorClasses } from '../../../utils/getColorClasses';

export type FollowEntryProps = {
  followLabel: string;
  unFollowLabel: string;
  followingLabel: string;
  profileAnchorLink: string;
  ethAddress: string;
  pubKey: string;
  avatar: AvatarSrc;
  name: string;
  userName: string;
  isFollowing: boolean;
  pubKeyOfLoggedUser?: string;
  hasNextPage?: boolean;
  loadingMoreLabel?: string;
  borderBottom?: boolean;
  onLoadMore?: () => void;
  onProfileClick: (ethAddress: string) => void;
  onFollow: (ethAddress: string) => void;
  onUnfollow: (ethAddress: string) => void;
};

const FollowEntry: React.FC<FollowEntryProps> = props => {
  const {
    followLabel,
    unFollowLabel,
    followingLabel,
    profileAnchorLink,
    ethAddress,
    pubKey,
    avatar,
    name,
    userName,
    isFollowing,
    pubKeyOfLoggedUser,
    hasNextPage,
    loadingMoreLabel,
    borderBottom = true,
    onLoadMore,
    onProfileClick,
    onFollow,
    onUnfollow,
  } = props;

  const loadmoreRef = React.createRef<HTMLDivElement>();

  const intersection = useIntersection(loadmoreRef, { threshold: 0 });

  useEffect(() => {
    if (intersection && intersection.isIntersecting) {
      if (onLoadMore) onLoadMore();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intersection]);

  const borderBottomStyle = borderBottom
    ? `border-b ${getColorClasses({
        light: 'border-grey8',
        dark: 'border-grey5',
      })}`
    : '';

  return (
    <Stack direction="column" spacing={`pb-3 gap-y-2 ${borderBottomStyle}`}>
      <Stack align="center" justify="between">
        {/*@TODO: create anchor component */}
        <a href={`${profileAnchorLink}/${pubKey}`}>
          <Stack align="center" spacing="gap-x-1">
            <Avatar
              ethAddress={ethAddress}
              onClick={() => onProfileClick(pubKey)}
              size="md"
              src={{
                url: avatar?.url,
                fallbackUrl: avatar?.fallbackUrl,
              }}
            />
            <Stack direction="column" justify="center">
              <Text variant="button-md">{name || userName}</Text>
              <Text variant="footnotes2">{`@${userName ? userName : 'username'}`}</Text>
            </Stack>
          </Stack>
        </a>
        {pubKeyOfLoggedUser !== pubKey && (
          <DuplexButton
            inactiveLabel={followLabel}
            activeLabel={followingLabel}
            activeHoverLabel={unFollowLabel}
            onClickInactive={() => onFollow(pubKey)}
            onClickActive={() => onUnfollow(pubKey)}
            active={isFollowing}
            allowMinimization
          />
        )}
      </Stack>
      {hasNextPage && (
        <div>
          <Icon type="ArrowPathIcon" accentColor={true} ref={loadmoreRef} />
          <Text color="accentText">{loadingMoreLabel}</Text>
        </div>
      )}
    </Stack>
  );
};

export default FollowEntry;
