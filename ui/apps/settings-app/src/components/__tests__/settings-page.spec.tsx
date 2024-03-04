import * as React from 'react';
import SettingsPage from '../pages/settings-page';

import { act, screen, renderWithAllProviders } from '@akashaorg/af-testing';

describe('< SettingsPage /> component', () => {
  const BaseComponent = <SettingsPage />;
  beforeEach(async () => {
    await act(async () => {
      renderWithAllProviders(BaseComponent, {});
    });
  });

  it('should render settings page', async () => {
    expect(screen.getByText(/settings/i)).toBeInTheDocument();
  });
});
