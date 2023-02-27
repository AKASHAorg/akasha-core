import { apply, tw } from '@twind/core';
import React from 'react';
import Card from '../../Card';
import Stack from '../../Stack';
import Avatar, { AvatarSrc } from '../../Avatar';
import Text from '../../Text';
import Icon from '../../Icon';
import Divider from '../../Divider';
import TextLine from '../../TextLine';
import CopyToClipboard from '../../CopyToClipboard';
import Button from '../../Button';

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
  handleFollow: (event: React.SyntheticEvent<Element, Event>) => void;
  handleUnfollow: (event: React.SyntheticEvent<Element, Event>) => void;
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
  handleUnfollow,
  handleFollow,
}) => {
  const iconContainerStyle = tw(apply`h-8 w-8 rounded-full bg-grey9 dark:grey3`);
  const iconStyle = tw(apply`h-4 [&>*]:stroke-secondary-light dark:[&>*]:stroke-secondary-dark`);
  const avatarContainer = tw(apply`relative w-20 h-[3.5rem] shrink-0`);

  return (
    <div>
      <Card
        elevation="1"
        radius={{ top: 20 }}
        background={{ light: 'bg-grey6', dark: 'bg-grey5' }}
        style={
          coverImage ? `background-image: url(${coverImage.url || coverImage.fallbackUrl})` : ''
        }
        className="h-32"
      ></Card>
      <Card elevation="1" radius={{ bottom: 20 }} padding="px-[0.5rem] pb-[1rem] pt-0">
        <Stack direction="column" className={tw(apply('pl-2'))}>
          <Stack spacing="gap-x-2 -ml-2">
            <div className={avatarContainer}>
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
                {`@${userName}`}
              </Text>
            </Stack>
            <div className="ml-auto mt-2">
              {viewerIsOwner ? (
                <button>
                  <Stack align="center" justify="center" className={iconContainerStyle}>
                    {/*@TODO customize AppIcon and use it here */}
                    <Icon type="Cog6ToothIcon" styling={iconStyle} />
                  </Stack>
                </button>
              ) : (
                <Stack spacing="gap-x-2">
                  <button>
                    <Stack align="center" justify="center" className={iconContainerStyle}>
                      {/*@TODO customize AppIcon and use it here */}
                      <Icon type="EnvelopeIcon" styling={iconStyle} />
                    </Stack>
                  </button>
                  {isFollowing ? (
                    <Button
                      size="small"
                      icon="UserPlusIcon"
                      onClick={handleUnfollow}
                      iconOnly
                      primary
                    />
                  ) : (
                    <button onClick={handleFollow}>
                      <Stack align="center" justify="center" className={iconContainerStyle}>
                        {/*@TODO customize AppIcon and use it here */}
                        <Icon type="UsersIcon" styling={iconStyle} />
                      </Stack>
                    </button>
                  )}
                  <button>
                    <Stack align="center" justify="center" className={iconContainerStyle}>
                      {/*@TODO customize AppIcon and use it here */}
                      <Icon type="EllipsisVerticalIcon" styling={iconStyle} />
                    </Stack>
                  </button>
                </Stack>
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
