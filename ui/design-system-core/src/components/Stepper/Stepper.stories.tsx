import React from 'react';

import StepIndicator, { IStepIndicatorProps } from '.';

export default {
  title: 'Indicators/StepIndicator',
  component: StepIndicator,
  argTypes: {
    activeIndex: { control: 'number' },
  },
};

const Template = (args: IStepIndicatorProps) => (
  <div className="justify-center">
    <StepIndicator {...args} />
  </div>
);

export const BaseStepIndicator = Template.bind({});

BaseStepIndicator.args = {
  activeIndex: 2,
  stepLabels: [
    'Invitation Code',
    'Legal Agreements',
    'Choose How to Sign Up',
    'Sign Wallet Requests',
    'Choose Username',
  ],
};
