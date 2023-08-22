import * as React from 'react';
import { act, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { customRender } from '@akashaorg/design-system-core/src/test-utils';

import SearchStartCard from '../';

describe('<SearchStartCard /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const handleSearch = jest.fn();
  const handleTopMenuClick = jest.fn();

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        <SearchStartCard
          searchKeyword="Blah"
          inputPlaceholderLabel="Search"
          handleSearch={handleSearch}
          handleTopMenuClick={handleTopMenuClick}
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

  it('calls handler when search is performed', async () => {
    const { getByRole } = componentWrapper;

    const search = getByRole('textbox');

    await userEvent.type(search, 'eth');
    await userEvent.keyboard('{Enter}');

    expect(handleSearch).toBeCalledTimes(1);
  });
});
