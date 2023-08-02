import React from 'react';
import Menu, { MenuProps } from './index';

export default {
  title: 'Menu/Menu',
  component: Menu,
};

const Template = (args: MenuProps) => <Menu {...args} />;
export const BaseMenu = Template.bind({});
BaseMenu.args = {
  anchor: {
    icon: 'EllipsisVerticalIcon',
    variant: 'primary',
    greyBg: true,
    iconOnly: true,
  },
  items: [
    {
      label: 'Copy',
      icon: 'LinkIcon',
      onClick: () => {
        /** */
      },
    },
    {
      label: 'Report',
      icon: 'FlagIcon',
      color: { light: 'errorLight', dark: 'errorDark' },
      onClick: () => {
        /** */
      },
    },
  ],
};
