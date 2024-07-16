import { genBeamData, genContentBlock, genProfileByDID } from '@akashaorg/af-testing';
import {
  GetProfileByDidDocument,
  GetContentBlockByIdDocument,
} from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import { BEAM_ID, BEAM_SECTION } from './constants';

export function getBeamSectionMocks() {
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
    ],
    beamData,
    profileData,
  };
}
