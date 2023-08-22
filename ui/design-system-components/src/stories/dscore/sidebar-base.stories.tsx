import React from 'react';
import { tw } from '@twind/core';
import type { Meta, StoryObj } from '@storybook/react';

import Sidebar, { SidebarProps } from '@akashaorg/design-system-core/lib/components/Sidebar';
import { sidebarItems } from '@akashaorg/design-system-core/lib/utils';

const meta: Meta<SidebarProps> = {
  title: 'DSCore/Bars/Sidebar',
  component: Sidebar,
};

export default meta;
type Story = StoryObj<SidebarProps>;

export const BaseSidebar: Story = {
  render: () => (
    <div className={tw('w-[25%]')}>
      <Sidebar
        guestTitle="Guest"
        guestSubtitle="Connect to see exclusive member only features."
        ctaText="Add magic to your world by installing cool apps developed by the community"
        ctaButtonLabel="Check them out!"
        footerLabel="Get in Touch"
        listItems={sidebarItems}
        loggedUser={{}}
        footerIcons={[
          { name: 'github', link: '', icon: 'akasha' },
          { name: 'discord', link: '', icon: 'akasha' },
          { name: 'telegram', link: '', icon: 'akasha' },
          { name: 'twitter', link: '', icon: 'akasha' },
        ]}
      />
    </div>
  ),
};
