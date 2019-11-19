/* eslint-disable import/first */
import { Box, CommentInput, SearchInput } from '@akashaproject/design-system';
import { action } from '@storybook/addon-actions';
import { text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import * as React from 'react';

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
        <SearchInput
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
const CommentInputComponent = () => {
  return (
    <Box justify="center" align="center">
      <Box width="581px" pad={{ top: 'large' }}>
        <CommentInput
          avatarImg={text('Avatar', 'http://placebeard.it/640/480')}
          ethAddress={text('EthAddress', '0x003410490050000320006570047391024572000')}
          placeholderTitle="Write a comment"
          publishTitle="Publish"
          onPublish={() => action('On Publish')('Synthetic Event')}
        />
      </Box>
    </Box>
  );
};

storiesOf('Input', module)
  .add('search', () => <SearchInputComponent />)
  .add('comment', () => <CommentInputComponent />);
