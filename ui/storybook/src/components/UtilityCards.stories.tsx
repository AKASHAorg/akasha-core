/* eslint-disable import/first */
import DS from '@akashaproject/design-system';
import { action } from '@storybook/addon-actions';
import { text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import * as React from 'react';

const { Box, FilterCard, SwitchCard, ProfileAvatarButton, ViewportSizeProvider } = DS;

export interface SwitchCardComponent {
  count: number;
  countLabel: string;
  buttonLabels: string[];
  buttonValues: string[];
  onIconClick: () => void;
}

const SwitchCardComponent: React.FC<SwitchCardComponent> = props => {
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
      loggedEthAddress={'0x000'}
    />
  );
};

storiesOf('Cards/Utility Cards', module)
  .add('filter card', () => (
    <Box align="center" pad={{ top: '40px' }} height="600px">
      <ViewportSizeProvider>
        <FilterCard
          titleElement={
            <ProfileAvatarButton
              avatarImage="https://placebeard.it/360x360"
              onClick={() => action('Avatar Button Click')()}
              label="@ivacarter"
              info="ivacarter.akasha.eth"
              size="sm"
              ethAddress={'0x000000'}
            />
          }
          handleClickAll={() => action('click all')('Synthetic Event')}
          handleClickFollowing={() => action('click following')('Synthetic Event')}
          handleClickLatest={() => action('click latest')('Synthetic Event')}
          handleClickOldest={() => action('click oldest')('Synthetic Event')}
        />
      </ViewportSizeProvider>
    </Box>
  ))
  .add('switch card', () => (
    <Box align="center" pad={{ top: '40px' }}>
      <SwitchCardComponent
        count={1276}
        countLabel={text('Count Label', 'results')}
        buttonLabels={[
          text('All Label', 'All'),
          text('Posts label', 'Posts'),
          text('Topics Label', 'Topics'),
          text('People Label', 'People'),
        ]}
        buttonValues={['All', 'Posts', 'Topics', 'People']}
        onIconClick={() => action('click icon')('Synthetic Event')}
      />
    </Box>
  ));
