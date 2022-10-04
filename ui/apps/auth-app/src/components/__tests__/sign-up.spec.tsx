import * as React from 'react';
import SignUp from '../sign-up';

import { act, screen, renderWithAllProviders, genAppProps } from '@akashaorg/af-testing';
import { AnalyticsProvider } from '@akashaorg/ui-awf-hooks/lib/use-analytics';

describe('< SignUp /> component', () => {
  const BaseComponent = (
    <AnalyticsProvider {...genAppProps()}>
      <SignUp {...genAppProps()} />;
    </AnalyticsProvider>
  );
  beforeEach(async () => {
    await act(async () => {
      renderWithAllProviders(BaseComponent, {});
    });
  });

  it('should render sign up page', async () => {
    expect(
      screen.getByText(
        /We are currently in a private alpha. You need the invitation code we emailed you to sign up./i,
      ),
    ).toBeInTheDocument();
  });
});
