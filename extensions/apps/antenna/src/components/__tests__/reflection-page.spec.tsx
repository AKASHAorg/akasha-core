import React from 'react';
import ReflectionPage from '../pages/entry-page/reflection-page';
import userEvent from '@testing-library/user-event';
import * as useAkashaStore from '@akashaorg/ui-awf-hooks/lib/store/use-akasha-store';
import * as getEditorValueForTest from '../reflect-editor/get-editor-value-for-test';
import {
  screen,
  renderWithAllProviders,
  act,
  genAppProps,
  waitFor,
  getAllByTestId,
  getByText,
  getUserStore,
  genProfileByDID,
  genReflectionStream,
} from '@akashaorg/af-testing';
import { AnalyticsProvider } from '@akashaorg/ui-awf-hooks/lib/use-analytics';
import { mapReflectEntryData } from '@akashaorg/ui-awf-hooks';
import { formatRelativeTime, truncateDid } from '@akashaorg/design-system-core/lib/utils';
import {
  REFLECT_FEED,
  getReflectionPageMocks,
  getReflectEditorMocks,
  getReflectFeedMocks,
  BEAM_ID,
  REFLECTION_ID,
  REPLY_TO,
  NEW_REFLECTION_ID,
  AUTHENTICATED_DID,
  NEW_REFLECTION,
  AUTHENTICATED_PROFILE,
} from '../__mocks__';
import { GetReflectionStreamDocument } from '@akashaorg/ui-awf-hooks/lib/generated/apollo';

const {
  mocks,
  profileData: reflectionSectionProfileData,
  reflectionData,
} = getReflectionPageMocks();

