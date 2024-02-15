import * as React from 'react';

import { renderWithAllProviders, act, cleanup } from '@akashaorg/af-testing';

import { Dashboard } from '../../pages';

describe('<Overview /> component', () => {
  const Base = <Dashboard navigateTo={jest.fn()} isAuthorised={true} />;

  let componentWrapper = renderWithAllProviders(<></>, {});

  beforeEach(() => {
    act(() => {
      componentWrapper = renderWithAllProviders(Base, {});
    });
  });

  afterEach(() => {
    act(() => componentWrapper.unmount());
    cleanup();
  });

  it('should render component', async () => {
    expect(componentWrapper.getByText(/overview/i)).toBeInTheDocument();
  });
});
