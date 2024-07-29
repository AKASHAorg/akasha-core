import React from 'react';
import MyAntennaPage from '../pages/my-antenna-page';
import * as useAkashaStore from '@akashaorg/ui-awf-hooks/lib/store/use-akasha-store';
import {
  screen,
  renderWithAllProviders,
  genAppProps,
  getAuthenticationStore,
  waitFor,
  within,
} from '@akashaorg/af-testing';
import { AnalyticsProvider } from '@akashaorg/ui-awf-hooks/lib/use-analytics';
import {
  APOLLO_TYPE_POLICIES,
  AUTHENTICATED_DID,
  AUTHENTICATED_PROFILE,
  TAG_FEED,
  getMyAntennaPageMocks,
} from '../__mocks__';
import { formatRelativeTime, truncateDid } from '@akashaorg/design-system-core/lib/utils';
import { getTagFeedMocks } from '../__mocks__';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { InMemoryCache } from '@apollo/client';

const { mocks } = getMyAntennaPageMocks();

const baseComponent = (mocks?: Readonly<MockedResponse<unknown, unknown>[]> | undefined) => (
  <MockedProvider mocks={mocks} cache={new InMemoryCache(APOLLO_TYPE_POLICIES)}>
    <AnalyticsProvider {...genAppProps()}>
      <MyAntennaPage />
    </AnalyticsProvider>
  </MockedProvider>
);

describe('< MyAntennaPage /> component', () => {
  describe('should render my antenna page', () => {
    it('should render placeholder if there are no subscribed topics', async () => {
      renderWithAllProviders(baseComponent(), {});
      expect(screen.getByText(/add some magic to your feed/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Customize My Feed' })).toBeInTheDocument();
    });

    it('should render a beam on tag feed for subscribed topics', async () => {
      const { mocks: tagFeedMocks, profileData, beamData } = getTagFeedMocks();
      jest.spyOn(useAkashaStore, 'useAkashaStore').mockReturnValue({
        authenticationStore: getAuthenticationStore(),
        data: {
          authenticatedDID: AUTHENTICATED_DID,
          authenticatedProfile: AUTHENTICATED_PROFILE,
          authenticatedProfileError: null,
          authenticationError: null,
          isAuthenticating: false,
        },
      });
      renderWithAllProviders(baseComponent([...mocks, ...tagFeedMocks]), {});
      expect(await screen.findByText(/your customized view of akasha world/i)).toBeInTheDocument();
      const tagFeed = screen.getByTestId('tag-feed');
      await waitFor(() =>
        expect(within(tagFeed).getByTestId('avatar-source')).toHaveAttribute(
          'srcset',
          profileData.akashaProfile.avatar.default.src,
        ),
      );
      const infoBox = within(tagFeed).getByTestId('info-box');
      expect(within(tagFeed).getByTestId('reflections-count')).toHaveTextContent(
        String(TAG_FEED.reflectionsCount),
      );
      await waitFor(() => expect(infoBox).toHaveTextContent(profileData.akashaProfile.name));
      expect(infoBox).toHaveTextContent(truncateDid(profileData.akashaProfile.did.id));
      expect(infoBox).toHaveTextContent(formatRelativeTime(beamData.createdAt, 'en'));
      expect(screen.getByText(/published via/i)).toBeInTheDocument();
    });
  });
});
