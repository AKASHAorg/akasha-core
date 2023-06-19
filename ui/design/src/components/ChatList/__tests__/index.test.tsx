import * as React from 'react';
import { act, cleanup } from '@testing-library/react';

import ChatList from '..';
import BubbleCard from '../../BubbleCard';

import { customRender, wrapWithTheme } from '../../../test-utils';

describe('<ChatList /> Component', () => {
  let componentWrapper = customRender(<></>, {});
  window.HTMLElement.prototype.scrollIntoView = jest.fn;

  const mock = function () {
    return {
      observe: jest.fn(),
      disconnect: jest.fn(),
    };
  };

  window.IntersectionObserver = jest.fn().mockImplementation(mock);

  const profileId = 'did:0x003410490050000320006570034567114572000';
  const emptyChatLabel = 'Start by saying hello! 👋🏼';

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <ChatList
            emptyChatLabel={emptyChatLabel}
            loggedUserProfileId={profileId}
            itemCard={<BubbleCard locale="en" youLabel="You" />}
            oldMessages={[]}
          />,
        ),
        {},
      );
    });
  });

  afterEach(() => {
    act(() => componentWrapper.unmount());
    cleanup();
  });

  it('renders correctly', () => {
    expect(componentWrapper).toBeDefined();
  });

  it('renders placeholder if chat is empty', () => {
    const { getByText } = componentWrapper;
    const placeholder = getByText(emptyChatLabel);
    expect(placeholder).toBeDefined();
  });
});
