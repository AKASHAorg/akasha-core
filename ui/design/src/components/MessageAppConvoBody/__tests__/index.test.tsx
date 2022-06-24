import * as React from 'react';
import { act, cleanup } from '@testing-library/react';

import MessageAppConvoBody from '../';
import MessageAppBubbleCard from '../../MessageAppBubbleCard';

import { customRender, wrapWithTheme } from '../../../test-utils';

describe('<MessageAppConvoBody /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const ethAddress = '0x003410490050000320006570034567114572000';
  const emptyChatLabel = 'Start by saying hello! 👋🏼';

  const handleMentionClick = jest.fn();
  const handleTagClick = jest.fn();
  const handleLinkClick = jest.fn();

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <MessageAppConvoBody
            emptyChatLabel={emptyChatLabel}
            loggedUserEthAddress={ethAddress}
            itemCard={<MessageAppBubbleCard locale="en" youLabel="You" />}
            chatArr={[]}
            onMentionClick={handleMentionClick}
            onTagClick={handleTagClick}
            onLinkClick={handleLinkClick}
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
