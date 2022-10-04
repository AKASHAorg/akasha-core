import * as React from 'react';
import SettingsPage from '../settings-page';

import { act, screen, renderWithAllProviders, genAppProps } from '@akashaorg/af-testing';

describe('< SettingsPage /> component', () => {
  const BaseComponent = <SettingsPage {...genAppProps()} />;
  beforeEach(async () => {
    await act(async () => {
      renderWithAllProviders(BaseComponent, {});
    });
  });

  it('should render settings page', async () => {
    expect(screen.getByText(/settings/i)).toBeInTheDocument();
  });
});
