/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Box, Grommet } from 'grommet';
import EditorCard, { IEditorCard } from '.';
import { editorDefaultValue } from '../Editor/initialValue';
import { USERNAMES, TAGS } from '../../utils/dummy-data';
import lightTheme from '../../styles/themes/light/light-theme';

const EditorComponent = ({ ...args }) => {
  const [mentionsState, setMentionsState] = React.useState('');
  const [tagsState, setTagsState] = React.useState('');
  const [editorState, setEditorState] = React.useState(editorDefaultValue);

  const getMentions = (query: any) => {
    setMentionsState(query);
  };
  const getTags = (query: any) => {
    setTagsState(query);
  };

  const mentionables = USERNAMES.filter((c: any) =>
    c.name.toLowerCase().startsWith(mentionsState.toLowerCase()),
  ).slice(0, 10);

  const tags = TAGS.map(tag => ({ name: tag, totalPosts: 1 }))
    .filter(c => c.name.toLowerCase().startsWith(tagsState.toLowerCase()))
    .slice(0, 10);

  return (
    <EditorCard
      avatar={args.avatar}
      withMeter={args.withMeter}
      profileId={args.profileId}
      tags={tags}
      mentions={mentionables}
      editorState={editorState}
      getLinkPreview={() => null}
      getTags={getTags}
      getMentions={getMentions}
      setEditorState={setEditorState}
      onPublish={() => null}
      handleNavigateBack={() => null}
    />
  );
};

export default {
  title: 'Cards/EditorCard',
  component: EditorComponent,
  argTypes: {
    avatar: { control: 'text' },
    profileId: { control: 'text' },
    withMeter: { control: 'boolean' },
    getTags: { action: 'clicked get tags' },
    onPublish: { action: 'clicked publish' },
    getMentions: { action: 'clicked get mentions' },
    handleNavigateBack: { action: 'clicked navigate back' },
  },
};

const Template = (args: IEditorCard) => (
  <Grommet theme={lightTheme}>
    <Box fill={true} align="center" justify="center">
      <Box
        width="35rem"
        border={{
          color: 'border',
          size: 'xsmall',
          style: 'solid',
          side: 'all',
        }}
      >
        <EditorComponent {...args} />
      </Box>
    </Box>
  </Grommet>
);

export const BaseEditorCard = Template.bind({});

BaseEditorCard.args = {
  avatar: 'https://www.stevensegallery.com/360/360',
  profileId: 'did:0x003410499401674320006570047391024572000',
  withMeter: true,
};
