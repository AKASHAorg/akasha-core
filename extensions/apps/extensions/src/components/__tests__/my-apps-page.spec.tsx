import * as React from 'react';
import MyAppsPage from '../pages/my-apps-page';

import { screen, renderWithAllProviders, act } from '@akashaorg/af-testing';

describe('< MyAppsPage /> component', () => {
  const BaseComponent = <MyAppsPage />;

  beforeEach(async () => {
    await act(async () => {
      renderWithAllProviders(BaseComponent, {});
    });
  });

  it('should render my apps page', async () => {
    expect(screen.getByText(/Installed Apps/i)).toBeInTheDocument();
  });
});
