import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import DatePicker from '@akashaorg/design-system-core/lib/components/DatePicker';

const meta: Meta = {
  title: 'DSCore/Datepicker/DatePicker',

  component: DatePicker,
};

export default meta;
type Story = StoryObj;

export const BaseDatePicker: Story = {
  render: () => <DatePicker />,
};
