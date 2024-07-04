import React from 'react';
import TagFeedPage from '../pages/tag-feed-page/tag-feed-page';
import userEvent from '@testing-library/user-event';
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
  TAG_NAME,
  getSubscriptionsMocks,
  getTagFeedMocks,
} from '../__mocks__';
import { formatRelativeTime, truncateDid } from '@akashaorg/design-system-core/lib/utils';
import { getTagFeedPageMocks } from '../__mocks__';

describe('< TagFeedPage /> component', () => {
  const BaseComponent = (
    <AnalyticsProvider {...genAppProps()}>
      <TagFeedPage tagName={TAG_NAME} />
    </AnalyticsProvider>
  );

  describe('should render tag feed page', () => {
    it('should render placeholder if there is no subscribed topic', async () => {
      const { mocks } = getTagFeedPageMocks({ count: 0 });
      await act(async () => {
        renderWithAllProviders(BaseComponent, {}, { mocks });
      });
      await waitFor(() => {
        expect(screen.getByText(TAG_NAME)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Subscribe' })).toBeInTheDocument();
      });
      expect(screen.getByText(/0 beam/i)).toBeInTheDocument();
      expect(screen.getByText(/there is no content found for the/i)).toBeInTheDocument();
      expect(
        screen.getByText(/be the first one to create a beam for this topic! 🚀/i),
      ).toBeInTheDocument();
    });
    it('should render a beam on tag feed for subscribed topic', async () => {
      const { mocks } = getTagFeedPageMocks({ count: 1 });
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

  describe('should subscribe to a topic', () => {
    beforeEach(async () => {
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
    });
    it('should change button text from subscribe to subscribed', async () => {
      const { mocks } = getTagFeedPageMocks({ count: 0 });
      const subscriptionMocks = getSubscriptionsMocks({ tag: TAG_NAME });
      await act(async () => {
        renderWithAllProviders(BaseComponent, {}, { mocks: [...subscriptionMocks, ...mocks] });
      });
      const user = userEvent.setup();
      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Subscribe' })).toBeInTheDocument();
      });
      user.click(screen.getByRole('button', { name: 'Subscribe' }));
      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Subscribed' })).toBeInTheDocument();
      });
    });

    it('should show subscribed text on button when a topic was previously subscribed', async () => {
      const { mocks } = getTagFeedPageMocks({ count: 0, tag: TAG_NAME });
      await act(async () => {
        renderWithAllProviders(BaseComponent, {}, { mocks });
      });
      await waitFor(() => {
        expect(screen.getByText(TAG_NAME)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Subscribed' })).toBeInTheDocument();
      });
    });
  });
});
