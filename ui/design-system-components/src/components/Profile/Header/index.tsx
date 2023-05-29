import React from 'react';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Avatar from '@akashaorg/design-system-core/lib/components/Avatar';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import TextLine from '@akashaorg/design-system-core/lib/components/TextLine';
import CopyToClipboard from '@akashaorg/design-system-core/lib/components/CopyToClipboard';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Menu from '@akashaorg/design-system-core/lib/components/Menu';
import { tw } from '@twind/core';
import { Profile } from '@akashaorg/typings/ui';

export type HeaderProps = {
  ensName?: 'loading' | string;
  isFollowing: boolean;
  viewerIsOwner: boolean;
  flagLabel: string;
  handleEdit: (event: React.SyntheticEvent<Element, Event>) => void;
  handleFollow: (event: React.SyntheticEvent<Element, Event>) => void;
  handleUnfollow: (event: React.SyntheticEvent<Element, Event>) => void;
  handleFlag: (event: React.SyntheticEvent<Element, Event>) => void;
  actionButtonExt?: React.ReactNode;
};

const Header: React.FC<HeaderProps & Profile> = ({
  background,
  did,
  avatar,
  name,
  ensName,
  isFollowing,
  viewerIsOwner,
  flagLabel,
  handleEdit,
  handleUnfollow,
  handleFollow,
  handleFlag,
}) => {
  const avatarContainer = `relative w-20 h-[3.5rem] shrink-0`;

  return (
    <div>
      <Card
        elevation="1"
        radius={{ top: 20 }}
        background={{ light: 'grey7', dark: 'grey5' }}
        customStyle={`h-32 ${
          background?.default ? `bg-center bg-[url(${background?.default.src})]` : ''
        }`}
      ></Card>
      <Card elevation="1" radius={{ bottom: 20 }} padding="px-[0.5rem] pb-[1rem] pt-0">
        <Stack direction="column" customStyle="pl-2" fullWidth>
          <Stack spacing="gap-x-2" customStyle="-ml-2">
            <div className={tw(avatarContainer)}>
              <Avatar
                profileId={did.id}
                size="xl"
                avatar={avatar}
                customStyle="absolute -top-6 border-2 border-white dark:border-grey2"
              />
            </div>
            <Stack direction="column">
              <Text variant="button-lg">{name}</Text>
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
                    <Menu
                      anchorElement={
                        <Button onClick={handleFlag} icon="EllipsisVerticalIcon" greyBg iconOnly />
                      }
                      items={[
                        {
                          label: flagLabel,
                          icon: 'FlagIcon',
                          color: { light: 'errorLight', dark: 'errorDark' },
                        },
                      ]}
                    />
                  </Stack>
                </div>
              )}
            </div>
          </Stack>
          <Stack direction="column" spacing="gap-y-4">
            <Stack direction="column" spacing="gap-y-1.5">
              <Text variant="label">Ethereum Address</Text>
              <CopyToClipboard value={did.id}>
                <Text
                  variant="footnotes2"
                  color={{ light: 'secondaryLight', dark: 'secondaryDark' }}
                >
                  {did.id}
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
