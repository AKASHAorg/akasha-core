import React from 'react';
import { tw } from '@twind/core';

import Sidebar, { ISidebarProps } from '.';
import { sidebarItems } from '../../utils/dummy-data';

export default {
  title: 'Sidebar/Sidebar',
  component: Sidebar,
};

const Template = (args: ISidebarProps) => (
  <div className={tw('w-[25%]')}>
    <Sidebar {...args} />
  </div>
);

export const BaseSidebar = Template.bind({});

BaseSidebar.args = {
  guestTitle: 'Guest',
  guestSubtitle: 'Connect to see exclusive member only features.',
  ctaText: 'Add magic to your world by installing cool apps developed by the community',
  ctaButtonLabel: 'Check them out!',
  footerLabel: 'Get in Touch',
  listItems: sidebarItems,
  loggedUser: {},
  footerIcons: [
    { name: 'github', link: '', icon: 'akasha' },
    { name: 'discord', link: '', icon: 'akasha' },
    { name: 'telegram', link: '', icon: 'akasha' },
    { name: 'twitter', link: '', icon: 'akasha' },
  ],
};
