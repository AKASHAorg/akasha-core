import React from 'react';
import GlobalAntennaPage from '../pages/global-antenna-page';
import {
  screen,
  genAppProps,
  waitFor,
  renderWithAllProviders,
  within,
} from '@akashaorg/af-testing';
import { AnalyticsProvider } from '@akashaorg/ui-awf-hooks/lib/use-analytics';
import { formatRelativeTime, truncateDid } from '@akashaorg/design-system-core/lib/utils';
import { APOLLO_TYPE_POLICIES, BEAM_FEED, getBeamFeedMocks } from '../__mocks__';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { InMemoryCache } from '@apollo/client';

const { mocks, profileData, beamData } = getBeamFeedMocks();

const baseComponent = (mocks: Readonly<MockedResponse<unknown, unknown>[]> | undefined) => (
  <MockedProvider mocks={mocks} cache={new InMemoryCache(APOLLO_TYPE_POLICIES)}>
    <AnalyticsProvider {...genAppProps()}>
      <GlobalAntennaPage />
    </AnalyticsProvider>
  </MockedProvider>
);

describe('< GlobalAntennaPage /> component', () => {
  describe('should render global antenna page', () => {
    it('should render editor placeholder', async () => {
      renderWithAllProviders(baseComponent(mocks), {});
      expect(screen.getByText(/from your mind to the world 🧠 🌏 ✨/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Start Beaming' })).toBeInTheDocument();
    });

    it('should render a beam on beam feed', async () => {
      renderWithAllProviders(baseComponent(mocks), {});
      const beamFeed = screen.getByTestId('beam-feed');
      await waitFor(() =>
        expect(within(beamFeed).getByTestId('reflections-count')).toHaveTextContent(
          String(BEAM_FEED.reflectionsCount),
        ),
      );
      expect(within(beamFeed).getByTestId('avatar-source')).toHaveAttribute(
        'srcset',
        profileData.akashaProfile.avatar.default.src,
      );
      const infoBox = within(beamFeed).getByTestId('info-box');
      await waitFor(() => expect(infoBox).toHaveTextContent(profileData.akashaProfile.name));
      expect(infoBox).toHaveTextContent(truncateDid(profileData.akashaProfile.did.id));
      expect(infoBox).toHaveTextContent(formatRelativeTime(beamData.createdAt, 'en'));
      expect(screen.getByText(/published via/i)).toBeInTheDocument();
    });
  });
});
