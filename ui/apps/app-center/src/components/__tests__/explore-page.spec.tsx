import * as React from 'react';
import ExplorePage from '../pages/explore-page';

import {
  screen,
  renderWithAllProviders,
  act,
  genAppProps,
  genReleaseInfo,
} from '@akashaorg/af-testing';

describe('< ExplorePage /> component', () => {
  const BaseComponent = <ExplorePage {...genAppProps()} installableApps={[genReleaseInfo()]} />;

  beforeEach(async () => {
    await act(async () => {
      renderWithAllProviders(BaseComponent, {});
    });
  });

  it('should render explore page', async () => {
    expect(screen.getByText(/Welcome to the Integration Centre/i)).toBeInTheDocument();
  });
});
