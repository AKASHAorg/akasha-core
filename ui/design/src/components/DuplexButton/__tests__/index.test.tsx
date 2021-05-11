import * as React from 'react';
import { act, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import DuplexButton from '../';
import { customRender, wrapWithTheme } from '../../../test-utils';

describe('<DuplexButton /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const Component = () => {
    const [active, setActive] = React.useState(true);
    return (
      <DuplexButton
        activeLabel="Active"
        inactiveLabel="Inactive"
        activeHoverLabel="Hover"
        active={active}
        onClickActive={() => {
          setActive(false);
        }}
        onClickInactive={() => {
          setActive(true);
        }}
      />
    );
  };

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(wrapWithTheme(<Component />), {});
    });
  });

  afterEach(() => {
    act(() => componentWrapper.unmount());
    cleanup();
  });

  it('renders correctly', () => {
    expect(componentWrapper).toBeDefined();
  });

  it('has active label initially', () => {
    const { getByRole } = componentWrapper;
    const activeButton = getByRole('button', { name: 'Active' });
    expect(activeButton).toBeDefined();
  });

  it('shows hover label when on hover and reverts when hover is reversed', async () => {
    const { getByRole } = componentWrapper;
    const activeButton = getByRole('button', { name: 'Active' });

    // when user hovers over the button, should change text to 'Hover'
    userEvent.hover(activeButton);

    const hoverButton = getByRole('button', { name: 'Hover' });
    expect(hoverButton).toBeDefined();

    // when hover is reversed, should change text back to 'Active'
    userEvent.unhover(hoverButton);

    const unhoverButton = getByRole('button', { name: 'Active' });
    expect(unhoverButton).toBeDefined();
  });

  it('shows inactive label when clicked', async () => {
    const { getByRole } = componentWrapper;
    const activeButton = getByRole('button', { name: 'Active' });

    // when user clicks the button, should change text to 'Inactive'
    userEvent.click(activeButton);

    const inactiveButton = getByRole('button', { name: 'Inactive' });
    expect(inactiveButton).toBeDefined();
  });
});
