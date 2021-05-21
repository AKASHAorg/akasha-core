import * as React from 'react';
import { act, cleanup } from '@testing-library/react';

import EmojiPopover from '../';

import { customRender, wrapWithTheme } from '../../../test-utils';

describe('<EmojiPopover /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const targetNode = document.createElement('div');
  document.body.appendChild(targetNode);

  const handleClosePopover = jest.fn();
  const handleClickEmoji = jest.fn();

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <EmojiPopover
            target={targetNode}
            closePopover={handleClosePopover}
            onClickEmoji={handleClickEmoji}
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

  it('has correct popover details', () => {
    const { getByText } = componentWrapper;

    const emojiGroupLabel = getByText(/Smileys & People/i);
    expect(emojiGroupLabel).toBeDefined();
  });

  it('popover has the  happy emoji', () => {
    const { getByText } = componentWrapper;

    const happyEmoji = getByText(/😀/i);
    expect(happyEmoji).toBeDefined();
  });
});
