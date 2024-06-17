import {
  genBeamData,
  genContentBlock,
  genReflectionStream,
  genProfileByDID,
} from '@akashaorg/af-testing';
import {
  GetProfileByDidDocument,
  GetBeamByIdDocument,
  GetContentBlockByIdDocument,
  GetReflectionStreamDocument,
} from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import { BEAM_ID, BEAM_SECTION, REFLECT_FEED } from './constants';

export function getBeamPageMocks() {
  const beamData = genBeamData({
    beamId: BEAM_ID,
    authorProfileDID: BEAM_SECTION.authorProfileDID,
    reflectionsCount: BEAM_SECTION.reflectionsCount,
  });
  const profileData = genProfileByDID({ profileDID: BEAM_SECTION.authorProfileDID });
  return {
    mocks: [
      {
        request: {
          query: GetProfileByDidDocument,
          variables: { id: BEAM_SECTION.authorProfileDID },
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
              authorProfileDID: BEAM_SECTION.authorProfileDID,
              content: BEAM_SECTION.content,
            }),
          },
        },
      })),
      {
        request: {
          query: GetReflectionStreamDocument,
          variables: {
            first: 1,
            indexer: undefined,
            filters: {
              where: {
                beamID: {
                  equalTo: BEAM_ID,
                },
              },
            },
          },
        },
        result: {
          data: {
            node: genReflectionStream({
              beamId: BEAM_ID,
              reflectionId: REFLECT_FEED.reflectionId,
            }),
          },
        },
      },
    ],
    beamData,
    profileData,
  };
}
