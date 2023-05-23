import * as React from 'react';
import AppsPage from '../pages/apps-page';

import { screen, renderWithAllProviders, act, genAppProps } from '@akashaorg/af-testing';

describe('< AppsPage /> component', () => {
  const BaseComponent = <AppsPage {...genAppProps()} />;

  beforeEach(async () => {
    await act(async () => {
      renderWithAllProviders(BaseComponent, {});
    });
  });

  it('should render apps page', async () => {
    expect(screen.getByText(/Newest Apps/i)).toBeInTheDocument();
  });
});
