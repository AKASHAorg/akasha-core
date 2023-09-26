import * as React from 'react';

import { renderWithAllProviders, act, cleanup } from '@akashaorg/af-testing';

import { HeroImage } from '../profile/hero-image-card';

describe('<HeroImageCard /> component', () => {
  const Base = <HeroImage titleLabel="Step title" subtitleLabel="Step subtitle" />;

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
