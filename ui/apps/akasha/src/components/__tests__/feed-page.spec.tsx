import React from 'react';
import FeedPage from '../pages/feed-page/feed-page';

import { screen, renderWithAllProviders, genAppProps, genUser } from '@akashaorg/af-testing';
import { AnalyticsProvider } from '@akashaorg/ui-awf-hooks/lib/use-analytics';
import { act } from 'react-dom/test-utils';

describe('< FeedPage /> component', () => {
  const BaseComponent = ({ loggedProfileData }) => (
    <AnalyticsProvider {...genAppProps()}>
      <FeedPage showLoginModal={jest.fn()} loggedProfileData={loggedProfileData} />
    </AnalyticsProvider>
  );

  it('should render feed page for anonymous users', async () => {
    await act(async () => {
      renderWithAllProviders(<BaseComponent loggedProfileData={null} />, {});
    });
    expect(screen.getByText(/Welcome, fellow Ethereans/i)).toBeInTheDocument();
  });

  it('should render feed page for authenticated users', async () => {
    await act(async () => {
      renderWithAllProviders(<BaseComponent loggedProfileData={genUser()} />, {});
    });
    expect(screen.getByText(/From Your Mind to the World/i)).toBeInTheDocument();
    expect(screen.getByText(/Start Beaming/i)).toBeInTheDocument();
  });
});
