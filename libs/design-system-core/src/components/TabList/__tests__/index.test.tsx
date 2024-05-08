import * as React from 'react';
import { act } from '@testing-library/react';
import TabList from '../';
import { customRender } from '../../../test-utils';

describe('<TabList /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const labels = ['Hello', 'World'];

  const handleTabChange = jest.fn(/** */);

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        <TabList labels={labels} selected={1} onChange={handleTabChange} />,
        {},
      );
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    expect(componentWrapper).toBeDefined();
  });

  it('has correct label and subtitle', () => {
    const { getAllByTestId } = componentWrapper;

    const tabs = getAllByTestId('tablist-tab');

    expect(tabs).toBeDefined();
    expect(tabs).toHaveLength(2);
  });
});
