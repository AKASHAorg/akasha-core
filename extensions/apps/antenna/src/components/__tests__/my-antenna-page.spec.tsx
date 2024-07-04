import React from 'react';
import MyAntennaPage from '../pages/my-antenna-page';
import * as useAkashaStore from '@akashaorg/ui-awf-hooks/lib/store/use-akasha-store';
import {
  screen,
  renderWithAllProviders,
  act,
  genAppProps,
  getUserStore,
  waitFor,
  getByTestId,
} from '@akashaorg/af-testing';
import { AnalyticsProvider } from '@akashaorg/ui-awf-hooks/lib/use-analytics';
import {
  AUTHENTICATED_DID,
  AUTHENTICATED_PROFILE,
  TAG_FEED,
  getMyAntennaPageMocks,
} from '../__mocks__';
import { formatRelativeTime, truncateDid } from '@akashaorg/design-system-core/lib/utils';
import { getTagFeedMocks } from '../__mocks__';

const { mocks } = getMyAntennaPageMocks();

describe('< MyAntennaPage /> component', () => {
  const BaseComponent = (
    <AnalyticsProvider {...genAppProps()}>
      <MyAntennaPage />
    </AnalyticsProvider>
  );

  describe('should render my antenna page', () => {
    it('should render placeholder if there is no subscribed topic', async () => {
      await act(async () => {
        renderWithAllProviders(BaseComponent, {});
      });
      expect(screen.getByText(/add some magic to your feed/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Customize My Feed' })).toBeInTheDocument();
    });
    it('should render a beam on tag feed for subscribed topic', async () => {
      const { mocks: tagFeedMocks, profileData, beamData } = getTagFeedMocks();
      jest.spyOn(useAkashaStore, 'useAkashaStore').mockReturnValue({
        userStore: getUserStore(),
        data: {
          authenticatedDID: AUTHENTICATED_DID,
          authenticatedProfile: AUTHENTICATED_PROFILE,
          authenticatedProfileError: null,
          authenticationError: null,
          isAuthenticating: false,
        },
      });
      await act(async () => {
        renderWithAllProviders(
          BaseComponent,
          {},
          {
            mocks: [...tagFeedMocks, ...mocks],
          },
        );
      });
      await waitFor(() => {
        expect(screen.getByText(/your customized view of akasha world/i)).toBeInTheDocument();
        const tagFeed = screen.getByTestId('tag-feed');
        const infoBox = getByTestId(tagFeed, 'info-box');
        expect(getByTestId(tagFeed, 'reflections-count')).toHaveTextContent(
          String(TAG_FEED.reflectionsCount),
        );
        expect(getByTestId(tagFeed, 'avatar-source')).toHaveAttribute(
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
});
