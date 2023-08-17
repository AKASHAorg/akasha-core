import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import ProfileLoading from './ProfileLoading';

const meta: Meta = {
  title: 'Profile/ProfileProfileLoading',
  component: ProfileLoading,
};

export default meta;
type Story = StoryObj;

export const BaseProfileLoading: Story = {
  render: () => <ProfileLoading />,
};
