import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import StepIndicator, { StepIndicatorProps } from '.';

const meta: Meta<StepIndicatorProps> = {
  title: 'Indicators/StepIndicator',
  component: StepIndicator,
};

export default meta;
type Story = StoryObj<StepIndicatorProps>;

export const BaseStepIndicator: Story = {
  render: () => (
    <StepIndicator
      activeIndex={2}
      stepLabels={[
        'Invitation Code',
        'Legal Agreements',
        'Choose How to Sign Up',
        'Sign Wallet Requests',
        'Choose Username',
      ]}
    />
  ),
};
