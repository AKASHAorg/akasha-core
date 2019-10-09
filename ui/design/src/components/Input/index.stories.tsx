/* eslint-disable import/first */
import { action } from '@storybook/addon-actions';
import { boolean, color, object, text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import { Search } from 'grommet-icons';
import * as React from 'react';
import { Box, TextInput } from 'grommet';
import { CustomSearchInput } from './search-input';

const suggestionsFromSpace = {
  users: [
    {
      name: 'Gilberta Carter',
      imageUrl: 'http://placebeard.it/640/480',
    },
    {
      name: 'Johana Gimli',
      imageUrl: 'http://placebeard.it/640/480',
    },
  ],
  tags: ['#gitcoin', '#gitcoinbounties'],
  apps: [
    {
      name: 'GitCoin',
      imageUrl: 'http://placebeard.it/640/480',
    },
  ],
};

const SearchInputComponent = () => {
  return (
    <Box fill justify="center" align="center">
      <Box width="medium" pad={{ top: 'large' }}>
        <CustomSearchInput
          dataSource={suggestionsFromSpace}
          placeholder={'Search something...'}
          appsTitle="APPS"
          tagsTitle="TAGS"
          usersTitle="USER PROFILES"
        />
      </Box>
    </Box>
  );
};

storiesOf('Input', module).add('search', () => <SearchInputComponent />);
