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
} from '@akashaorg/af-testing';
import { AnalyticsProvider } from '@akashaorg/ui-awf-hooks/lib/use-analytics';
import { mapReflectEntryData } from '@akashaorg/ui-awf-hooks';
import { formatRelativeTime, truncateDid } from '@akashaorg/design-system-core/lib/utils';
import { getReflectFeedMocks } from '@akashaorg/ui-lib-feed/lib/__mocks__/get-reflection-feed-mocks';
import {
  REFLECT_FEED,
  getReflectionPageMocks,
  getReflectEditorMocks,
  BEAM_ID,
  REFLECTION_ID,
  REPLY_TO,
} from '../__mocks__';

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
    const newReflection = 'New reflection';
    const newReflectionId = 'kjzl6kcym7w8ya09ffxtm0db3cvf9rt7fisv4lud1ksyf4sfw55o9dqqc6lbk5l';
    const authenticatedDID = 'did:pkh:eip155:11155111:0x3dd4dcf15396f2636719447247c45bb3a9506e50';
    const authenticatedProfile = genProfileByDID({ profileDID: authenticatedDID }).akashaProfile;
    const {
      mocks: reflectFeedMocks,
      profileData: reflectFeedProfileData,
      reflectionData,
    } = getReflectFeedMocks({
      beamId: BEAM_ID,
      reflectionId: newReflectionId,
      authorProfileDID: authenticatedDID,
      reflectionContent: newReflection,
      replyTo: REPLY_TO,
      isReply: true,
    });

    beforeEach(async () => {
      jest.spyOn(useAkashaStore, 'useAkashaStore').mockReturnValue({
        userStore: getUserStore(),
        data: {
          authenticatedDID,
          authenticatedProfile,
          authenticatedProfileError: null,
          authenticationError: null,
          isAuthenticating: false,
        },
      });
      jest.spyOn(getEditorValueForTest, 'getEditorValueForTest').mockReturnValue(newReflection);
      await act(() => {
        renderWithAllProviders(
          BaseComponent,
          {},
          {
            mocks: [
              ...reflectFeedMocks,
              ...getReflectEditorMocks({
                reflectionId: newReflectionId,
                beamId: BEAM_ID,
                authorProfileDID: authenticatedDID,
                content: newReflection,
              }),
              ...mocks,
            ],
          },
        );
      });
    });
    it('should publish a reflection and render it on reflect feed', async () => {
      const user = userEvent.setup();
      await user.click(screen.getByRole('button', { name: 'Reflect' }));
      await waitFor(() => {
        expect(screen.getByRole('textbox')).toHaveTextContent(newReflection);
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
        expect(getByText(reflectFeed, newReflection)).toBeInTheDocument();
      });
    });
  });
});
