import * as React from 'react';
import EntryCardRenderer from '../feed-page/entry-card-renderer';
import { act, create, ReactTestRenderer } from 'react-test-renderer';
import { cleanup } from '@testing-library/react';
import DS from '@akashaproject/design-system';

const { ThemeSelector, lightTheme } = DS;

describe('<ContentCard /> component', () => {
  let componentWrapper: ReactTestRenderer = create(<></>);
  beforeEach(() => {
    act(() => {
      componentWrapper = create(
        <ThemeSelector availableThemes={[lightTheme]} settings={{ activeTheme: 'lightTheme' }}>
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
          />
        </ThemeSelector>,
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
