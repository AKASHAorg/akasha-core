import React from 'react';
import ReflectionPage from '../pages/entry-page/reflection-page';
import userEvent from '@testing-library/user-event';
import * as useAkashaStore from '@akashaorg/ui-awf-hooks/lib/store/use-akasha-store';
import * as getEditorValueForTest from '../reflect-editor/get-editor-value-for-test';
import {
  screen,
  renderWithAllProviders,
  genAppProps,
  waitFor,
  getAuthenticationStore,
  within,
} from '@akashaorg/af-testing';
import { AnalyticsProvider } from '@akashaorg/ui-awf-hooks/lib/use-analytics';
import { mapReflectEntryData } from '@akashaorg/ui-awf-hooks';
import { formatRelativeTime, truncateDid } from '@akashaorg/design-system-core/lib/utils';
import {
  REFLECT_FEED,
  getReflectionSectionMocks,
  getReflectEditorMocks,
  getReflectFeedMocks,
  BEAM_ID,
  REPLY_TO,
  NEW_REFLECTION_ID,
  AUTHENTICATED_DID,
  NEW_REFLECTION,
  AUTHENTICATED_PROFILE,
  APOLLO_TYPE_POLICIES,
  getEmptyReflectionStreamMock,
  getPendingReflectMock,
} from '../__mocks__';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { InMemoryCache } from '@apollo/client';

const {
  mocks: reflectionSectionMocks,
  profileData: reflectionSectionProfileData,
  reflectionData,
} = getReflectionSectionMocks();

const baseComponent = (
  mocks: Readonly<MockedResponse<unknown, unknown>[]> | undefined,
  isActive?: boolean,
) => (
  <MockedProvider mocks={mocks} cache={new InMemoryCache(APOLLO_TYPE_POLICIES)}>
    <AnalyticsProvider {...genAppProps()}>
      <ReflectionPage
        isActive={isActive ?? true}
        reflectionData={mapReflectEntryData(reflectionData)}
      />
    </AnalyticsProvider>
  </MockedProvider>
);

