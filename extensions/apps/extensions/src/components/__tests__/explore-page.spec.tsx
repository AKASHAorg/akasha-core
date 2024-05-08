import * as React from 'react';
import ExplorePage from '../pages/explore-page';

import { screen, renderWithAllProviders, act, genReleaseInfo } from '@akashaorg/af-testing';

describe('< ExplorePage /> component', () => {
  const BaseComponent = <ExplorePage installableApps={[genReleaseInfo()]} />;

  beforeEach(async () => {
    await act(async () => {
      renderWithAllProviders(BaseComponent, {});
    });
  });

  it('should render explore page', async () => {
    expect(screen.getByText(/Latest Apps/i)).toBeInTheDocument();
  });
});
