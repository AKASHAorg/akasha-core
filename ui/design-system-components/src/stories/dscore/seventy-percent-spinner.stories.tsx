import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import SeventyFivePercentSpinner from '@akashaorg/design-system-core/lib/components/SeventyFivePercentSpinner';
import { SpinnerProps } from '@akashaorg/design-system-core/lib/components/Spinner';

const meta: Meta<SpinnerProps> = {
  title: 'DSCore/Spinners/SeventyFivePercentSpinner',
  component: SeventyFivePercentSpinner,
};

export default meta;
type Story = StoryObj<SpinnerProps>;

export const BaseSeventyFivePercentSpinner: Story = {
  render: () => (
    <SeventyFivePercentSpinner size="xl" color="secondaryLight" loadingLabel="Loading..." />
  ),
};
