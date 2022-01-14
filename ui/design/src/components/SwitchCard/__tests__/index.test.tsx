import * as React from 'react';
import { act, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import SwitchCard, { StyledSwitchCardButton } from '../';
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
            tabButtons={
              <>
                <StyledSwitchCardButton
                  label="Kept"
                  size="large"
                  removeBorder={false}
                  primary={true}
                  onClick={handleTabClick}
                />
                <StyledSwitchCardButton
                  label="Delisted"
                  size="large"
                  removeBorder={true}
                  primary={false}
                  onClick={handleTabClick}
                />
              </>
            }
            buttonLabels={['Kept', 'Delisted']}
            buttonValues={['Kept', 'Delisted']}
            hasIcon={true}
            activeButton={'Kept'}
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

    const keptItemsTab = getByText('Kept');
    const delistedItemsTab = getByText('Delisted');

    expect(keptItemsTab).toBeDefined();
    expect(delistedItemsTab).toBeDefined();
  });

  it('calls handler when clicked', () => {
    const { getByText } = componentWrapper;

    const delistedItemsTab = getByText('Delisted');
    expect(handleTabClick).toBeCalledTimes(0);

    userEvent.click(delistedItemsTab);

    expect(handleTabClick).toBeCalledTimes(1);
  });
});
