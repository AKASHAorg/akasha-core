import * as React from 'react';
import { act, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import EmojiPopover from '../';
import { customRender, wrapWithTheme } from '../../../test-utils';
import { Box } from 'grommet';
import Icon from '../../Icon';

const BaseComponent = () => {
  const iconRef = React.useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = React.useState(false);
  return (
    <Box width="medium" pad={{ top: 'large' }}>
      <div ref={iconRef}>
        <Icon type="eye" testId="eye-icon" onClick={() => setMenuOpen(true)} />
      </div>
      {iconRef?.current && menuOpen && (
        <EmojiPopover
          target={iconRef.current}
          closePopover={() => setMenuOpen(false)}
          onClickEmoji={() => null}
        />
      )}
    </Box>
  );
};

describe('<EmojiPopover /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(wrapWithTheme(<BaseComponent />), {});
    });

    /* this block of code is specific to modals and popovers
      that will be rendered after an icon is clicked */

    const { getByTestId } = componentWrapper;
    const icon = getByTestId('eye-icon');
    // perform click action to reveal popover
    userEvent.click(icon);
  });

  afterEach(() => {
    act(() => componentWrapper.unmount());
    cleanup();
  });

  it('renders correctly', () => {
    expect(componentWrapper).toBeDefined();
  });

  it('renders popover when clicked', () => {
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
