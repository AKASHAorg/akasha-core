import * as React from 'react';
import FeedPage from '../feed-page/feed-page';

import { screen, renderWithAllProviders, genAppProps } from '@akashaorg/af-testing';
import { act } from 'react-dom/test-utils';
import { AnalyticsProvider } from '@akashaorg/ui-awf-hooks/lib/use-analytics';

describe('< FeedPage /> component', () => {
  const BaseComponent = (
    <AnalyticsProvider {...genAppProps()}>
      <FeedPage
        {...genAppProps()}
        showLoginModal={jest.fn()}
        loginState={{ isReady: true, pubKey: '0x00', ethAddress: '0x00' }}
      />
    </AnalyticsProvider>
  );
  beforeEach(async () => {
    await act(async () => {
      renderWithAllProviders(BaseComponent, {});
    });
  });

  it('should be defined', async () => {
    expect(screen.getByText(/Share your thoughts/)).toBeInTheDocument();
  });
});
