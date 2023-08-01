import React, { ReactElement } from 'react';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Avatar from '@akashaorg/design-system-core/lib/components/Avatar';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import DidField from '@akashaorg/design-system-core/lib/components/DidField';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import TextLine from '@akashaorg/design-system-core/lib/components/TextLine';
import CopyToClipboard from '@akashaorg/design-system-core/lib/components/CopyToClipboard';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Menu, { MenuProps } from '@akashaorg/design-system-core/lib/components/Menu';
import { tw } from '@twind/core';
import { Profile } from '@akashaorg/typings/ui';
import { getColorClasses } from '@akashaorg/design-system-core/lib/utils/getColorClasses';

export type HeaderProps = {
  did: Profile['did'];
  background?: Profile['background'];
  avatar?: Profile['avatar'];
  name: Profile['name'];
  ensName?: 'loading' | string;

  viewerIsOwner: boolean;
  menuItems: MenuProps['items'];
  copyLabel: string;
  copiedLabel: string;
  followElement: ReactElement;
  handleEdit: () => void;
};

const Header: React.FC<HeaderProps> = ({
  did,
  background,
  avatar,
  name,
  ensName,
  viewerIsOwner,
  menuItems,
  copyLabel,
  copiedLabel,
  followElement,
  handleEdit,
}) => {
  const avatarContainer = `relative w-20 h-[3.5rem] shrink-0`;

  return (
    <div>
      <Card
        elevation="1"
        radius={{ top: 20 }}
        background={{ light: 'grey7', dark: 'grey5' }}
        customStyle={`h-32 ${
          background?.default
            ? `bg-center bg-no-repeat	bg-cover bg-[url(${background?.default.src})]`
            : ''
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
                customStyle={`absolute -top-6 border-2 border-white dark:border-grey2 ${getColorClasses(
                  {
                    light: 'grey8',
                    dark: 'grey4',
                  },
                  'bg',
                )}`}
              />
            </div>
            <Stack direction="column" spacing="gap-y-1">
              <Text variant="button-lg">{name}</Text>
              <DidField did={did.id} copyLabel={copyLabel} copiedLabel={copiedLabel} />
            </Stack>
            <div className={tw(`relative ml-auto mt-2`)}>
              <Stack spacing="gap-x-2">
                {viewerIsOwner ? (
                  <Button
                    icon="Cog6ToothIcon"
                    variant="primary"
                    onClick={handleEdit}
                    greyBg
                    iconOnly
                  />
                ) : (
                  <>
                    <Button icon="EnvelopeIcon" variant="primary" greyBg iconOnly />

                    {followElement}
                  </>
                )}

                <Menu
                  anchor={{
                    icon: 'EllipsisVerticalIcon',
                    variant: 'primary',
                    greyBg: true,
                    iconOnly: true,
                  }}
                  items={menuItems}
                  customStyle="w-max z-99"
                />
              </Stack>
            </div>
          </Stack>
          <Stack direction="column" spacing="gap-y-4">
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
