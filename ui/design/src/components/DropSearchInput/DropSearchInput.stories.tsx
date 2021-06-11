import React from 'react';
import { Box, Grommet } from 'grommet';

import DropSearchInput, { ICustomSearchInput } from '.';

import lightTheme from '../../styles/themes/light/light-theme';

const suggestionsFromSpace = {
  users: [
    {
      name: 'Gilbert Carter',
      imageUrl: 'https://placebeard.it/640/480',
    },
    {
      name: 'Johan Gimli',
      imageUrl: 'https://placebeard.it/640/480',
    },
  ],
  tags: ['#gitcoin', '#gitcoinbounties'],
  apps: [
    {
      name: 'GitCoin',
      imageUrl: 'https://placebeard.it/640/480',
    },
  ],
};

export default {
  title: 'Input/DropSearchInput',
  component: DropSearchInput,
  argTypes: {
    placeholder: { control: 'text' },
    resultsLabel: { control: 'text' },
    appsLabel: { control: 'text' },
    tagsLabel: { control: 'text' },
    userLabel: { control: 'text' },
    getData: { action: 'get data' },
    onClickUser: { action: 'clicked user' },
    onClickTag: { action: 'clicked tag' },
    onClickApp: { action: 'clicked app' },
  },
};

const Template = (args: ICustomSearchInput) => (
  <Grommet theme={lightTheme}>
    <Box fill={true} justify="center" align="center">
      <Box width="medium" pad={{ top: 'large' }}>
        <DropSearchInput {...args} />
      </Box>
    </Box>
  </Grommet>
);

export const BaseDropSearchInput = Template.bind({});

BaseDropSearchInput.args = {
  dataSource: suggestionsFromSpace,
  placeholder: 'Search something...',
  resultsLabel: 'See all results',
  appsLabel: 'Apps',
  tagsLabel: 'Tags',
  usersLabel: 'Users',
};
