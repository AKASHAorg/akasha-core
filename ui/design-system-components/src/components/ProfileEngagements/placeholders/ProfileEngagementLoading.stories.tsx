import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import ProfileEngagementLoading from './ProfileEngagementLoading';

const meta: Meta = {
  title: 'Profile/ProfileEngagementLoading',
  component: ProfileEngagementLoading,
};

export default meta;
type Story = StoryObj;

export const BaseEntryError: Story = {
  render: () => <ProfileEngagementLoading />,
};
