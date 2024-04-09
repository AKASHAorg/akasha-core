import type { Meta, StoryObj } from '@storybook/react';
import ProfileEngagementLoading from '../../components/ProfileEngagements/placeholders/profile-engagement-loading';

const meta: Meta = {
  title: 'DSComponents/Loaders/Profile/ProfileEngagementLoading',
  component: ProfileEngagementLoading,
  tags: ['autodocs'],
};

type Story = StoryObj;

export const Default: Story = {
  args: {},
};

export default meta;
