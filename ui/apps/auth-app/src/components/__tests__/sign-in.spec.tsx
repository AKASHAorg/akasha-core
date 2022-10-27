import * as React from 'react';
import SignIn from '../sign-in';

import { act, screen, renderWithAllProviders, genAppProps } from '@akashaorg/af-testing';
import { AnalyticsProvider } from '@akashaorg/ui-awf-hooks/lib/use-analytics';

describe('< SignIn /> component', () => {
  const BaseComponent = (
    <AnalyticsProvider {...genAppProps()}>
      <SignIn {...genAppProps()} />;
    </AnalyticsProvider>
  );
  beforeEach(async () => {
    await act(async () => {
      renderWithAllProviders(BaseComponent, {});
    });
  });

  it('should render sign in page', async () => {
    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
  });
});
