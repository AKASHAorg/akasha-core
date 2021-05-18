import * as React from 'react';
import { act, cleanup } from '@testing-library/react';

import AppMenuPopover from '../index';

import { customRender, wrapWithTheme } from '../../../test-utils';
import { installedAppsData } from '../../../utils/dummy-data';

describe('<AppMenuPopover /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const targetNode = document.createElement('div');
  document.body.appendChild(targetNode);

  const handleClosePopover = jest.fn();
  const handleClickMenuItem = jest.fn();

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <AppMenuPopover
            menuItem={{
              ...installedAppsData[0],
              subRoutes: [installedAppsData[1], installedAppsData[2], installedAppsData[3]],
            }}
            target={targetNode}
            closePopover={handleClosePopover}
            onClickMenuItem={handleClickMenuItem}
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

  it('renders popover when clicked', () => {
    const { getByText } = componentWrapper;

    const popoverTitle = getByText(installedAppsData[0].label);
    const ENS = getByText(installedAppsData[1].label);
    const ThreeBox = getByText(installedAppsData[2].label);
    const Profile = getByText(installedAppsData[3].label);

    expect(popoverTitle).toBeDefined();
    expect(ENS).toBeDefined();
    expect(ThreeBox).toBeDefined();
    expect(Profile).toBeDefined();
  });
});
