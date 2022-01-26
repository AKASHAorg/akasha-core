import React from 'react';
import { Box, Grommet } from 'grommet';
import { useArgs } from '@storybook/client-api';

import Checkbox, { CheckBoxProps } from '.';

import lightTheme from '../../styles/themes/light/light-theme';

export default {
  title: 'Checkbox/Checkbox',
  component: Checkbox,
  argTypes: {
    label: { control: 'text' },
    checked: { control: 'boolean' },
    setChecked: { control: 'func', action: 'clicked' },
  },
};

const Template = (args: CheckBoxProps) => {
  const [, updateArgs] = useArgs();
  const handle = () => updateArgs({ ...args, checked: !args.checked });

  return (
    <Grommet theme={lightTheme}>
      <Box justify="center" align="center">
        <Box width="581px" pad={{ top: 'large' }}>
          <Checkbox {...args} onChange={handle} />
        </Box>
      </Box>
    </Grommet>
  );
};

export const BaseCheckbox = Template.bind({});

BaseCheckbox.args = {
  label: 'Hello this is label',
  checked: false,
};
