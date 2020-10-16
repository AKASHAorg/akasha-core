/* eslint-disable import/first */
import DS from '@akashaproject/design-system';
import { action } from '@storybook/addon-actions';
import { boolean, text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { USERNAMES, TAGS } from './editor-data';

const { Box, EditorCard } = DS;

const EditorComponent = () => {
  const [mentionsState, setMentionsState] = React.useState('');
  const [tagsState, setTagsState] = React.useState('');

  const getMentions = query => {
    setMentionsState(query);
  };
  const getTags = query => {
    setTagsState(query);
  };

  const mentionables = USERNAMES.filter((c: string) =>
    c.toLowerCase().startsWith(mentionsState.toLowerCase()),
  ).slice(0, 10);

  const tags = TAGS.filter((c: string) =>
    c.toLowerCase().startsWith(tagsState.toLowerCase()),
  ).slice(0, 10);

  return (
    <EditorCard
      onPublish={() => action('Clicked on')('Synthetic Event')}
      avatar={text('Logged Profile Avatar', 'https://www.stevensegallery.com/360/360')}
      ethAddress={text('Logged Profile EthAddress', '0x003410499401674320006570047391024572000')}
      withMeter={boolean('Meter', true)}
      getMentions={getMentions}
      getTags={getTags}
      mentions={mentionables}
      tags={tags}
      handleNavigateBack={action('Navigate back')}
    />
  );
};

storiesOf('Cards/Editor Cards', module).add('editor card', () => (
  <Box align="center" pad={{ top: '40px' }}>
    {EditorComponent()}
  </Box>
));
