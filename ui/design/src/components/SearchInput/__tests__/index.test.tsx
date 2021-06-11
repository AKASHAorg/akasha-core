import * as React from 'react';
import { act, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import SearchInput from '..';
import { customRender, wrapWithTheme } from '../../../test-utils';

describe('<SearchInput /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const handleInputChange = jest.fn();
  const handleCancel = jest.fn();

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <SearchInput
            inputValue={'Gilbert'}
            cancelLabel="x"
            placeholderLabel="Search something here"
            onChange={handleInputChange}
            handleCancel={handleCancel}
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

  it('has correct placeholder', () => {
    const { getByPlaceholderText } = componentWrapper;
    const title = getByPlaceholderText('Search something here');

    expect(title).toBeDefined();
  });

  it('types into the input and triggers handler', async () => {
    const { getByRole } = componentWrapper;
    const input = getByRole('textbox');

    // has initial value
    expect(input).toHaveValue('Gilbert');
    expect(handleInputChange).toBeCalledTimes(0);

    // perform type action
    userEvent.type(input, 'g');

    expect(handleInputChange).toBeCalledTimes(1);
  });

  it('calls handler when action is canceled', () => {
    const { getByText } = componentWrapper;

    const cancelLabel = getByText('x');

    userEvent.click(cancelLabel);

    expect(handleCancel).toBeCalledTimes(1);
  });
});
