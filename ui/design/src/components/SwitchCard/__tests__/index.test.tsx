import * as React from 'react';
import { act, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import SwitchCard from '../';
import { customRender, wrapWithTheme } from '../../../test-utils';

describe('<SwitchCard /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const handleIconClick = jest.fn();
  const handleTabClick = jest.fn();

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <SwitchCard
            count={1276}
            countLabel="results"
            buttonLabels={['All', 'Posts', 'Topics', 'People']}
            buttonValues={['All', 'Posts', 'Topics', 'People']}
            hasIcon={true}
            activeButton={'All'}
            hasMobileDesign={true}
            onIconClick={handleIconClick}
            onTabClick={handleTabClick}
            loggedUser="0x000"
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

  it('has correct labels on the tabs', () => {
    const { getByText } = componentWrapper;

    const allTab = getByText('All');
    const postsTab = getByText('Posts');
    const topicsTab = getByText('Topics');
    const peopleTab = getByText('People');

    expect(allTab).toBeDefined();
    expect(postsTab).toBeDefined();
    expect(topicsTab).toBeDefined();
    expect(peopleTab).toBeDefined();
  });

  it('calls handler when clicked', () => {
    const { getByText } = componentWrapper;

    const postsTab = getByText('Posts');
    expect(handleTabClick).toBeCalledTimes(0);

    userEvent.click(postsTab);

    expect(handleTabClick).toBeCalledTimes(1);
  });
});
