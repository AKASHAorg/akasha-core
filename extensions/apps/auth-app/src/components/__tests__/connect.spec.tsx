import * as React from 'react';
import ChooseProvider from '../pages/choose-provider';

import { act, screen, renderWithAllProviders, genAppProps } from '@akashaorg/af-testing';
import { AnalyticsProvider } from '@akashaorg/ui-awf-hooks/lib/use-analytics';
import { MemoryRouter as Router } from 'react-router-dom';

describe('< SignIn /> component', () => {
  const BaseComponent = (
    <Router initialEntries={['/@akashaorg/app-auth-ewa/provider']}>
      <AnalyticsProvider {...genAppProps()}>
        <ChooseProvider />;
      </AnalyticsProvider>
    </Router>
  );
  beforeEach(async () => {
    await act(async () => {
      renderWithAllProviders(BaseComponent, {});
    });
  });

  it.skip('should render sign in page', async () => {
    expect(screen.getByText(/Welcome to AKASHA World/i)).toBeInTheDocument();
    expect(screen.getByText('Connect your wallet')).toBeInTheDocument();
  });

  it.skip('has a connect option', async () => {
    const walletConnect = screen.getByText(/Connect your wallet using/i);
    expect(walletConnect).toBeInTheDocument();
  });
});
