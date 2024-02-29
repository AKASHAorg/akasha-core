import React from 'react';
import { tw } from '@twind/core';
import type { Meta, StoryObj } from '@storybook/react';

import {
  EllipsisVerticalIcon,
  FlagIcon,
  LinkIcon,
} from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import Menu, { MenuProps } from '@akashaorg/design-system-core/lib/components/Menu';

const meta: Meta<MenuProps> = {
  title: 'DSCore/Menu/Menu',
  component: Menu,
};

export default meta;
type Story = StoryObj<MenuProps>;

export const BaseMenu: Story = {
  render: () => (
    <div className={tw('w-[50%]')}>
      <Menu
        anchor={{
          icon: <EllipsisVerticalIcon />,
          variant: 'primary',
          greyBg: true,
          iconOnly: true,
        }}
        items={[
          {
            label: 'Copy',
            icon: <LinkIcon />,
            onClick: () => {
              /** */
            },
          },
          {
            label: 'Flag',
            icon: <FlagIcon />,
            color: { light: 'errorLight', dark: 'errorDark' },
            onClick: () => {
              /** */
            },
          },
        ]}
      />
    </div>
  ),
};
