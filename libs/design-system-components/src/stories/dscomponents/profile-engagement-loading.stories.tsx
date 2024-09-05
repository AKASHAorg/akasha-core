import type { Meta, StoryObj } from '@storybook/react';
import ProfileEngagementLoading from '../../components/ProfileEngagements/placeholders/profile-engagement-loading';

ProfileEngagementLoading.displayName = 'ProfileEngagementLoading';

const meta: Meta = {
  title: 'DSComponents/Loaders/Profile/ProfileEngagementLoading',
  component: ProfileEngagementLoading,
};

type Story = StoryObj;

export const Default: Story = {
  args: {},
};

export default meta;
