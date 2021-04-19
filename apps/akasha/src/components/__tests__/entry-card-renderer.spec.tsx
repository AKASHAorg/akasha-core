import * as React from 'react';
import EntryCardRenderer from '../feed-page/entry-card-renderer';
import { act, create, ReactTestRenderer } from 'react-test-renderer';
import { cleanup } from '@testing-library/react';

describe('<ContentCard /> component', () => {
  let componentWrapper: ReactTestRenderer = create(<></>);
  beforeEach(() => {
    act(() => {
      componentWrapper = create(
        <EntryCardRenderer
          sdkModules={{}}
          logger={{ log: console.log }}
          globalChannel={{}}
          ethAddress=""
          onBookmark={jest.fn}
          onAvatarClick={jest.fn}
          onMentionClick={jest.fn}
          onNavigate={jest.fn}
          onRepost={jest.fn}
          onTagClick={jest.fn}
          onFlag={jest.fn}
          onLinkCopy={jest.fn}
          sharePostUrl=""
          rxjsOperators={{}}
          singleSpaNavigate={jest.fn}
        />,
      );
    });
  });

  afterEach(() => {
    act(() => {
      componentWrapper.unmount();
    });
    cleanup();
  });

  it('should mount', () => {
    const root = componentWrapper.root;
    const avatarComp = root.findByType(EntryCardRenderer);
    expect(avatarComp).toBeDefined();
  });
});
