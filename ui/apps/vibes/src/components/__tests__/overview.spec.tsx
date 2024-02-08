import * as React from 'react';

import { renderWithAllProviders, act, cleanup } from '@akashaorg/af-testing';

import { Overview } from '../../pages';

describe('<Overview /> component', () => {
  const Base = <Overview isModerator={false} navigateTo={jest.fn()} />;

  const assetName = 'vibe-overview';

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
    expect(componentWrapper.getByText(/Overview/i)).toBeInTheDocument();
    expect(componentWrapper.getByText(/Welcome to/i)).toBeInTheDocument();
  });

  it('renders an image with correct src', () => {
    const image = componentWrapper.getByTestId(`${assetName}-image`);

    expect(image).toBeDefined();
    expect(image).toHaveAttribute('src', `/images/${assetName}.webp`);
  });
});
