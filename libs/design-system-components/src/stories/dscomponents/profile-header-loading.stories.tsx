import type { Meta, StoryObj } from '@storybook/react';
import { ProfileHeaderLoading } from '../../components/Profile';

const meta: Meta = {
  title: 'DSComponents/Loaders/Profile/ProfileHeaderLoading',
  component: ProfileHeaderLoading,
};

type Story = StoryObj;

export const Default: Story = {
  args: {},
};

export default meta;
