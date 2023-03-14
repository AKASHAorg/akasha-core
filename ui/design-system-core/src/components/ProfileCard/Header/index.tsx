import { tw } from '@twind/core';
import React, { useState } from 'react';
import Card from '../../Card';
import Stack from '../../Stack';
import Avatar, { AvatarSrc } from '../../Avatar';
import Text from '../../Text';
import Icon from '../../Icon';
import Divider from '../../Divider';
import TextLine from '../../TextLine';
import CopyToClipboard from '../../CopyToClipboard';
import Button from '../../Button';
import AppIcon from '../../AppIcon';
import { useCloseActions } from '../../../utils/useCloseActions';

export type CoverImage = { url?: string; fallbackUrl?: string };

export type HeaderProps = {
  ethAddress: string;
  coverImage: CoverImage;
  avatar: AvatarSrc;
  name: string;
  userName: string;
  ensName: 'loading' | string;
  isFollowing: boolean;
  viewerIsOwner: boolean;
  flagLabel: string;
  handleFollow: (event: React.SyntheticEvent<Element, Event>) => void;
  handleUnfollow: (event: React.SyntheticEvent<Element, Event>) => void;
  handleFlag: (event: React.SyntheticEvent<Element, Event>) => void;
  actionButtonExt?: React.ReactNode;
};

const Header: React.FC<HeaderProps> = ({
  ethAddress,
  coverImage,
  avatar,
  name,
  userName,
  ensName,
  isFollowing,
  viewerIsOwner,
  flagLabel,
  handleUnfollow,
  handleFollow,
  handleFlag,
}) => {
  const avatarContainer = `relative w-20 h-[3.5rem] shrink-0`;
  const flagIconStyle = `h-4`;
  const [showMore, setShowMore] = useState(false);
  const showMoreRef = useCloseActions(() => {
    setShowMore(false);
  });
  const onShowMore = () => {
    setShowMore(!showMore);
  };

  return (
    <div>
      <Card
        elevation="1"
        radius={{ top: 20 }}
        background={{ light: 'bg-grey6', dark: 'bg-grey5' }}
        customStyle={`h-32 ${
          coverImage ? `background-image: url(${coverImage.url || coverImage.fallbackUrl})` : ''
        }`}
      ></Card>
      <Card elevation="1" radius={{ bottom: 20 }} padding="px-[0.5rem] pb-[1rem] pt-0">
        <Stack direction="column" customStyle="pl-2" fullWidth>
          <Stack spacing="gap-x-2 -ml-2">
            <div className={tw(avatarContainer)}>
              <Avatar
                ethAddress={ethAddress}
                size="xl"
                src={avatar}
                className="absolute -top-6 rounded-full border-2 border-white dark:border-grey2"
              />
            </div>
            <Stack direction="column">
              <Text variant="button-lg">{name}</Text>
              <Text variant="body2" color={{ light: 'text-grey5', dark: 'text-grey7' }}>
                {`@${userName.replace('@', '')}`}
              </Text>
            </Stack>
            <div className={tw(`ml-auto mt-2`)}>
              {viewerIsOwner ? (
                <button>
                  <AppIcon placeholderIconType="Cog6ToothIcon" size="md" accentColor />
                </button>
              ) : (
                <div className="relative">
                  <Stack spacing="gap-x-2">
                    <button>
                      <AppIcon placeholderIconType="EnvelopeIcon" size="md" accentColor />
                    </button>
                    {isFollowing ? (
                      <>
                        <Button
                          size="small"
                          icon="UserPlusIcon"
                          onClick={handleUnfollow}
                          variant="primary"
                          iconOnly
                        />
                      </>
                    ) : (
                      <button onClick={handleFollow}>
                        <AppIcon placeholderIconType="UsersIcon" size="md" accentColor />
                      </button>
                    )}
                    <button onClick={onShowMore} ref={showMoreRef}>
                      <AppIcon
                        placeholderIconType="EllipsisVerticalIcon"
                        size="md"
                        active={showMore}
                        accentColor
                        hover
                      />
                    </button>
                  </Stack>
                  {showMore && (
                    <Card
                      elevation={{ light: '1', dark: '2' }}
                      padding={{ x: 18, y: 8 }}
                      radius={8}
                      customStyle="absolute top-[36px] right-0 bg-white dark:bg-grey3"
                    >
                      <button onClick={handleFlag}>
                        <Stack align="center" spacing="gap-x-1">
                          <Icon
                            type="FlagIcon"
                            styling={flagIconStyle}
                            color={{ light: 'error-light', dark: 'error-dark' }}
                          />
                          <Text
                            variant="body1"
                            color={{ light: 'text-error-light', dark: 'text-error-dark' }}
                          >
                            {flagLabel}
                          </Text>
                        </Stack>
                      </button>
                    </Card>
                  )}
                </div>
              )}
            </div>
          </Stack>
          <Stack direction="column" spacing="gap-y-4">
            <Stack direction="column" spacing="gap-y-1.5">
              <Text variant="label">Ethereum Address</Text>
              <CopyToClipboard value={ethAddress}>
                <Text
                  variant="footnotes2"
                  color={{ light: 'text-secondary-light', dark: 'text-secondary-dark' }}
                >
                  {ethAddress}
                </Text>
              </CopyToClipboard>
            </Stack>
            {ensName === 'loading' ? (
              <>
                <TextLine width="w-24" animated />
                <TextLine width="w-72" animated />
              </>
            ) : (
              ensName && (
                <>
                  <Divider />
                  <Stack direction="column" spacing="gap-y-1.5">
                    <Text variant="label">ENS Name</Text>
                    <CopyToClipboard value={ensName}>
                      <Text
                        variant="body2"
                        color={{ light: 'text-secondary-light', dark: 'text-secondary-dark' }}
                      >
                        {ensName}
                      </Text>
                    </CopyToClipboard>
                  </Stack>
                </>
              )
            )}
          </Stack>
        </Stack>
      </Card>
    </div>
  );
};

export default Header;
