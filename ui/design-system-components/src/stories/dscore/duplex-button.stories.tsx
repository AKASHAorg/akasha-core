import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import DuplexButton, {
  DuplexButtonProps,
} from '@akashaorg/design-system-core/lib/components/DuplexButton';

const meta: Meta<DuplexButtonProps> = {
  title: 'DSCore/Buttons/DuplexButton',
  component: DuplexButton,
};

export default meta;
type Story = StoryObj<DuplexButtonProps>;

const Component = () => {
  const [active, setActive] = useState(true);

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
