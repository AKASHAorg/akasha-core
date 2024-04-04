import type { Meta, StoryObj } from '@storybook/react';
import Stats, { StatsProps } from '../../components/Profile/Stats';

const meta: Meta<StatsProps> = {
  title: 'DSComponents/Profile/ProfileStatsCard',
  component: Stats,
  tags: ['autodocs'],
  argTypes: {
    posts: { control: 'object' },
    interests: { control: 'object' },
    followers: { control: 'object' },
    following: { control: 'object' },
  },
};

type Story = StoryObj<StatsProps>;

export const Default: Story = {
  args: {
    posts: { label: 'Posts', total: 100 },
    interests: { label: 'Interests', total: 100 },
    followers: { label: 'Followers', total: 100 },
    following: { label: 'Following', total: 100 },
  },
};

export default meta;
