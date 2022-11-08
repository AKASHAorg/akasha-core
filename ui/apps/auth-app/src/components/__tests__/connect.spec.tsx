import * as React from 'react';
import Connect, { baseAppLegalRoute } from '../connect';

import { act, screen, renderWithAllProviders, genAppProps } from '@akashaorg/af-testing';
import { AnalyticsProvider } from '@akashaorg/ui-awf-hooks/lib/use-analytics';

describe('< SignIn /> component', () => {
  const BaseComponent = (
    <AnalyticsProvider {...genAppProps()}>
      <Connect {...genAppProps()} />;
    </AnalyticsProvider>
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

  it('has correct link', async () => {
    const coc = screen.getByText('Code of Conduct');

    expect(coc).toHaveAttribute('href', `${baseAppLegalRoute}/code-of-conduct`);
  });
});
