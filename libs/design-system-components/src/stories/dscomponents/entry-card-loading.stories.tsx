import type { Meta, StoryObj } from '@storybook/react';
import EntryLoadingPlaceholder from '../../components/Entry/EntryCardLoading';

EntryLoadingPlaceholder.displayName = 'EntryLoadingPlaceholder';

const meta: Meta = {
  title: 'DSComponents/Loaders/EntryLoadingPlaceholder',
  component: EntryLoadingPlaceholder,
};

type Story = StoryObj;

export const Default: Story = {
  args: {},
};

export default meta;
