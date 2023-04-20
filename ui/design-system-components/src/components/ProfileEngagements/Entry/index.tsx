import React, { useEffect } from 'react';
import Avatar from '@akashaorg/design-system-core/lib/components/Avatar';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import DuplexButton from '@akashaorg/design-system-core/lib/components/DuplexButton';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Anchor from '@akashaorg/design-system-core/lib/components/Anchor';
import { useIntersection } from 'react-use';
import { getColorClasses } from '@akashaorg/design-system-core/lib/utils/getColorClasses';
import { ImageSrc } from '@akashaorg/design-system-core/lib/components/types/common.types';

export type EntryProps = {
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

const Entry: React.FC<EntryProps> = props => {
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
        <Anchor href={`${profileAnchorLink}/${pubKey}`}>
          <Stack align="center" spacing="gap-x-1">
            <Avatar
              ethAddress={ethAddress}
              onClick={() => onProfileClick(pubKey)}
              size="md"
              src={{
                url: avatar?.url,
                fallbackUrl: avatar?.fallbackUrl,
              }}
              customStyle="cursor-pointer"
            />
            <Stack direction="column" justify="center">
              <Text variant="button-md">{name || userName}</Text>
              <Text variant="footnotes2">{`@${userName ? userName : 'username'}`}</Text>
            </Stack>
          </Stack>
        </Anchor>

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

export default Entry;
