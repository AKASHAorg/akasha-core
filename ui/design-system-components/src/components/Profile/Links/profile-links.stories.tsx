import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import Links, { LinksProps } from '.';

const meta: Meta<LinksProps> = {
  title: 'DSComponents/Profile/ProfileLinks',
  component: Links,
};

export default meta;
type Story = StoryObj<LinksProps>;

export const BaseLinks: Story = {
  render: () => (
    <Links
      title="Find me on"
      links={[
        { href: 'https://lover.coffee' },
        { href: 'https://github.com/handle' },
        { href: 'https://telegram.com/handle' },
      ]}
    />
  ),
};
