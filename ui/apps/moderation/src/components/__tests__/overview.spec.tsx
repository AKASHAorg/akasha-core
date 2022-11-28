import * as React from 'react';

import {
  renderWithAllProviders,
  act,
  genAppProps,
  cleanup,
  fireEvent,
} from '@akashaorg/af-testing';

import Overview from '../../pages/overview';

describe('<Overview /> component', () => {
  const Base = <Overview {...genAppProps()} />;

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
    expect(componentWrapper.getByText(/Moderating/i)).toBeInTheDocument();
    expect(
      componentWrapper.getByText(/Find all the moderated posts, replies and accounts/i),
    ).toBeInTheDocument();
    expect(componentWrapper.getByText(/Welcome to the Moderation App/i)).toBeInTheDocument();
  });

  it('renders an image with correct src', () => {
    const image = componentWrapper.getByTestId(`${assetName}-image`);

    expect(image).toBeDefined();
    expect(image).toHaveAttribute('src', `/images/${assetName}.webp`);
  });

  it('should click a call to action element', () => {
    const discourseLink = componentWrapper.getByTestId('discord-link');

    expect(discourseLink).toBeInTheDocument();

    fireEvent.click(discourseLink);

    // make an assertion
  });
});
