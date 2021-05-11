/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
// import { create } from 'react-test-renderer';
import { render } from '@testing-library/react';

import EditorCard from '../';
import { editorDefaultValue } from '../../Editor';
import { wrapWithTheme } from '../../../test-utils';
import { USERNAMES, TAGS } from '../../../utils/dummy-data';

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
      ethAddress={args.ethAddress}
      tags={tags}
      mentions={mentionables}
      editorState={editorState}
      getTags={getTags}
      getMentions={getMentions}
      setEditorState={setEditorState}
      onPublish={() => null}
      handleNavigateBack={() => null}
    />
  );
};

describe('EditorCard component', () => {
  it('renders correctly', () => {
    render(
      wrapWithTheme(
        <EditorComponent
          avatar={'https://www.stevensegallery.com/360/360'}
          ethAddress={'0x003410499401674320006570047391024572000'}
          withMeter={true}
        />,
      ),
    );
  });
});
