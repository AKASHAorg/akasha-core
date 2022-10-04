import * as React from 'react';
import FeedPage from '../feed-page/feed-page';

import {
  screen,
  renderWithAllProviders,
  genAppProps,
  genLoggedInState,
} from '@akashaorg/af-testing';
import { AnalyticsProvider } from '@akashaorg/ui-awf-hooks/lib/use-analytics';
import { act } from 'react-dom/test-utils';

describe('< FeedPage /> component', () => {
  const BaseComponent = ({ loginState }) => (
    <AnalyticsProvider {...genAppProps()}>
      <FeedPage {...genAppProps()} showLoginModal={jest.fn()} loginState={loginState} />
    </AnalyticsProvider>
  );

  it('should render feed page for anonymous users', async () => {
    await act(async () => {
      renderWithAllProviders(
        <BaseComponent loginState={{ isReady: false, pubKey: null, ethAddress: null }} />,
        {},
      );
    });
    expect(screen.getByText(/Welcome, fellow Ethereans!/i)).toBeInTheDocument();
  });

  it('should render feed page for authenticated users', async () => {
    await act(async () => {
      renderWithAllProviders(<BaseComponent loginState={genLoggedInState(true)} />, {});
    });

    expect(screen.getAllByTestId('avatar-image')).not.toBeNull();
    expect(screen.getByText(/Share your thoughts/i)).toBeInTheDocument();
  });
});
