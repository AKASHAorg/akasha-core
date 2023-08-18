import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import EntryError, { EntryErrorProps } from '.';

const meta: Meta<EntryErrorProps> = {
  title: 'DSComponents/Profile/EntryError',
  component: EntryError,
};

export default meta;
type Story = StoryObj<EntryErrorProps>;

export const BaseEntryError: Story = {
  render: () => <EntryError onError={() => ({})} />,
};
