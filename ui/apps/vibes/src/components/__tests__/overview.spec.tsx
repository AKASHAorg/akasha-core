import * as React from 'react';

import { renderWithAllProviders, act, cleanup } from '@akashaorg/af-testing';

import { Overview } from '../../pages';

describe('<Overview /> component', () => {
  const Base = <Overview isModerator={false} />;

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
    expect(componentWrapper.getByText(/Welcome to/i)).toBeInTheDocument();
  });
});
