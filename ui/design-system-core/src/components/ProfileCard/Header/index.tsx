import { tw } from '@twind/core';
import React, { useState } from 'react';
import Card from '../../Card';
import Stack from '../../Stack';
import Avatar from '../../Avatar';
import Text from '../../Text';
import Icon from '../../Icon';
import Divider from '../../Divider';
import TextLine from '../../TextLine';
import CopyToClipboard from '../../CopyToClipboard';
import Button from '../../Button';
import { useCloseActions } from '../../../utils/useCloseActions';
import { ImageSrc } from '../../types/common.types';

export type HeaderProps = {
  ethAddress: string;
  coverImage: ImageSrc;
  avatar: ImageSrc;
  name: string;
  userName: string;
  ensName: 'loading' | string;
  isFollowing: boolean;
  viewerIsOwner: boolean;
  flagLabel: string;
  handleEdit: (event: React.SyntheticEvent<Element, Event>) => void;
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
  handleEdit,
  handleUnfollow,
  handleFollow,
  handleFlag,
}) => {
  const [showMore, setShowMore] = useState(false);
  const showMoreRef = useCloseActions(() => {
    setShowMore(false);
  });
  const avatarContainer = `relative w-20 h-[3.5rem] shrink-0`;
  const onShowMore = () => {
    setShowMore(!showMore);
  };

  return (
    <div>
      <Card
        elevation="1"
        radius={{ top: 20 }}
        background={{ light: 'grey7', dark: 'grey5' }}
        customStyle={`h-32 ${
          coverImage ? `bg-center bg-[url(${coverImage?.url || coverImage?.fallbackUrl})]` : ''
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
                customStyle="absolute -top-6 border-2 border-white dark:border-grey2"
              />
            </div>
            <Stack direction="column">
              <Text variant="button-lg">{name}</Text>
              <Text variant="body2" color={{ light: 'grey5', dark: 'grey7' }}>
                {`@${userName.replace('@', '')}`}
              </Text>
            </Stack>
            <div className={tw(`ml-auto mt-2`)}>
              {viewerIsOwner ? (
                <Button icon="Cog6ToothIcon" onClick={handleEdit} greyBg iconOnly />
              ) : (
                <div className="relative">
                  <Stack spacing="gap-x-2">
                    <Button icon="EnvelopeIcon" greyBg iconOnly />
                    {isFollowing ? (
                      <>
                        <Button
                          size="sm"
                          icon="UserPlusIcon"
                          onClick={handleUnfollow}
                          variant="primary"
                          iconOnly
                        />
                      </>
                    ) : (
                      <Button onClick={handleFollow} icon="UsersIcon" greyBg iconOnly />
                    )}
                    <Button
                      ref={showMoreRef}
                      onClick={onShowMore}
                      icon="EllipsisVerticalIcon"
                      greyBg
                      iconOnly
                    />
                  </Stack>
                  {showMore && (
                    <Card
                      elevation={{ light: '1', dark: '2' }}
                      padding={{ x: 18, y: 8 }}
                      radius={8}
                      customStyle="absolute top-[36px] right-0 bg-white dark:bg-grey3"
                    >
                      <Button onClick={handleFlag} plain>
                        <Stack align="center" spacing="gap-x-2">
                          <Icon
                            type="FlagIcon"
                            size="sm"
                            color={{ light: 'errorLight', dark: 'errorDark' }}
                          />
                          <Text variant="body1" color={{ light: 'errorLight', dark: 'errorDark' }}>
                            {flagLabel}
                          </Text>
                        </Stack>
                      </Button>
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
                  color={{ light: 'secondaryLight', dark: 'secondaryDark' }}
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
                        color={{ light: 'secondaryLight', dark: 'secondaryDark' }}
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
