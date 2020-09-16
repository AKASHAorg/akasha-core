/* eslint-disable import/first */
import DS from '@akashaproject/design-system';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import * as React from 'react';

const { Box, FilterCard, ProfileAvatarButton, ViewportSizeProvider } = DS;

storiesOf('Cards/Utility Cards', module).add('filter card', () => (
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
));
