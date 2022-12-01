import * as React from 'react';

import { renderWithAllProviders, act, genAppProps, cleanup } from '@akashaorg/af-testing';

import HeroImageCard from '../profile/hero-image-card';

describe('<HeroImageCard /> component', () => {
  const Base = (
    <HeroImageCard titleLabel="Step title" subtitleLabel="Step subtitle" {...genAppProps()} />
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
    expect(componentWrapper.getByText('Step title')).toBeInTheDocument();
    expect(componentWrapper.getByText('Step subtitle')).toBeInTheDocument();
  });
});
