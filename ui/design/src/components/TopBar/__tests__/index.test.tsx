import * as React from 'react';
import { act, cleanup } from '@testing-library/react';

import Topbar from '..';
import { customRender, wrapWithTheme } from '../../../test-utils';

describe('<Topbar /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const handleNavigation = jest.fn();
  const handleSearch = jest.fn();
  const handleLogin = jest.fn();
  const handleSignup = jest.fn();
  const handleLogout = jest.fn();
  const handleFeedback = jest.fn();
  const handleModerationClick = jest.fn();
  const handleDashboardClick = jest.fn();

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <Topbar
            onNavigation={handleNavigation}
            onSearch={handleSearch}
            brandLabel="test"
            searchAreaItem={undefined}
            quickAccessItems={[]}
            onLoginClick={handleLogin}
            onSignUpClick={handleSignup}
            onLogout={handleLogout}
            onFeedbackClick={handleFeedback}
            onModerationClick={handleModerationClick}
            onDashboardClick={handleDashboardClick}
            currentLocation=""
            modalSlotId="modal-slot"
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
