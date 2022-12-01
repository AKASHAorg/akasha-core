import * as React from 'react';

import { renderWithAllProviders, act, cleanup } from '@akashaorg/af-testing';

import ContentTab from '../content-tab';

describe('<ContentTab /> component', () => {
  const handleSetIsPending = jest.fn();
  const Base = (
    <ContentTab
      isPending={true}
      pendingLabel="Pending"
      moderatedLabel="Moderated"
      countKept={5}
      countPending={2}
      countDelisted={3}
      setIsPending={handleSetIsPending}
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
    expect(componentWrapper.getByText(/Pending/i)).toBeInTheDocument();
    expect(componentWrapper.getByText(/Moderated/i)).toBeInTheDocument();
  });
});
