import * as React from 'react';
import MyAppsPage from '../pages/my-apps-page';

import { screen, renderWithAllProviders, act, genAppProps } from '@akashaorg/af-testing';

describe('< MyAppsPage /> component', () => {
  const BaseComponent = <MyAppsPage {...genAppProps()} />;

  beforeEach(async () => {
    await act(async () => {
      renderWithAllProviders(BaseComponent, {});
    });
  });

  it('should render my apps page', async () => {
    expect(screen.getByText(/Installed Apps/i)).toBeInTheDocument();
  });
});
