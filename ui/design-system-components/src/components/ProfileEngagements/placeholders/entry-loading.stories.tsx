import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import EntryLoading from './entry-loading';

const meta: Meta = {
  title: 'DSComponents/Profile/EntryLoading',
  component: EntryLoading,
};

export default meta;
type Story = StoryObj;

export const BaseEntryError: Story = {
  render: () => <EntryLoading />,
};
