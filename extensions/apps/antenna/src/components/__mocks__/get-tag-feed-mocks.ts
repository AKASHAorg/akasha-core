import {
  genBeamData,
  genContentBlock,
  genProfileByDID,
  getIndexedStream,
} from '@akashaorg/af-testing';
import {
  GetIndexedStreamDocument,
  GetBeamByIdDocument,
  GetProfileByDidDocument,
  GetContentBlockByIdDocument,
  GetAppsByIdDocument,
} from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import { BEAM_ID, TAG_FEED } from './constants';

export function getTagFeedMocks() {
  const beamData = genBeamData({
    beamId: BEAM_ID,
    authorProfileDID: TAG_FEED.authorProfileDID,
    reflectionsCount: TAG_FEED.reflectionsCount,
  });
  const profileData = genProfileByDID({ profileDID: TAG_FEED.authorProfileDID });
  return {
    mocks: [
      {
        request: {
          query: GetIndexedStreamDocument,
        },
        variableMatcher: () => true,
        result: {
          data: {
            node: getIndexedStream({ streamId: BEAM_ID }),
          },
        },
      },
      {
        request: {
          query: GetProfileByDidDocument,
          variables: { id: TAG_FEED.authorProfileDID },
        },
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
            node: beamData,
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
              authorProfileDID: TAG_FEED.authorProfileDID,
              content: TAG_FEED.content,
            }),
          },
        },
      })),
      {
        request: {
          query: GetAppsByIdDocument,
        },
        variableMatcher: () => true,
        result: {
          data: {
            node: {
              id: 'application-id',
              displayName: 'Za Antenna',
            },
          },
        },
      },
    ],
    beamData,
    profileData,
  };
}
