import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import SwitchCard, { SwitchCardProps } from '../../components/SwitchCard';

const SwitchCardComponent: React.FC<SwitchCardProps> = props => {
  const [activeButton, setActiveButton] = React.useState<string>('Kept');

  const onTabClick = (value: string) => () => {
    setActiveButton(value);
  };

  return <SwitchCard {...props} activeButton={activeButton} onTabClick={onTabClick} />;
};

const meta: Meta<SwitchCardProps> = {
  title: 'DSComponents/Cards/SwitchCard',
  component: SwitchCardComponent,
};

type Story = StoryObj<SwitchCardProps>;

export const Default: Story = {
  args: {
    isLoggedIn: true,
    buttonValues: [
      { value: 'Kept', label: 'Kept' },
      { value: 'Delisted', label: 'Delisted' },
    ],
  },
};

export default meta;
