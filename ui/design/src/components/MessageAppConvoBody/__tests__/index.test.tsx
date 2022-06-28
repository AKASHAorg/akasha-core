import * as React from 'react';
import { act, cleanup } from '@testing-library/react';

import MessageAppConvoBody from '../';
import BubbleCard from '../../BubbleCard';

import { customRender, wrapWithTheme } from '../../../test-utils';

describe('<MessageAppConvoBody /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const ethAddress = '0x003410490050000320006570034567114572000';
  const emptyChatLabel = 'Start by saying hello! 👋🏼';

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <MessageAppConvoBody
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
