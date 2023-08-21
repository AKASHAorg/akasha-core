import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import SeventyFivePercentSpinner from '.';
import { SpinnerProps } from '../Spinner';

const meta: Meta<SpinnerProps> = {
  title: 'Spinners/SeventyFivePercentSpinner',
  component: SeventyFivePercentSpinner,
};

export default meta;
type Story = StoryObj<SpinnerProps>;

export const BaseSeventyFivePercentSpinner: Story = {
  render: () => (
    <SeventyFivePercentSpinner size="xl" color="secondaryLight" loadingLabel="Loading..." />
  ),
};
