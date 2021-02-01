/* eslint-disable import/first */
import DS from '@akashaproject/design-system';
import { action } from '@storybook/addon-actions';
import { boolean, text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { USERNAMES, TAGS } from './editor-data';

const { Box, EditorCard, EditorPlaceholder, editorDefaultValue } = DS;

const EditorComponent = () => {
  const [mentionsState, setMentionsState] = React.useState('');
  const [tagsState, setTagsState] = React.useState('');
  const [editorState, setEditorState] = React.useState(editorDefaultValue);

  const getMentions = query => {
    setMentionsState(query);
  };
  const getTags = query => {
    setTagsState(query);
  };

  const mentionables = USERNAMES.filter((c: any) =>
    c.name.toLowerCase().startsWith(mentionsState.toLowerCase()),
  ).slice(0, 10);

  const tags = TAGS.map(tag => {
    return { name: tag, totalPosts: 1 };
  })
    .filter(c => c.name.toLowerCase().startsWith(tagsState.toLowerCase()))
    .slice(0, 10);

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
      editorState={editorState}
      setEditorState={setEditorState}
    />
  );
};

storiesOf('Cards/Editor Cards', module)
  .add('editor card', () => (
    <Box align="center" pad={{ top: '40px' }} width={{ max: '36rem' }}>
      {EditorComponent()}
    </Box>
  ))
  .add('placeholder editor card', () => (
    <Box align="center" pad={{ top: '40px' }} width={{ max: '36rem' }}>
      <EditorPlaceholder
        avatar={text('Logged Profile Avatar', 'https://www.stevensegallery.com/360/360')}
        ethAddress={text('Logged Profile EthAddress', '0x003410499401674320006570047391024572000')}
        onClick={action('onClick')}
      />
    </Box>
  ));
