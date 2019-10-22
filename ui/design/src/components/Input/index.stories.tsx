/* eslint-disable import/first */
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import { Box } from 'grommet';
import * as React from 'react';
import { CustomSearchInput } from './search-input';

const suggestionsFromSpace = {
  users: [
    {
      name: 'Gilbert Carter',
      imageUrl: 'http://placebeard.it/640/480',
    },
    {
      name: 'Johan Gimli',
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
    <Box fill={true} justify="center" align="center">
      <Box width="medium" pad={{ top: 'large' }}>
        <CustomSearchInput
          getData={action('Get Data')}
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
