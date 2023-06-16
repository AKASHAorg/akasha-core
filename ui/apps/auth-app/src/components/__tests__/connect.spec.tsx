import * as React from 'react';
import Connect from '../connect';

import { act, screen, renderWithAllProviders, genAppProps } from '@akashaorg/af-testing';
import { AnalyticsProvider } from '@akashaorg/ui-awf-hooks/lib/use-analytics';
import { MemoryRouter as Router } from 'react-router-dom';

describe('< SignIn /> component', () => {
  const BaseComponent = (
    <Router initialEntries={['/@akashaorg/app-auth-ewa/provider']}>
      <AnalyticsProvider {...genAppProps()}>
        <Connect {...genAppProps()} />;
      </AnalyticsProvider>
    </Router>
  );
  beforeEach(async () => {
    await act(async () => {
      renderWithAllProviders(BaseComponent, {});
    });
  });

  it('should render sign in page', async () => {
    expect(screen.getByText(/Welcome to AKASHA World/i)).toBeInTheDocument();
    expect(screen.getByText(/Choose a way to connect/i)).toBeInTheDocument();
  });

  it('has a connect option', async () => {
    const walletConnect = screen.getByText('Scan with WalletConnect');

    expect(walletConnect).toBeInTheDocument();
  });
});
