import * as React from 'react';
import { act, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import IconButton from '../';
import Icon from '../../Icon';
import { customRender, wrapWithTheme } from '../../../test-utils';

describe('<IconButton /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const handleClick = jest.fn();

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <IconButton
            label="Sample Icon Button"
            icon={<Icon type="akasha" />}
            onClick={handleClick}
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

  it('has correct label', () => {
    const { getByText } = componentWrapper;
    const icon = getByText(/Sample /);
    expect(icon).toBeDefined();
  });

  it('responds to click', () => {
    const { getByText } = componentWrapper;
    // should never been clicked yet
    expect(handleClick).toHaveBeenCalledTimes(0);

    const icon = getByText(/Sample /);
    userEvent.click(icon);

    // should be clicked by now
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
