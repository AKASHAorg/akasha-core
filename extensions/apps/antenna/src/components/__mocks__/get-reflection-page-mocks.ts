import { genProfileByDID, genReflectionData } from '@akashaorg/af-testing';
import {
  GetProfileByDidDocument,
  GetReflectionByIdDocument,
} from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import { REFLECTION_ID, REFLECTION_SECTION } from './constants';

export function getReflectionPageMocks() {
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
      {
        request: {
          query: GetReflectionByIdDocument,
        },
        variableMatcher: () => true,
        result: {
          data: {
            node: reflectionData,
          },
        },
      },
    ],
    reflectionData,
    profileData,
  };
}
