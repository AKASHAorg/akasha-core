/* eslint-disable react/prop-types */
import React from 'react';
import { Box, Grommet } from 'grommet';

import SwitchCard, { StyledSwitchCardButton } from '.';

import lightTheme from '../../styles/themes/light/light-theme';

export interface ISwitchCardComponent {
  count: number;
  countLabel: string;
  buttonValues: { value: string; label: string }[];
  onIconClick: () => void;
}

const SwitchCardComponent: React.FC<ISwitchCardComponent> = props => {
  const { count, countLabel, buttonValues, onIconClick } = props;
  const [activeButton, setActiveButton] = React.useState<string>('Kept');

  const onTabClick = (value: string) => () => {
    setActiveButton(value);
  };

  return (
    <SwitchCard
      count={count}
      hasIcon={true}
      countLabel={countLabel}
      activeButton={activeButton}
      tabButtons={
        <>
          <StyledSwitchCardButton
            label="Kept"
            size="large"
            removeBorder={false}
            primary={activeButton === 'Kept'}
            onClick={onTabClick('Kept')}
          />
          <StyledSwitchCardButton
            label="Delisted"
            size="large"
            removeBorder={true}
            primary={activeButton === 'Delisted'}
            onClick={onTabClick('Delisted')}
          />
        </>
      }
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
  buttonValues: [
    { value: 'Kept', label: 'Kept' },
    { value: 'Delisted', label: 'Delisted' },
  ],
};
