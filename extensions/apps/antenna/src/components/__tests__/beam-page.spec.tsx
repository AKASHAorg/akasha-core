import React from 'react';
import BeamPage from '../pages/entry-page/beam-page';
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
  getByTestId,
  getUserStore,
} from '@akashaorg/af-testing';
import { AnalyticsProvider } from '@akashaorg/ui-awf-hooks/lib/use-analytics';
import { AkashaBeamStreamModerationStatus } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { mapBeamEntryData } from '@akashaorg/ui-awf-hooks';
import { formatRelativeTime, truncateDid } from '@akashaorg/design-system-core/lib/utils';
import {
  AUTHENTICATED_DID,
  AUTHENTICATED_PROFILE,
  BEAM_ID,
  BEAM_SECTION,
  NEW_REFLECTION,
  NEW_REFLECTION_ID,
  REFLECTION_ID,
  REFLECT_FEED,
  getBeamPageMocks,
  getReflectEditorMocks,
  getReflectFeedMocks,
} from '../__mocks__';

const { mocks, profileData: beamSectionProfileData, beamData } = getBeamPageMocks();

describe('< BeamPage /> component', () => {
  const BaseComponent = (
    <AnalyticsProvider {...genAppProps()}>
      <BeamPage
        beamStatus={AkashaBeamStreamModerationStatus.Ok}
        beamData={mapBeamEntryData(beamData)}
        beamId={BEAM_ID}
      />
    </AnalyticsProvider>
  );

  describe('should render beam page', () => {
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
    });

    beforeEach(async () => {
      await act(async () => {
        renderWithAllProviders(
          BaseComponent,
          {},
          {
            mocks: [...reflectFeedMocks, ...mocks],
          },
        );
      });
    });

    it('should render beam section', async () => {
      expect(screen.getByText(/Share your thoughts/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Reflect' })).toBeInTheDocument();
      await waitFor(() => {
        const beamSection = screen.getByTestId('beam-section');
        const infoBox = getAllByTestId(beamSection, 'info-box')[0];
        expect(getByTestId(beamSection, 'reflections-count')).toHaveTextContent(
          String(BEAM_SECTION.reflectionsCount),
        );
        expect(getAllByTestId(beamSection, 'avatar-source')[0]).toHaveAttribute(
          'srcset',
          beamSectionProfileData.akashaProfile.avatar.default.src,
        );
        expect(infoBox).toHaveTextContent(beamSectionProfileData.akashaProfile.name);
        expect(infoBox).toHaveTextContent(truncateDid(beamSectionProfileData.akashaProfile.did.id));
        expect(infoBox).toHaveTextContent(formatRelativeTime(beamData.createdAt, 'en'));
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
      await act(async () => {
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
            ],
          },
        );
      });
    });
    it('should render pending reflection card', async () => {
      const user = userEvent.setup();
      user.click(screen.getByRole('button', { name: 'Reflect' }));
      await waitFor(() => {
        expect(screen.getByRole('textbox')).toHaveTextContent(NEW_REFLECTION);
      });
      user.click(screen.getByRole('button', { name: 'Reflect' }));
      await waitFor(() => expect(screen.getByTestId('pending-reflect')).toBeInTheDocument());
    });

    it('should render published reflection on reflect feed', async () => {
      const user = userEvent.setup();
      user.click(screen.getByRole('button', { name: 'Reflect' }));
      await waitFor(() => expect(screen.getByRole('textbox')).toHaveTextContent(NEW_REFLECTION));
      user.click(screen.getByRole('button', { name: 'Reflect' }));
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
