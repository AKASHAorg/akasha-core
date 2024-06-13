import { genReflectionStream, genProfileByDID, genReflectionData } from '@akashaorg/af-testing';
import {
  GetProfileByDidDocument,
  GetReflectionStreamDocument,
  GetReflectionByIdDocument,
} from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import { REFLECTION_ID, REFLECTION_SECTION, REFLECT_FEED } from './constants';

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
      {
        request: {
          query: GetReflectionStreamDocument,
          variables: {
            first: 1,
            indexer: undefined,
            filters: {
              and: [
                { where: { isReply: { equalTo: true } } },
                {
                  where: {
                    replyTo: {
                      equalTo: REFLECTION_ID,
                    },
                  },
                },
              ],
            },
          },
        },
        result: {
          data: {
            node: genReflectionStream({
              beamId: REFLECTION_ID,
              reflectionId: REFLECT_FEED.reflectionId,
            }),
          },
        },
      },
    ],
    reflectionData,
    profileData,
  };
}
