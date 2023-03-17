import * as React from 'react';

import { renderWithAllProviders, act, genAppProps, cleanup } from '@akashaorg/af-testing';

import Moderators from '../../pages/moderators';

describe('<Moderators /> component', () => {
  const Base = <Moderators {...genAppProps()} />;

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
    expect(componentWrapper.baseElement).toBeInTheDocument();
  });
});
