import * as React from 'react';
import { act, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { customRender, wrapWithTheme } from '../../../test-utils';
import { SearchStartCard } from '../index';

describe('<SearchStartCard /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const handleSearch = jest.fn();

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <SearchStartCard
            searchKeyword="Blah"
            inputPlaceholderLabel="Search"
            titleLabel="Search"
            introLabel="✨ Find what you are looking for ✨"
            description="To create your unique feed view, subscribe to your favourite topics and find wonderful people to follow in our community."
            handleSearch={handleSearch}
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
    const title = getByPlaceholderText('Search');

    expect(title).toBeDefined();
  });

  it('calls handler when search is performed', () => {
    const { getByRole } = componentWrapper;

    const search = getByRole('textbox');

    userEvent.type(search, 'eth');
    userEvent.keyboard('{Enter}');

    expect(handleSearch).toBeCalledTimes(1);
  });
});
