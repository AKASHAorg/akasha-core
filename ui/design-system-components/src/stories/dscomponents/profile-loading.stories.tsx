import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { ProfileLoading } from '../../components/Profile';

const meta: Meta = {
  title: 'DSComponents/Profile/ProfileLoading',
  component: ProfileLoading,
};

export default meta;
type Story = StoryObj;

export const BaseProfileLoading: Story = {
  render: () => <ProfileLoading />,
};
