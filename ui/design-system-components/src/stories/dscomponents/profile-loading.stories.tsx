import type { Meta, StoryObj } from '@storybook/react';
import { ProfileLoading } from '../../components/Profile';

const meta: Meta = {
  title: 'DSComponents/Loaders/Profile/ProfileLoading',
  component: ProfileLoading,
  tags: ['autodocs'],
};

type Story = StoryObj;

export const Default: Story = {
  args: {},
};

export default meta;
