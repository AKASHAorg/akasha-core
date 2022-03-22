import React from 'react';
import { Grommet } from 'grommet';
import { withDesign } from 'storybook-addon-designs';
import Button, { IButtonProps } from '.';

import lightTheme from '../../styles/themes/light/light-theme';

export default {
  title: 'Buttons/Button',
  component: Button,
  argTypes: {
    label: { control: 'text' },
    primary: { control: 'boolean' },
  },
  decorators: [withDesign],
};

const Template = (args: IButtonProps) => (
  <Grommet theme={lightTheme}>
    <Button {...args} />
  </Grommet>
);

export const BaseButton = Template.bind({});
BaseButton.args = {
  label: 'Default button',
};
BaseButton.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/eI5afUtDh3y2Fg8SLYCR2X/%F0%9F%9F%A1-Updated-Design-System?node-id=24%3A896',
  },
};

export const PrimaryButton = Template.bind({});
PrimaryButton.args = {
  label: 'Primary button',
  primary: true,
};
PrimaryButton.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/eI5afUtDh3y2Fg8SLYCR2X/%F0%9F%9F%A1-Updated-Design-System?node-id=24%3A896',
  },
};
