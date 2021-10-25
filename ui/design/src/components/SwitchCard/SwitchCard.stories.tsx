/* eslint-disable react/prop-types */
import React from 'react';
import { Box, Grommet } from 'grommet';

import SwitchCard from '.';

import lightTheme from '../../styles/themes/light/light-theme';

export interface ISwitchCardComponent {
  count: number;
  countLabel: string;
  buttonLabels: string[];
  buttonValues: string[];
  onIconClick: () => void;
}

const SwitchCardComponent: React.FC<ISwitchCardComponent> = props => {
  const { count, countLabel, buttonLabels, buttonValues, onIconClick } = props;
  const [activeButton, setActiveButton] = React.useState<string>('All');

  const onTabClick = (value: string) => {
    setActiveButton(buttonValues[buttonLabels.indexOf(value)]);
  };

  return (
    <SwitchCard
      count={count}
      hasIcon={true}
      countLabel={countLabel}
      activeButton={activeButton}
      buttonLabels={buttonLabels}
      buttonValues={buttonValues}
      hasMobileDesign={true}
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
  <Grommet theme={lightTheme}>
    <Box align="center" pad={{ top: '40px' }} width="582px">
      <SwitchCardComponent {...args} />
    </Box>
  </Grommet>
);

export const BaseSwitchCard = Template.bind({});

BaseSwitchCard.args = {
  count: 1276,
  countLabel: 'results',
  buttonLabels: ['All', 'Posts', 'Topics', 'People'],
  buttonValues: ['All', 'Posts', 'Topics', 'People'],
};
