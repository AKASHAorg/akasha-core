import type { Meta, StoryObj } from '@storybook/react';
import { ProfileLoading } from '../../components/Profile';

ProfileLoading.displayName = 'ProfileLoading';

const meta: Meta = {
  title: 'DSComponents/Loaders/Profile/ProfileLoading',
  component: ProfileLoading,
};

type Story = StoryObj;

export const Default: Story = {
  args: {},
};

export default meta;
