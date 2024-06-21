import React from 'react';
import GlobalAntennaPage from '../pages/global-antenna-page';
import {
  screen,
  renderWithAllProviders,
  act,
  genAppProps,
  waitFor,
  getByTestId,
} from '@akashaorg/af-testing';
import { AnalyticsProvider } from '@akashaorg/ui-awf-hooks/lib/use-analytics';
import { formatRelativeTime, truncateDid } from '@akashaorg/design-system-core/lib/utils';
import { BEAM_FEED, getBeamFeedMocks } from '../__mocks__';

const { mocks, profileData, beamData } = getBeamFeedMocks();

describe('< GlobalAntennaPage /> component', () => {
  const BaseComponent = (
    <AnalyticsProvider {...genAppProps()}>
      <GlobalAntennaPage />
    </AnalyticsProvider>
  );

  beforeEach(async () => {
    await act(() => {
      renderWithAllProviders(BaseComponent, {}, { mocks });
    });
  });

  describe('should render global antenna page', () => {
    it('should render editor placeholder', async () => {
      expect(screen.getByText(/from your mind to the world 🧠 🌏 ✨/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Start Beaming' })).toBeInTheDocument();
    });

    it('should render a beam on beam feed', async () => {
      await waitFor(() => {
        const beamFeed = screen.getByTestId('beam-feed');
        const infoBox = getByTestId(beamFeed, 'info-box');
        expect(getByTestId(beamFeed, 'reflections-count')).toHaveTextContent(
          String(BEAM_FEED.reflectionsCount),
        );
        expect(getByTestId(beamFeed, 'avatar-source')).toHaveAttribute(
          'srcset',
          profileData.akashaProfile.avatar.default.src,
        );
        expect(infoBox).toHaveTextContent(profileData.akashaProfile.name);
        expect(infoBox).toHaveTextContent(truncateDid(profileData.akashaProfile.did.id));
        expect(infoBox).toHaveTextContent(formatRelativeTime(beamData.createdAt, 'en'));
        expect(screen.getByText(/published via/i)).toBeInTheDocument();
      });
    });
  });
  //TODO: update extensions point mock and add test for beaming
});
