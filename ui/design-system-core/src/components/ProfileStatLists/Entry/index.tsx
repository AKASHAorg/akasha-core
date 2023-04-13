import React, { useEffect } from 'react';
import Avatar from '../../Avatar';
import Stack from '../../Stack';
import Text from '../../Text';
import DuplexButton from '../../DuplexButton';
import { useIntersection } from 'react-use';
import { getColorClasses } from '../../../utils/getColorClasses';
import Button from '../../Button';
import { ImageSrc } from '../../types/common.types';

export type ListEntryProps = {
  followLabel: string;
  unFollowLabel: string;
  followingLabel: string;
  profileAnchorLink: string;
  ethAddress: string;
  pubKey: string;
  avatar: ImageSrc;
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

const ListEntry: React.FC<ListEntryProps> = props => {
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
    ? `border-b ${getColorClasses(
        {
          light: 'grey8',
          dark: 'grey5',
        },
        'border',
      )}`
    : '';

  if (pubKeyOfLoggedUser === pubKey) return null;

  return (
    <Stack direction="column" spacing="gap-y-4" customStyle={`px-4 pb-4 ${borderBottomStyle}`}>
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

        <DuplexButton
          inactiveLabel={followLabel}
          activeLabel={followingLabel}
          activeHoverLabel={unFollowLabel}
          onClickInactive={() => onFollow(pubKey)}
          onClickActive={() => onUnfollow(pubKey)}
          active={isFollowing}
          size="sm"
          allowMinimization
        />
      </Stack>
      {hasNextPage && (
        <Stack justify="center" ref={loadmoreRef}>
          <Button
            icon="ArrowPathIcon"
            iconDirection="left"
            label={loadingMoreLabel}
            variant="text"
          />
        </Stack>
      )}
    </Stack>
  );
};

export default ListEntry;
