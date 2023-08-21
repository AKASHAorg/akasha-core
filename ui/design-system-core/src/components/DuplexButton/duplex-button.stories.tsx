import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import DuplexButton, { DuplexButtonProps } from '.';

const meta: Meta<DuplexButtonProps> = {
  title: 'Buttons/DuplexButton',
  component: DuplexButton,
};

export default meta;
type Story = StoryObj<DuplexButtonProps>;

const Component = () => {
  const [active, setActive] = React.useState(false);

  const handleClick = () => {
    setActive(!active);
  };

  return (
    <DuplexButton
      inactiveLabel="Follow"
      activeLabel="Following"
      activeHoverLabel="Unfollow"
      active={active}
      icon="RssIcon"
      onClickActive={handleClick}
      onClickInactive={handleClick}
    />
  );
};

export const BaseDuplexButton: Story = {
  render: () => <Component />,
};
