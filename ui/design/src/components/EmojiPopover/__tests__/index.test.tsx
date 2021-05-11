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

  it('renders popover when clicked', () => {
    const { getByTestId, getByText } = componentWrapper;

    const icon = getByTestId('eye-icon');
    expect(icon).toBeDefined();

    // perform click action to reveal popover
    userEvent.click(icon);

    const emojiGroup = getByText(/Smileys & People/i);
    expect(emojiGroup).toBeDefined();
  });

  it('popover has the  happy emoji', () => {
    const { getByTestId, getByText } = componentWrapper;

    const icon = getByTestId('eye-icon');
    expect(icon).toBeDefined();

    // perform click action to reveal popover
    userEvent.click(icon);

    const emojiGroup = getByText(/😀/i);
    expect(emojiGroup).toBeDefined();
  });
});
