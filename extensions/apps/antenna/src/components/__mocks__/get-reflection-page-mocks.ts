import { genProfileByDID, genReflectionData } from '@akashaorg/af-testing';
import { GetProfileByDidDocument } from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import { REFLECTION_ID, REFLECTION_SECTION } from './constants';

export function getReflectionSectionMocks() {
  const reflectionData = genReflectionData({
    reflectionId: REFLECTION_ID,
    authorProfileDID: REFLECTION_SECTION.authorProfileDID,
    content: REFLECTION_SECTION.content,
  });
  const profileData = genProfileByDID({ profileDID: REFLECTION_SECTION.authorProfileDID });
  return {
    mocks: [
      {
        request: {
          query: GetProfileByDidDocument,
          variables: { id: REFLECTION_SECTION.authorProfileDID },
        },
        result: {
          data: {
            node: profileData,
          },
        },
      },
    ],
    reflectionData,
    profileData,
  };
}
