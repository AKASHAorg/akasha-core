import * as React from 'react';
import { act, cleanup } from '@testing-library/react';

import ICWidgetCard from '../';
import { customRender, wrapWithTheme } from '../../../test-utils';
import { ICWorldAppsData, ICInstalledAppsData } from '../../../utils/dummy-data';

describe('<ICWidgetCard /> Component', () => {
  let componentWrapper = customRender(<></>, {});
  const handleClickWorldApp = jest.fn();
  const handleClickInstalledApp = jest.fn();
  const handleTabClick = jest.fn();

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <ICWidgetCard
            worldApps={ICWorldAppsData}
            installedApps={ICInstalledAppsData}
            titleLabel="My Apps"
            worldAppsLabel="World Apps"
            installedAppsLabel="Installed"
            noWorldAppsLabel="No World Apps. Please check later"
            noInstalledAppsLabel="No Installed Apps. Please install an app"
            noInstalledAppsSubLabel="Try one out!"
            onClickWorldApp={handleClickWorldApp}
            onClickInstalledApp={handleClickInstalledApp}
            onActiveTabChange={handleTabClick}
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

  it('has correct title', () => {
    const { getByText } = componentWrapper;
    const title = getByText(/my apps/i);
    expect(title).toBeDefined();
  });
});
