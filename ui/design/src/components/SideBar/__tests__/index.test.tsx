import * as React from 'react';
import { act, cleanup } from '@testing-library/react';

import Sidebar from '..';
import { customRender, wrapWithTheme } from '../../../test-utils';

describe('<Sidebar /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const handleSidebarClose = jest.fn();
  const handleClickMenuItem = jest.fn();
  const handleExploreClick = jest.fn();

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <Sidebar
            worldAppsTitleLabel="World Apps"
            poweredByLabel="Powered by AKASHA"
            userInstalledAppsTitleLabel="Apps"
            userInstalledApps={[]}
            exploreButtonLabel="Explore"
            isLoggedIn={false}
            loadingUserInstalledApps={true}
            worldApps={[]}
            allMenuItems={[]}
            onSidebarClose={handleSidebarClose}
            onClickMenuItem={handleClickMenuItem}
            onClickExplore={handleExploreClick}
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
});
