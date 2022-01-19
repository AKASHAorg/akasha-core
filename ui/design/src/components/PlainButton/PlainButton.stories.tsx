import React from 'react';
import { Grommet } from 'grommet';

import PlainButton, { IPlainButtonProps } from '.';

import lightTheme from '../../styles/themes/light/light-theme';

export default {
  title: 'Buttons/PlainButton',
  component: PlainButton,
  argTypes: {
    label: { control: 'text' },
  },
};

const Template = (args: IPlainButtonProps) => (
  <Grommet theme={lightTheme}>
    <PlainButton {...args}>{args.children} </PlainButton>
  </Grommet>
);

export const BasePlainButton = Template.bind({});
BasePlainButton.args = {
  label: 'Plain button',
  color: '#000',
  children: <></>,
};
