import React from 'react';
import { Grommet } from 'grommet';

import DuplexButton, { IDuplexButtonProps } from '.';

import lightTheme from '../../styles/themes/light/light-theme';

export default {
  title: 'Buttons/DuplexButton',
  component: DuplexButton,
  argTypes: {
    activeLabel: { control: 'text' },
    inactiveLabel: { control: 'text' },
    activeHoverLabel: { control: 'text' },
    active: { control: 'boolean' },
  },
};

const Template = (args: IDuplexButtonProps) => {
  const [active, setActive] = React.useState(false);
  const handleClick = () => {
    if (!active) {
      setActive(true);
    } else {
      setActive(false);
    }
  };
  return (
    <Grommet theme={lightTheme}>
      <DuplexButton
        {...args}
        active={args.active || active}
        onClickActive={handleClick}
        onClickInactive={handleClick}
      />
    </Grommet>
  );
};

export const BaseDuplexButton = Template.bind({});
BaseDuplexButton.args = {
  activeLabel: 'Active state',
  inactiveLabel: 'Inactive state',
  activeHoverLabel: 'Active hover',
  active: false,
};
