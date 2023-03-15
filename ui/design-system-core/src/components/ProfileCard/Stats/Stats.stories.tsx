import React from 'react';
import Stats, { StatsProps } from './index';

export default {
  title: 'Cards/ProfileStatsCard',
  component: Stats,
};

const Template = (args: StatsProps) => <Stats {...args} />;

export const BasicProfileStats = Template.bind({});
BasicProfileStats.args = {
  posts: { label: 'Posts', total: 100 },
  interests: { label: 'Interests', total: 100 },
  followers: { label: 'Followers', total: 100 },
  following: { label: 'Following', total: 100 },
};
