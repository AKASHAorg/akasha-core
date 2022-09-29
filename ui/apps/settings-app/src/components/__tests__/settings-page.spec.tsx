import * as React from 'react';
import SettingsPage from '../settings-page';

import { act, screen, renderWithAllProviders, genAppProps } from '@akashaorg/af-testing';
import { AnalyticsProvider } from '@akashaorg/ui-awf-hooks/lib/use-analytics';

describe('< SignIn /> component', () => {
  const BaseComponent = (
    // <AnalyticsProvider {...genAppProps()}>
    <SettingsPage {...genAppProps()} />
    // </AnalyticsProvider>
  );
  beforeEach(async () => {
    await act(async () => {
      renderWithAllProviders(BaseComponent, {});
    });
  });

  it('should render settings page', async () => {
    expect(screen.getByText(/settings/i)).toBeInTheDocument();
  });
});
