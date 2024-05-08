import React from 'react';
import TagFeedPage from '../pages/tag-feed-page/tag-feed-page';

import { screen, renderWithAllProviders, act } from '@akashaorg/af-testing';

describe('< TagFeedPage /> component', () => {
  const BaseComponent = <TagFeedPage tagName="ethereum" />;

  // @TODO fix after new hooks
  it.skip('should render tag feed page', async () => {
    await act(async () => {
      renderWithAllProviders(BaseComponent, {});
    });

    expect(screen.getByText(/my-tag/i)).toBeInTheDocument();
    expect(screen.getByText(/10 mentions/i)).toBeInTheDocument();
    expect(screen.getByText(/Subscribe/i)).toBeInTheDocument();
  });
});