describe('< ReflectionPage /> component', () => {
  const BaseComponent = (
    <AnalyticsProvider {...genAppProps()}>
      <ReflectionPage entryData={mapReflectEntryData(reflectionData)} />
    </AnalyticsProvider>
  );

  describe('should render reflection page', () => {
    const {
      mocks: reflectFeedMocks,
      profileData: reflectFeedProfileData,
      reflectionData,
      previewData,
    } = getReflectFeedMocks({
      beamId: BEAM_ID,
      reflectionId: REFLECTION_ID,
      authorProfileDID: REFLECT_FEED.authorProfileDID,
      reflectionContent: REFLECT_FEED.content,
      preview: {
        reflectionId: REFLECT_FEED.preview.reflectionId,
        content: REFLECT_FEED.preview.content,
      },
      replyTo: REPLY_TO,
      isReply: true,
    });

    beforeEach(async () => {
      await act(() => {
        renderWithAllProviders(
          BaseComponent,
          {},
          {
            mocks: [...reflectFeedMocks, ...mocks],
          },
        );
      });
    });

    it('should render reflection section', async () => {
      expect(screen.getByText(/Share your thoughts/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Reflect' })).toBeInTheDocument();
      await waitFor(() => {
        const reflectionSection = screen.getByTestId('reflection-section');
        const infoBox = getAllByTestId(reflectionSection, 'info-box')[0];
        expect(screen.getByText(/back to original beam/i)).toBeInTheDocument();
        expect(getAllByTestId(reflectionSection, 'avatar-source')[0]).toHaveAttribute(
          'srcset',
          reflectionSectionProfileData.akashaProfile.avatar.default.src,
        );
        expect(infoBox).toHaveTextContent(reflectionSectionProfileData.akashaProfile.name);
        expect(infoBox).toHaveTextContent(
          truncateDid(reflectionSectionProfileData.akashaProfile.did.id),
        );
        expect(infoBox).toHaveTextContent(formatRelativeTime(reflectionData.createdAt, 'en'));
      });
    });

    it('should render a reflection on reflect feed', async () => {
      await waitFor(() => {
        const reflectFeed = screen.getByTestId('reflect-feed');
        const infoBox = getAllByTestId(reflectFeed, 'info-box')[0];
        expect(getAllByTestId(reflectFeed, 'avatar-source')[0]).toHaveAttribute(
          'srcset',
          reflectFeedProfileData.akashaProfile.avatar.default.src,
        );
        expect(infoBox).toHaveTextContent(reflectFeedProfileData.akashaProfile.name);
        expect(infoBox).toHaveTextContent(truncateDid(reflectFeedProfileData.akashaProfile.did.id));
        expect(infoBox).toHaveTextContent(formatRelativeTime(reflectionData.createdAt, 'en'));
        expect(getByText(reflectFeed, REFLECT_FEED.content)).toBeInTheDocument();
      });
    });

    it('should render preview of a reflection on reflect feed', async () => {
      await waitFor(() => {
        const reflectFeed = screen.getByTestId('reflect-feed');
        const infoBox = getAllByTestId(reflectFeed, 'info-box')[1];
        expect(getAllByTestId(reflectFeed, 'avatar-source')[1]).toHaveAttribute(
          'srcset',
          reflectFeedProfileData.akashaProfile.avatar.default.src,
        );
        expect(infoBox).toHaveTextContent(reflectFeedProfileData.akashaProfile.name);
        expect(infoBox).toHaveTextContent(truncateDid(reflectFeedProfileData.akashaProfile.did.id));
        expect(infoBox).toHaveTextContent(
          formatRelativeTime(previewData.akashaReflectIndex.edges[0].node.createdAt, 'en'),
        );
        expect(getByText(reflectFeed, REFLECT_FEED.preview.content)).toBeInTheDocument();
      });
    });
  });

  describe('should publish reflection', () => {
    const {
      mocks: reflectFeedMocks,
      profileData: reflectFeedProfileData,
      reflectionData,
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
        userStore: getUserStore(),
        data: {
          authenticatedDID: AUTHENTICATED_DID,
          authenticatedProfile: AUTHENTICATED_PROFILE,
          authenticatedProfileError: null,
          authenticationError: null,
          isAuthenticating: false,
        },
      });
      jest.spyOn(getEditorValueForTest, 'getEditorValueForTest').mockReturnValue(NEW_REFLECTION);
      await act(() => {
        renderWithAllProviders(
          BaseComponent,
          {},
          {
            mocks: [
              ...reflectFeedMocks,
              ...mocks,
              ...getReflectEditorMocks({
                reflectionId: NEW_REFLECTION_ID,
                authorProfileDID: AUTHENTICATED_DID,
                content: NEW_REFLECTION,
              }),
              /*@TODO revisit this mock which is needed as a result of refetch on reflect editor */
              {
                request: {
                  query: GetReflectionStreamDocument,
                },
                variableMatcher: () => true,
                result: {
                  data: {
                    node: genReflectionStream({
                      beamId: BEAM_ID,
                      reflectionId: NEW_REFLECTION_ID,
                      isReply: true,
                      replyTo: REPLY_TO,
                    }),
                  },
                },
              },
              {
                request: {
                  query: GetReflectionStreamDocument,
                },
                variableMatcher: () => true,
                result: {
                  data: {
                    node: genReflectionStream({
                      beamId: BEAM_ID,
                      reflectionId: NEW_REFLECTION_ID,
                      isReply: true,
                      replyTo: REPLY_TO,
                    }),
                  },
                },
              },
            ],
          },
        );
      });
    });

    it('should render pending reflection card', async () => {
      const user = userEvent.setup();
      await user.click(screen.getByRole('button', { name: 'Reflect' }));
      await waitFor(() => {
        expect(screen.getByRole('textbox')).toHaveTextContent(NEW_REFLECTION);
      });
      await userEvent.click(screen.getByRole('button', { name: 'Reflect' }));
      await waitFor(() => {
        expect(screen.getByTestId('pending-reflect')).toBeInTheDocument();
      });
    });

    it('should render published reflection on reflect feed', async () => {
      const user = userEvent.setup();
      await user.click(screen.getByRole('button', { name: 'Reflect' }));
      await waitFor(() => {
        expect(screen.getByRole('textbox')).toHaveTextContent(NEW_REFLECTION);
      });
      await userEvent.click(screen.getByRole('button', { name: 'Reflect' }));
      await waitFor(() => {
        const reflectFeed = screen.getByTestId('reflect-feed');
        const infoBox = getAllByTestId(screen.getByTestId('reflect-feed'), 'info-box')[0];
        expect(infoBox).toHaveTextContent(reflectFeedProfileData.akashaProfile.name);
        expect(getAllByTestId(reflectFeed, 'avatar-source')[0]).toHaveAttribute(
          'srcset',
          reflectFeedProfileData.akashaProfile.avatar.default.src,
        );
        expect(infoBox).toHaveTextContent(truncateDid(reflectFeedProfileData.akashaProfile.did.id));
        expect(infoBox).toHaveTextContent(formatRelativeTime(reflectionData.createdAt, 'en'));
        expect(getByText(reflectFeed, NEW_REFLECTION)).toBeInTheDocument();
      });
    });
  });
});
