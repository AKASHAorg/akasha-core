import * as React from 'react';
import { act, cleanup } from '@testing-library/react';

import Topbar from '..';
import { customRender, wrapWithTheme } from '../../../test-utils';
import { MemoryRouter } from 'react-router-dom';

let componentWrapper = customRender(<></>, {});

const handleNavigation = jest.fn();
const handleSearch = jest.fn();
const handleLogin = jest.fn();
const handleSignup = jest.fn();
const handleLogout = jest.fn();
const handleSettings = jest.fn();
const handleFeedback = jest.fn();
const handleModerationClick = jest.fn();
const handleDashboardClick = jest.fn();

describe('<Topbar /> Component', () => {
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
            onSettingsClick={handleSettings}
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

describe.skip('<TopBar /> component on /auth-app* route', () => {
  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <MemoryRouter initialEntries={['/auth-app/sign-in']}>
            <Topbar
              onNavigation={handleNavigation}
              onSearch={handleSearch}
              brandLabel="test"
              searchAreaItem={undefined}
              quickAccessItems={[]}
              onLoginClick={handleLogin}
              onSignUpClick={handleSignup}
              onLogout={handleLogout}
              onSettingsClick={handleSettings}
              onFeedbackClick={handleFeedback}
              onModerationClick={handleModerationClick}
              onDashboardClick={handleDashboardClick}
              currentLocation=""
              modalSlotId="modal-slot"
            />
          </MemoryRouter>,
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
  it('render without search bar', () => {
    const searchBar = componentWrapper.getByRole('input');
    expect(searchBar).toBeUndefined();
  });
  it('render with correct text', () => {
    const text = componentWrapper.getByText('Stuck?');
    expect(text).toBeDefined();
  });
  it('render with mailto link', () => {
    const link: HTMLElement & { href?: string } = componentWrapper.getByRole('link');
    expect(link).toBeDefined();
    expect(link?.href).toEqual('mailto:alpha@ethereum.world');
  });
});
