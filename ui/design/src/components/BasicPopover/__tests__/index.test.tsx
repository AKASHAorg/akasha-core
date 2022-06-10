import * as React from 'react';
import userEvent from '@testing-library/user-event';
import { act, cleanup } from '@testing-library/react';

import BasicPopover from '../';
import { customRender, wrapWithTheme } from '../../../test-utils';

describe('<BasicPopover /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const targetNode = document.createElement('div');
  document.body.appendChild(targetNode);

  const handleClosePopover = jest.fn();

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <BasicPopover target={targetNode} closePopover={handleClosePopover}>
            <div>
              <div onClick={handleClosePopover}>text line 1</div>
              <div onClick={handleClosePopover}>text line 2</div>
            </div>
          </BasicPopover>,
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

  it('should have correct children', async () => {
    const { getByText } = componentWrapper;
    const line1 = getByText(/text line 1/i);
    const line2 = getByText(/text line 2/i);

    expect(line1).toBeDefined();
    expect(line2).toBeDefined();
  });

  it('calls handler when an option is clicked', async () => {
    const { getByText } = componentWrapper;

    const line1 = getByText(/text line 1/i);

    expect(handleClosePopover).toBeCalledTimes(0);

    await userEvent.click(line1);

    expect(handleClosePopover).toBeCalledTimes(1);
  });
});
