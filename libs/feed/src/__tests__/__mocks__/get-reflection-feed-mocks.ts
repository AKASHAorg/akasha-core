import {
  genReflectionStream,
  genReflectionData,
  genProfileByDID,
  genReflectReflection,
} from '@akashaorg/af-testing';
import {
  GetProfileByDidDocument,
  GetReflectionStreamDocument,
  GetReflectionByIdDocument,
  GetReflectReflectionsDocument,
} from '@akashaorg/ui-awf-hooks/lib/generated/apollo';

interface IGetReflectionFeedMocks {
  authorProfileDID: string;
  beamId: string;
  reflectionId: string;
  reflectionContent: string;
  reflectionPreviewContent?: string;
}

export function getReflectionFeedMocks({
  authorProfileDID,
  beamId,
  reflectionId,
  reflectionContent,
  reflectionPreviewContent,
}: IGetReflectionFeedMocks) {
  const profileData = genProfileByDID(authorProfileDID);
  return [
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
        query: GetReflectionStreamDocument,
      },
      variableMatcher: () => true,
      result: {
        data: {
          node: genReflectionStream({ beamId, reflectionId }),
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
          node: genReflectionData({
            reflectionId,
            authorProfileDID,
            content: reflectionContent,
          }),
        },
      },
    },
    {
      request: {
        query: GetReflectReflectionsDocument,
      },
      variableMatcher: () => true,
      result: {
        data: reflectionPreviewContent
          ? genReflectReflection({
              beamId,
              reflectionId,
              authorProfileDID,
              content: reflectionPreviewContent,
            })
          : null,
      },
    },
  ];
}
