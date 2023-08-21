import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import Stats, { StatsProps } from '.';

const meta: Meta<StatsProps> = {
  title: 'DSComponents/Profile/ProfileStatsCard',
  component: Stats,
};

export default meta;
type Story = StoryObj<StatsProps>;

export const BaseStats: Story = {
  render: () => (
    <Stats
      posts={{ label: 'Posts', total: 100 }}
      interests={{ label: 'Interests', total: 100 }}
      followers={{ label: 'Followers', total: 100 }}
      following={{ label: 'Following', total: 100 }}
    />
  ),
};
