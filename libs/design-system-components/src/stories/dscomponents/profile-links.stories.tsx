import type { Meta, StoryObj } from '@storybook/react';
import Links, { LinksProps } from '../../components/Profile/Links';

const meta: Meta<LinksProps> = {
  title: 'DSComponents/Profile/ProfileLinks',
  component: Links,
};

type Story = StoryObj<LinksProps>;

export const Default: Story = {
  args: {
    title: 'Find me on',
    links: [
      { href: 'https://lover.coffee' },
      { href: 'https://github.com/handle' },
      { href: 'https://telegram.com/handle' },
    ],
  },
};

export default meta;