describe('< ReflectionPage /> component', () => {
  describe('should render reflection page', () => {
    const {
      mocks: reflectFeedMocks,
      profileData: reflectFeedProfileData,
      reflectionData,
      previewData,
    } = getReflectFeedMocks({
      beamId: BEAM_ID,
      reflectionId: REFLECT_FEED.reflectionId,
      authorProfileDID: REFLECT_FEED.authorProfileDID,
      reflectionContent: REFLECT_FEED.content,
      preview: {
        reflectionId: REFLECT_FEED.preview.reflectionId,
        content: REFLECT_FEED.preview.content,
      },
      replyTo: REPLY_TO,
      isReply: true,
    });

    it('should render reflection section', async () => {
      renderWithAllProviders(
        baseComponent([...reflectionSectionMocks, ...getEmptyReflectionStreamMock()]),
        {},
      );
      expect(await screen.findByRole('button', { name: 'Reflect' })).toBeInTheDocument();
      expect(screen.getByText(/Share your thoughts/i)).toBeInTheDocument();
      const reflectionSection = screen.getByTestId('reflection-section');
      await waitFor(() =>
        expect(within(reflectionSection).getAllByTestId('avatar-source')[0]).toHaveAttribute(
          'srcset',
          reflectionSectionProfileData.akashaProfile.avatar.default.src,
        ),
      );
      const infoBox = within(reflectionSection).getAllByTestId('info-box')[0];
      await waitFor(() =>
        expect(infoBox).toHaveTextContent(reflectionSectionProfileData.akashaProfile.name),
      );
      expect(infoBox).toHaveTextContent(
        truncateDid(reflectionSectionProfileData.akashaProfile.did.id),
      );
      expect(infoBox).toHaveTextContent(formatRelativeTime(reflectionData.createdAt, 'en'));
    });

    it('should render a reflection on reflect feed', async () => {
      renderWithAllProviders(baseComponent([...reflectionSectionMocks, ...reflectFeedMocks]), {});
      const reflectFeed = screen.getByTestId('reflect-feed');
      await waitFor(() => within(reflectFeed).getByTestId('reflection-card'));
      //we have a reflection and a preview on the reflect feed and here we want to assert for the reflection author's profile info
      await waitFor(() =>
        expect(within(reflectFeed).getAllByTestId('avatar-source')[0]).toHaveAttribute(
          'srcset',
          reflectFeedProfileData.akashaProfile.avatar.default.src,
        ),
      );
      const infoBox = within(reflectFeed).getAllByTestId('info-box')[0];
      await waitFor(() =>
        expect(infoBox).toHaveTextContent(reflectFeedProfileData.akashaProfile.name),
      );
      expect(await within(reflectFeed).findByText(REFLECT_FEED.content)).toBeInTheDocument();
      expect(infoBox).toHaveTextContent(truncateDid(reflectFeedProfileData.akashaProfile.did.id));
      expect(infoBox).toHaveTextContent(formatRelativeTime(reflectionData.createdAt, 'en'));
    });

    it('should render preview of a reflection on reflect feed', async () => {
      renderWithAllProviders(baseComponent([...reflectionSectionMocks, ...reflectFeedMocks]), {});
      const reflectFeed = screen.getByTestId('reflect-feed');
      //we have a reflection and a preview on the reflect feed and here we want to assert for the reflection preview author's profile info
      await waitFor(() =>
        expect(within(reflectFeed).getAllByTestId('avatar-source')[1]).toHaveAttribute(
          'srcset',
          reflectFeedProfileData.akashaProfile.avatar.default.src,
        ),
      );
      const infoBox = within(reflectFeed).getAllByTestId('info-box')[1];
      await waitFor(() =>
        expect(infoBox).toHaveTextContent(reflectFeedProfileData.akashaProfile.name),
      );
      expect(infoBox).toHaveTextContent(truncateDid(reflectFeedProfileData.akashaProfile.did.id));
      expect(infoBox).toHaveTextContent(
        formatRelativeTime(previewData.akashaReflectIndex.edges[0].node.createdAt, 'en'),
      );
      expect(
        await within(reflectFeed).findByText(REFLECT_FEED.preview.content),
      ).toBeInTheDocument();
    });

    it('should disable reflection editor when the beam is delisted', async () => {
      const { mocks } = getReflectionSectionMocks({
        isBeamActive: false,
      });
      renderWithAllProviders(
        baseComponent([...mocks, ...getEmptyReflectionStreamMock()], false),
        {},
      );
      expect(screen.queryByRole('button', { name: 'Reflect' })).not.toBeInTheDocument();
      expect(screen.queryByText(/Share your thoughts/i)).not.toBeInTheDocument();
    });
  });

  describe('should publish reflection', () => {
    const reflectEditorMocks = getReflectEditorMocks({
      reflectionId: NEW_REFLECTION_ID,
      authorProfileDID: AUTHENTICATED_DID,
      content: NEW_REFLECTION,
      reflection: REPLY_TO,
      isReply: true,
    });

    const {
      mocks: reflectFeedMocks,
      reflectionData: newReflectionData,
      profileData: reflectFeedProfileData,
    } = getReflectFeedMocks({
      beamId: BEAM_ID,
      reflectionId: NEW_REFLECTION_ID,
      authorProfileDID: AUTHENTICATED_DID,
      reflectionContent: NEW_REFLECTION,
      replyTo: REPLY_TO,
      isReply: true,
    });

    beforeEach(async () => {
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
      jest.spyOn(getEditorValueForTest, 'getEditorValueForTest').mockReturnValue(NEW_REFLECTION);
    });

    it('should render pending reflect card', async () => {
      renderWithAllProviders(
        baseComponent([
          ...reflectionSectionMocks,
          ...getEmptyReflectionStreamMock(),
          ...reflectEditorMocks,
          ...getPendingReflectMock(AUTHENTICATED_DID),
        ]),
        {},
      );
      const user = userEvent.setup();
      const reflectButton = await screen.findByRole('button', { name: 'Reflect' });
      user.click(reflectButton);
      await waitFor(() => expect(reflectButton).toBeInTheDocument());
      await waitFor(() => expect(screen.getByRole('textbox')).toHaveTextContent(NEW_REFLECTION));
      user.click(screen.getByRole('button', { name: 'Reflect' }));
      expect(await screen.findByTestId('pending-reflection-card')).toBeInTheDocument();
    });

    it('should render published reflection on reflect feed', async () => {
      renderWithAllProviders(
        baseComponent([
          ...reflectionSectionMocks,
          ...getEmptyReflectionStreamMock(),
          ...reflectEditorMocks,
          ...reflectFeedMocks,
        ]),
        {},
      );
      const user = userEvent.setup();
      const reflectButton = await screen.findByRole('button', { name: 'Reflect' });
      const reflectFeed = screen.getByTestId('reflect-feed');
      user.click(reflectButton);
      await waitFor(() => expect(reflectButton).toBeInTheDocument());
      await waitFor(() => expect(screen.getByRole('textbox')).toHaveTextContent(NEW_REFLECTION));
      user.click(screen.getByRole('button', { name: 'Reflect' }));
      expect(await screen.findByTestId('pending-reflection-card')).toBeInTheDocument();
      expect(await within(reflectFeed).findByTestId('reflection-card')).toBeInTheDocument();
      expect(within(reflectFeed).getByText(NEW_REFLECTION)).toBeInTheDocument();
      const infoBox = within(reflectFeed).getByTestId('info-box');
      await waitFor(() =>
        expect(infoBox).toHaveTextContent(reflectFeedProfileData.akashaProfile.name),
      );
      expect(await within(reflectFeed).findByTestId('avatar-source')).toHaveAttribute(
        'srcset',
        reflectFeedProfileData.akashaProfile.avatar.default.src,
      );
      expect(infoBox).toHaveTextContent(truncateDid(reflectFeedProfileData.akashaProfile.did.id));
      expect(infoBox).toHaveTextContent(formatRelativeTime(newReflectionData.createdAt, 'en'));
    });
  });
});
