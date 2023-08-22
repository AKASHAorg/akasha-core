import * as React from 'react';
import { act, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { customRender } from '@akashaorg/design-system-core/src/test-utils';

import SwitchCard from '..';

describe('<SwitchCard /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const handleTabClick = jest.fn();

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        <SwitchCard
          buttonValues={[
            { value: 'Kept', label: 'Kept' },
            { value: 'Delisted', label: 'Delisted' },
          ]}
          activeButton={'Kept'}
          onTabClick={() => handleTabClick}
          loggedUser="0x000"
        />,

        {},
      );
    });
  });

  afterEach(() => {
    act(() => componentWrapper.unmount());
    cleanup();
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    expect(componentWrapper).toBeDefined();
  });

  it('has correct labels on the tabs', () => {
    const { getByText } = componentWrapper;

    const keptItemsTab = getByText('Kept');
    const delistedItemsTab = getByText('Delisted');

    expect(keptItemsTab).toBeDefined();
    expect(delistedItemsTab).toBeDefined();
  });

  it('calls handler when clicked', async () => {
    const { getByText } = componentWrapper;

    const delistedItemsTab = getByText('Delisted');
    expect(handleTabClick).not.toBeCalled();

    await userEvent.click(delistedItemsTab);

    expect(handleTabClick).toBeCalledTimes(1);
  });
});
