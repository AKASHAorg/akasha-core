import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Tooltip from '@akashaorg/design-system-core/lib/components/Tooltip';
import Icon, { IconProps } from '@akashaorg/design-system-core/lib/components/Icon';
import {
  Akasha,
  AlignCenter,
  AlignLeft,
  AlignRight,
  AlignTextCenter,
  AlignTextLeft,
  AlignTextRight,
  Antenna,
  App,
  Blocks,
  Bold,
  Caption,
  Discord,
  DidKey,
  Eth,
  Faq,
  Following,
  Github,
  IntegrationAppCTA,
  Italic,
  LicenseAllRights,
  LicenseAttribution,
  LicenseNoDerivatives,
  LicenseNoRights,
  LicenseNonCommercial,
  LicenseShareAlike,
  LicenseSomeRights,
  LicenseWtfpl,
  ListBulleted,
  ListNumbered,
  Metamask,
  NoEth,
  Plugin,
  Profile,
  Shield,
  Solana,
  Telegram,
  TextIcon,
  Twitter,
  Underline,
  Vibes,
  Walletconnect,
  Widget,
} from '@akashaorg/design-system-core/lib/components/Icon/akasha-icons';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';

Icon.displayName = 'Icon';

const meta: Meta<IconProps> = {
  title: 'DSCore/Icons/Icon',
  component: Icon,
  argTypes: {
    color: { control: 'text' },
    icon: { control: 'object' },
    size: { control: 'text' },
    breakPointSize: { control: 'text' },
    accentColor: { control: 'boolean' },
    disabled: { control: 'boolean' },
    hover: { control: 'boolean' },
    customStyle: { control: 'text' },
    hoverColor: { control: 'object' },
    solid: { control: 'boolean' },
    rotateAnimation: { control: 'boolean' },
  },
};

type Story = StoryObj<IconProps>;

export const Default: Story = { args: { icon: <Akasha />, solid: true } };

export const IconWithSize: Story = { args: { icon: <Akasha />, solid: true, size: 'xl' } };

const solidCustomIconsArr = [
  { icon: <Akasha key={0} />, name: 'Akasha' },
  { icon: <Antenna key={7} />, name: 'Antenna' },
  { icon: <App key={8} />, name: 'App' },
  { icon: <Discord key={12} />, name: 'Discord' },
  { icon: <IntegrationAppCTA key={18} />, name: 'IntegrationAppCTA' },
  { icon: <Plugin key={32} />, name: 'Plugin' },
  { icon: <Telegram key={36} />, name: 'Telegram' },
  { icon: <TextIcon key={37} />, name: 'TextIcon' },
  { icon: <Twitter key={38} />, name: 'Twitter' },
  { icon: <Widget key={43} />, name: 'Widget' },
];

const outlineCustomIconsArr = [
  { icon: <AlignCenter key={1} />, name: 'AlignCenter' },
  { icon: <AlignLeft key={2} />, name: 'AlignLeft' },
  { icon: <AlignRight key={3} />, name: 'AlignRight' },
  { icon: <AlignTextCenter key={4} />, name: 'AlignTextCenter' },
  { icon: <AlignTextLeft key={5} />, name: 'AlignTextLeft' },
  { icon: <AlignTextRight key={6} />, name: 'AlignTextRight' },
  { icon: <Blocks key={9} />, name: 'Blocks' },
  { icon: <Bold key={10} />, name: 'Bold' },
  { icon: <Caption key={11} />, name: 'Caption' },
  { icon: <DidKey key={13} />, name: 'DidKey' },
  { icon: <Eth key={14} />, name: 'Eth' },
  { icon: <Faq key={15} />, name: 'Faq' },
  { icon: <Following key={16} />, name: 'Following' },
  { icon: <Github key={17} />, name: 'Github' },
  { icon: <Italic key={19} />, name: 'Italic' },
  { icon: <LicenseAllRights key={20} />, name: 'LicenseAllRights' },
  { icon: <LicenseAttribution key={21} />, name: 'LicenseAttribution' },
  { icon: <LicenseNoDerivatives key={22} />, name: 'LicenseNoDerivatives' },
  { icon: <LicenseNoRights key={23} />, name: 'LicenseNoRights' },
  { icon: <LicenseNonCommercial key={24} />, name: 'LicenseNonCommercial' },
  { icon: <LicenseShareAlike key={25} />, name: 'LicenseShareAlike' },
  { icon: <LicenseSomeRights key={26} />, name: 'LicenseSomeRights' },
  { icon: <LicenseWtfpl key={27} />, name: 'LicenseWtfpl' },
  { icon: <ListBulleted key={28} />, name: 'ListBulleted' },
  { icon: <ListNumbered key={29} />, name: 'ListNumbered' },
  { icon: <Metamask key={30} />, name: 'Metamask' },
  { icon: <NoEth key={31} />, name: 'NoEth' },
  { icon: <Profile key={33} />, name: 'Profile' },
  { icon: <Shield key={34} />, name: 'Shield' },
  { icon: <Solana key={35} />, name: 'Solana' },
  { icon: <Underline key={39} />, name: 'Underline' },
  { icon: <Vibes key={41} />, name: 'Vibes' },
  { icon: <Walletconnect key={42} />, name: 'Walletconnect' },
];

export const CustomIcons: Story = {
  render: () => (
    <Stack spacing="gap-y-4">
      <Stack direction="row" spacing="gap-3" customStyle="flex-wrap">
        <Text weight="bold">Solid:</Text>
        {solidCustomIconsArr.map(({ icon, name }) => (
          <Tooltip key={icon.key} placement="top" content={name} trigger="hover">
            <Icon icon={icon} solid={true} />
          </Tooltip>
        ))}
      </Stack>
      <Stack direction="row" spacing="gap-3" customStyle="flex-wrap">
        <Text weight="bold">Outline:</Text>
        {outlineCustomIconsArr.map(({ icon, name }) => (
          <Tooltip key={icon.key} placement="top" content={name} trigger="hover">
            <Icon icon={icon} />
          </Tooltip>
        ))}
      </Stack>
    </Stack>
  ),
};

export default meta;
