import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
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
  BoldAlt,
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
  VibesConsole,
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
  <Akasha key={0} />,
  <Antenna key={7} />,
  <App key={8} />,
  <Discord key={12} />,
  <IntegrationAppCTA key={18} />,
  <Plugin key={32} />,
  <Telegram key={36} />,
  <TextIcon key={37} />,
  <Twitter key={38} />,
  <Widget key={43} />,
];

const outlineCustomIconsArr = [
  <AlignCenter key={1} />,
  <AlignLeft key={2} />,
  <AlignRight key={3} />,
  <AlignTextCenter key={4} />,
  <AlignTextLeft key={5} />,
  <AlignTextRight key={6} />,
  <Blocks key={9} />,
  <BoldAlt key={10} />,
  <Caption key={11} />,
  <DidKey key={13} />,
  <Eth key={14} />,
  <Faq key={15} />,
  <Following key={16} />,
  <Github key={17} />,
  <Italic key={19} />,
  <LicenseAllRights key={20} />,
  <LicenseAttribution key={21} />,
  <LicenseNoDerivatives key={22} />,
  <LicenseNoRights key={23} />,
  <LicenseNonCommercial key={24} />,
  <LicenseShareAlike key={25} />,
  <LicenseSomeRights key={26} />,
  <LicenseWtfpl key={27} />,
  <ListBulleted key={28} />,
  <ListNumbered key={29} />,
  <Metamask key={30} />,
  <NoEth key={31} />,
  <Profile key={33} />,
  <Shield key={34} />,
  <Solana key={35} />,
  <Underline key={39} />,
  <VibesConsole key={40} />,
  <Vibes key={41} />,
  <Walletconnect key={42} />,
];

export const CustomIcons: Story = {
  render: () => (
    <Stack spacing="gap-y-3">
      <Stack direction="row" spacing="gap-x-2">
        <Text>Solid:</Text>
        {solidCustomIconsArr.map(icon => (
          <Icon key={icon.key} icon={icon} solid={true} />
        ))}
      </Stack>
      <Stack direction="row" spacing="gap-x-2">
        <Text>Outline:</Text>
        {outlineCustomIconsArr.map(icon => (
          <Icon key={icon.key} icon={icon} />
        ))}
      </Stack>
    </Stack>
  ),
};

export default meta;
