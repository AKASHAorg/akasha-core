import * as React from 'react';
import { act, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { customRender } from '@akashaorg/design-system-core/src/test-utils';

import SearchBar from '../';

describe('<SearchBar /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const handleInputChange = jest.fn();
  const handleSearch = jest.fn();

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        <SearchBar
          inputValue={'Test'}
          inputPlaceholderLabel="Search"
          onInputChange={handleInputChange}
          onSearch={handleSearch}
        />,
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
    const title = getByPlaceholderText('Search');

    expect(title).toBeDefined();
  });

  it('types into the input and triggers handler', async () => {
    const { getByRole } = componentWrapper;
    const input = getByRole('textbox');

    // has initial value
    expect(input).toHaveValue('Test');
    expect(handleInputChange).toBeCalledTimes(0);

    // perform type action
    await userEvent.type(input, 'g');

    expect(handleInputChange).toBeCalledTimes(1);
  });

  it('calls handler when search is performed', async () => {
    const { getByRole } = componentWrapper;

    const search = getByRole('textbox');

    await userEvent.type(search, 'eth');
    await userEvent.keyboard('{Enter}');

    expect(handleSearch).toBeCalledTimes(1);
  });
});
