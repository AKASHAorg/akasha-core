import * as React from 'react';

import { renderWithAllProviders, act, cleanup } from '@akashaorg/af-testing';

import NoItemFound from '../error-cards/no-items-found';

describe('<NoItemFound /> component', () => {
  const Base = (
    <NoItemFound
      titleLabel="No pending items"
      subtitleLabel="There are no pending items at the moment. Please check back later"
    />
  );

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
    expect(componentWrapper.getByText('No pending items')).toBeInTheDocument();
  });
});
