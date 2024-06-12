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
  genProfileByDID,
  genReflectionStream,
} from '@akashaorg/af-testing';
import { AnalyticsProvider } from '@akashaorg/ui-awf-hooks/lib/use-analytics';
import { AkashaBeamStreamModerationStatus } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { mapBeamEntryData } from '@akashaorg/ui-awf-hooks';
import { formatRelativeTime, truncateDid } from '@akashaorg/design-system-core/lib/utils';
import { getReflectFeedMocks } from '@akashaorg/ui-lib-feed/lib/__mocks__/get-reflection-feed-mocks';
import {
  BEAM_ID,
  BEAM_SECTION,
  REFLECTION_ID,
  REFLECT_FEED,
  getBeamPageMocks,
  getReflectEditorMocks,
} from '../__mocks__';
import { GetReflectionStreamDocument } from '@akashaorg/ui-awf-hooks/lib/generated/apollo';

const { mocks, profileData: beamSectionProfileData, beamData } = getBeamPageMocks();

describe('< BeamPage /> component', () => {
  const BaseComponent = (
    <AnalyticsProvider {...genAppProps()}>
      <BeamPage
        beamStatus={AkashaBeamStreamModerationStatus.Ok}
        entryData={mapBeamEntryData(beamData)}
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
              ...mocks,
              ...getReflectEditorMocks({
                reflectionId: newReflectionId,
                authorProfileDID: authenticatedDID,
                content: newReflection,
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
                      reflectionId: newReflectionId,
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
                      reflectionId: newReflectionId,
                    }),
                  },
                },
              },
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
