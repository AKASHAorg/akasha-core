import * as React from 'react';
import { act, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import IconLink from '../';
import Icon from '../../Icon';
import { customRender, wrapWithTheme } from '../../../test-utils';

describe('<IconLink /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const handleClick = jest.fn();

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <IconLink label="Click me" icon={<Icon type="wallet" />} onClick={handleClick} />,
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
    const icon = getByText('Click me');
    expect(icon).toBeDefined();
  });

  it('responds to click', () => {
    const { getByText } = componentWrapper;
    // should never been clicked yet
    expect(handleClick).toHaveBeenCalledTimes(0);

    const icon = getByText('Click me');
    userEvent.click(icon);

    // should be clicked by now
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
