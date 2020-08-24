/* eslint-disable import/first */
import DS from '@akashaproject/design-system';
import { action } from '@storybook/addon-actions';
import { text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import * as React from 'react';

const { Box, CommentInput, DropSearchInput, SearchInput } = DS;
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

const DropSearchInputComponent = () => {
  return (
    <Box fill={true} justify="center" align="center">
      <Box width="medium" pad={{ top: 'large' }}>
        <DropSearchInput
          getData={action('Get Data')}
          dataSource={suggestionsFromSpace}
          placeholder={'Search something...'}
          resultsLabel="See all results"
          appsLabel="Apps"
          tagsLabel="Tags"
          usersLabel="Users"
          onClickUser={(name: string) => action('Click user')(name)}
          onClickTag={(tag: string) => action('Click tag')(tag)}
          onClickApp={(name: string) => action('Click app')(name)}
        />
      </Box>
    </Box>
  );
};

const SearchInputComponent = () => {
  const [inputValue, setInputValue] = React.useState('');
  const handleInputChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(ev.target.value);
  };
  const handleCancel = () => {
    setInputValue('');
  };

  return (
    <Box fill={true} justify="center" align="center">
      <Box width="medium" pad={{ top: 'large' }}>
        <SearchInput
          inputValue={inputValue}
          onChange={handleInputChange}
          handleCancel={handleCancel}
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
          avatarImg={text('Avatar', 'https://placebeard.it/640/480')}
          ethAddress={text('EthAddress', '0x003410490050000320006570047391024572000')}
          placeholderLabel="Write a comment"
          publishLabel="Publish"
          onPublish={() => action('On Publish')('Synthetic Event')}
        />
      </Box>
    </Box>
  );
};

storiesOf('Input/Search Inputs', module)
  .add('drop search', () => <DropSearchInputComponent />)
  .add('search', () => <SearchInputComponent />);
storiesOf('Input/Comment Input', module).add('comment', () => <CommentInputComponent />);
