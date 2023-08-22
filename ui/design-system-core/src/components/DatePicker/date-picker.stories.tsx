import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import DatePicker from '.';

const meta: Meta = {
  title: 'DatePicker/DatePicker',

  component: DatePicker,
};

export default meta;
type Story = StoryObj;

export const BaseDatePicker: Story = {
  render: () => <DatePicker />,
};
