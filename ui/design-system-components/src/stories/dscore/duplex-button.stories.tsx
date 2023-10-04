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

const Component = (props: DuplexButtonProps) => {
  const [active, setActive] = useState(false);

  const handleClick = () => {
    setActive(!active);
  };

  return (
    <DuplexButton
      inactiveLabel="Follow"
      activeLabel="Following"
      activeHoverLabel="Unfollow"
      active={active}
      hoverColors={{
        background: { light: 'transparent', dark: 'transparent' },
        border: { light: 'errorLight', dark: 'errorDark' },
        text: { light: 'errorLight', dark: 'errorDark' },
        icon: { light: 'errorLight', dark: 'errorDark' },
      }}
      onClickActive={handleClick}
      onClickInactive={handleClick}
      {...props}
    />
  );
};

export const BaseDuplexButton: Story = {
  render: () => <Component />,
};

export const DuplexButtonWithIcon: Story = {
  render: () => (
    <Component iconDirection="left" activeIcon="CheckIcon" activeHoverIcon="XMarkIcon" />
  ),
};

export const SecondaryDuplexButton: Story = {
  render: () => (
    <Component
      iconDirection="left"
      activeIcon="CheckIcon"
      activeHoverIcon="XMarkIcon"
      inactiveVariant="secondary"
    />
  ),
};
