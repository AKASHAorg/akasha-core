import * as React from 'react';

import { renderWithAllProviders, act, cleanup } from '@akashaorg/af-testing';

import { ApplicationStatusType, Overview } from '../../pages';

describe('<Overview /> component', () => {
  const Base = (
    <Overview
      navigateTo={jest.fn()}
      isAuthorised={true}
      applicationStatus={ApplicationStatusType.approved}
    />
  );

  const assetName = 'moderation';

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
    expect(componentWrapper.getByText(/Welcome to Vibe/i)).toBeInTheDocument();
  });

  it('renders an image with correct src', () => {
    const image = componentWrapper.getByTestId(`${assetName}-image`);

    expect(image).toBeDefined();
    expect(image).toHaveAttribute('src', `/images/${assetName}.webp`);
  });
});
