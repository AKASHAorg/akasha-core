import * as React from 'react';
import { act, cleanup } from '@testing-library/react';

import PlainButton from '../';
import { customRender, wrapWithTheme } from '../../../test-utils';
import userEvent from '@testing-library/user-event';

describe('<PlainButton /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const handleClick = jest.fn();

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <PlainButton label="Plain button" onClick={handleClick}>
            <></>
          </PlainButton>,
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

    const label = getByText('Plain button');
    expect(label).toBeDefined();
  });

  it('calls handler when clicked', () => {
    const { getByText } = componentWrapper;

    const button = getByText('Plain button');

    expect(handleClick).toHaveBeenCalledTimes(0);
    userEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
