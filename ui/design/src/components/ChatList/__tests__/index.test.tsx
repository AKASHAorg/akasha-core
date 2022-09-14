import * as React from 'react';
import { act, cleanup } from '@testing-library/react';

import ChatList from '..';
import BubbleCard from '../../BubbleCard';

import { customRender, wrapWithTheme } from '../../../test-utils';

describe('<ChatList /> Component', () => {
  let componentWrapper = customRender(<></>, {});
  window.HTMLElement.prototype.scrollIntoView = jest.fn;

  const ethAddress = '0x003410490050000320006570034567114572000';
  const emptyChatLabel = 'Start by saying hello! 👋🏼';

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <ChatList
            emptyChatLabel={emptyChatLabel}
            loggedUserEthAddress={ethAddress}
            itemCard={<BubbleCard locale="en" youLabel="You" />}
            chatArr={[]}
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
