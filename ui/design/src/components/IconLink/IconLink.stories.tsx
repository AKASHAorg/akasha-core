import React from 'react';
import { Grommet } from 'grommet';

import IconLink, { ILinkIconButtonProps } from '.';
import Icon from '../Icon';

import lightTheme from '../../styles/themes/light/light-theme';

export default {
  title: 'Buttons/IconLink',
  component: IconLink,
  argTypes: {
    label: { control: 'text' },
    iconPosition: {
      control: {
        type: 'radio',
        options: ['start', 'end'],
      },
    },
  },
};

const Template = (args: ILinkIconButtonProps) => (
  <Grommet theme={lightTheme}>
    <IconLink {...args} />
  </Grommet>
);

export const BaseIconLink = Template.bind({});
BaseIconLink.args = {
  label: 'Click me',
  icon: <Icon type="wallet" />,
  iconPosition: 'start',
};
