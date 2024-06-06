import React from 'react';
import BeamPage from '../pages/entry-page/beam-page';
import {
  screen,
  renderWithAllProviders,
  act,
  genAppProps,
  genBeamData,
  waitFor,
  genContentBlock,
  genReflectionStream,
  genProfileByDID,
} from '@akashaorg/af-testing';
import { AnalyticsProvider } from '@akashaorg/ui-awf-hooks/lib/use-analytics';
import { AkashaBeamStreamModerationStatus } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { mapBeamEntryData } from '@akashaorg/ui-awf-hooks';
import {
  GetProfileByDidDocument,
  GetContentBlockByIdDocument,
  GetReflectionStreamDocument,
  GetBeamByIdDocument,
} from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import { formatRelativeTime, truncateDid } from '@akashaorg/design-system-core/lib/utils';
import { getReflectionFeedMocks } from '@akashaorg/ui-lib-feed/lib/__tests__/__mocks__/get-reflection-feed-mocks';

const BEAM_SECTION = {
  profileDID: 'did:pkh:eip155:11155111:0x1d3ac7a3d118f60a726f2dc52a614b2a6ae8dd00',
  beamId: 'kjzl6kcym7w8y5coci0at0tquy8zmferlog88ys14oj2qgyjy8soxzpbflmlzey',
  reflectionId: 'kjzl6kcym7w8y4wm6o3ikwiwttnsr6f7g0tkpqojlwsmp2r9wehvfapuvkfqqjn',
  content: 'Beam',
};

const REFLECT_FEED = {
  authorProfileDID: 'did:pkh:eip155:11155111:0x404ea3f8e4a5fcc8bdcdb7a74f25357113fdf989',
  beamId: BEAM_SECTION.beamId,
  reflectionId: 'kjzl6kcym7w8yaknlainhkpejftbsmffx9799hf1nrmkptk2gvqi7t27d3rp1ve',
  content: 'Reflection',
  preview: {
    reflectionId: 'kjzl6kcym7w8y70ra8llsn1l6qi4iy9d5g1acypb2uh9bl1bw479h92gygkmze3',
    content: 'Reflection Preview',
  },
};

describe('< BeamPage /> component', () => {
  const beamData = genBeamData({
    beamId: BEAM_SECTION.beamId,
    authorProfileDID: BEAM_SECTION.profileDID,
  });
  const profileData = genProfileByDID(BEAM_SECTION.profileDID);
  const BaseComponent = (
    <AnalyticsProvider {...genAppProps()}>
      <BeamPage
        beamStatus={AkashaBeamStreamModerationStatus.Ok}
        entryData={mapBeamEntryData(beamData)}
        beamId={BEAM_SECTION.beamId}
      />
    </AnalyticsProvider>
  );

  beforeEach(async () => {
    await act(async () => {
      renderWithAllProviders(
        BaseComponent,
        {},
        {
          mocks: [
            {
              request: {
                query: GetProfileByDidDocument,
              },
              variableMatcher: () => true,
              result: {
                data: {
                  node: profileData,
                },
              },
            },
            {
              request: {
                query: GetBeamByIdDocument,
              },
              variableMatcher: () => true,
              result: {
                data: {
                  node: genBeamData({
                    beamId: BEAM_SECTION.beamId,
                    authorProfileDID: BEAM_SECTION.profileDID,
                    reflectionsCount: BEAM_SECTION.reflectionCount,
                  }),
                },
              },
            },
            ...beamData.content.map(block => ({
              request: {
                query: GetContentBlockByIdDocument,
              },
              variableMatcher: () => true,
              result: {
                data: {
                  node: genContentBlock({
                    blockId: block.blockID,
                    authorProfileDID: BEAM_SECTION.profileDID,
                    content: BEAM_SECTION.content,
                  }),
                },
              },
            })),
            {
              request: {
                query: GetReflectionStreamDocument,
              },
              variableMatcher: () => true,
              result: {
                data: {
                  node: genReflectionStream({
                    beamId: BEAM_SECTION.beamId,
                    reflectionId: BEAM_SECTION.reflectionId,
                  }),
                },
              },
            },
            ...getReflectionFeedMocks({
              beamId: REFLECT_FEED.beamId,
              reflectionId: REFLECT_FEED.preview.reflectionId,
              authorProfileDID: REFLECT_FEED.authorProfileDID,
              reflectionContent: REFLECT_FEED.content,
              reflectionPreviewContent: REFLECT_FEED.preview.content,
            }),
          ],
        },
      );
    });
  });

  //TODO add test case for publishing reflection
  it('should render beam section', async () => {
    await waitFor(() => {
      expect(screen.getAllByTestId('info-box')[0]).toHaveTextContent(
        profileData.akashaProfile.name,
      );
      expect(screen.getAllByTestId('info-box')[0]).toHaveTextContent(
        truncateDid(profileData.akashaProfile.did.id),
      );
      expect(screen.getAllByTestId('info-box')[0]).toHaveTextContent(
        formatRelativeTime(beamData.createdAt, 'en'),
      );
      expect(screen.getByText(/Share your thoughts/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Reflect' })).toBeInTheDocument();
    });
  });

  it('should render reflect feed', async () => {
    await waitFor(() => {
      expect(screen.getByText(REFLECT_FEED.content)).toBeInTheDocument();
      expect(screen.getByText(REFLECT_FEED.preview.content)).toBeInTheDocument();
    });
  });
});
