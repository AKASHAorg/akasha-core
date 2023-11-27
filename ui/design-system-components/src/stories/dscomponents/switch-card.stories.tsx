import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import SwitchCard, { SwitchCardProps } from '../../components/SwitchCard';

const meta: Meta<SwitchCardProps> = {
  title: 'DSComponents/Cards/SwitchCard',
  component: SwitchCard,
};

export default meta;
type Story = StoryObj<SwitchCardProps>;

const Component = () => {
  const [activeButton, setActiveButton] = React.useState<string>('Kept');

  const onTabClick = (value: string) => () => {
    setActiveButton(value);
  };

  return (
    <SwitchCard
      activeButton={activeButton}
      buttonValues={[
        { value: 'Kept', label: 'Kept' },
        { value: 'Delisted', label: 'Delisted' },
      ]}
      onTabClick={onTabClick}
      isLoggedIn={true}
    />
  );
};

export const BaseSwitchCard: Story = {
  render: () => <Component />,
};
