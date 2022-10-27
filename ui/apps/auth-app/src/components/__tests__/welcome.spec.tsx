import * as React from 'react';
import Welcome from '../welcome';

import { act, screen, renderWithAllProviders, genAppProps } from '@akashaorg/af-testing';
import { AnalyticsProvider } from '@akashaorg/ui-awf-hooks/lib/use-analytics';

describe('< Welcome /> component', () => {
  const BaseComponent = (
    <AnalyticsProvider {...genAppProps()}>
      <Welcome {...genAppProps()} />;
    </AnalyticsProvider>
  );
  beforeEach(async () => {
    await act(async () => {
      renderWithAllProviders(BaseComponent, {});
    });
  });

  it('should render welcome page', async () => {
    expect(
      screen.getByText(/Congratulations, you are the newest member of Ethereum World!/i),
    ).toBeInTheDocument();
  });
});
