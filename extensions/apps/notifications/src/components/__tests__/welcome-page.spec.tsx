import * as React from 'react';
import WelcomePage from '../pages/welcome-page';

import { screen, renderWithAllProviders, act, genAppProps } from '@akashaorg/af-testing';
import { AnalyticsProvider } from '@akashaorg/ui-awf-hooks/lib/use-analytics';

describe('< WelcomePage /> component', () => {
  const BaseComponent = (
    <AnalyticsProvider {...genAppProps()}>
      <WelcomePage finalStep={false} />
    </AnalyticsProvider>
  );
  beforeEach(async () => {
    await act(async () => {
      renderWithAllProviders(BaseComponent, {});
    });
  });

  it.skip("should render the notifications app's welcome page", async () => {
    expect(screen.getByText(/Uh-oh! You are not connected!/)).toBeInTheDocument();
  });
});
