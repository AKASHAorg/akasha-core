/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import '@testing-library/jest-dom';
import { act, cleanup } from '@testing-library/react';

import EditorCard from '../';
import { editorDefaultValue } from '../../Editor';
import { customRender, wrapWithTheme } from '../../../test-utils';
import { USERNAMES, TAGS } from '../../../utils/dummy-data';
import userEvent from '@testing-library/user-event';

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
      onPublish={args.handlePublish}
      handleNavigateBack={() => null}
    />
  );
};

describe('EditorCard component', () => {
  let componentWrapper = customRender(<></>, {});

  const handlePublish = jest.fn();

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <EditorComponent
            avatar={'https://www.stevensegallery.com/360/360'}
            ethAddress={'0x003410499401674320006570047391024572000'}
            withMeter={true}
            handlePublish={handlePublish}
          />,
        ),
        {},
      );
    });
  });

  afterEach(() => {
    act(() => {
      componentWrapper.unmount();
    });
    cleanup();
  });

  it('renders correctly', () => {
    expect(componentWrapper).toBeDefined();
  });

  it('has correct title', () => {
    const { getAllByText } = componentWrapper;
    const title = getAllByText(/new post/i);
    expect(title).toBeDefined();
  });

  it('has post button initially disabled', () => {
    const { getByRole } = componentWrapper;
    const postButton = getByRole('button', { name: 'Post' });
    userEvent.click(postButton);
    expect(postButton).toHaveProperty('disabled', true);
  });
});
