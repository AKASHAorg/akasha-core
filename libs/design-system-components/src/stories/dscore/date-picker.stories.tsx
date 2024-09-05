import type { Meta, StoryObj } from '@storybook/react';

import DatePicker from '@akashaorg/design-system-core/lib/components/DatePicker';

DatePicker.displayName = 'DatePicker';

const meta: Meta = {
  title: 'DSCore/Datepicker/DatePicker',
  component: DatePicker,
  argTypes: {
    placeholderLabel: { control: 'text' },
  },
};

type Story = StoryObj;

export const Default: Story = {
  args: {
    placeholderLabel: 'Select a Date Range',
  },
};

export default meta;
