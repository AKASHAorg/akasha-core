import React from 'react';

import SwitchCard from '.';

export interface ISwitchCardComponent {
  buttonValues: { value: string; label: string }[];
  onIconClick: () => void;
}

const SwitchCardComponent: React.FC<ISwitchCardComponent> = props => {
  const { buttonValues, onIconClick } = props;
  const [activeButton, setActiveButton] = React.useState<string>('Kept');

  const onTabClick = (value: string) => () => {
    setActiveButton(value);
  };

  return (
    <SwitchCard
      activeButton={activeButton}
      buttonValues={buttonValues}
      onIconClick={onIconClick}
      onTabClick={onTabClick}
      loggedUser={'0x000'}
    />
  );
};

export default {
  title: 'Cards/SwitchCard',
  component: SwitchCardComponent,
  argType: {
    count: { control: 'number' },
    countLabel: { control: 'text' },
    onIconClick: { action: 'clicked icon' },
  },
};

const Template = (args: ISwitchCardComponent) => (
  <>
    <SwitchCardComponent {...args} />
  </>
);

export const BaseSwitchCard = Template.bind({});

BaseSwitchCard.args = {
  count: 1276,
  countLabel: 'results',
  buttonValues: [
    { value: 'Kept', label: 'Kept' },
    { value: 'Delisted', label: 'Delisted' },
  ],
};
