import { genReflectionData } from '@akashaorg/af-testing';
import {
  CreateReflectDocument,
  GetFollowingListByDidDocument,
} from '@akashaorg/ui-awf-hooks/lib/generated/apollo';

interface IGetReflectEditorMocks {
  reflectionId: string;
  authorProfileDID: string;
  content: string;
}

export function getReflectEditorMocks({
  reflectionId,
  authorProfileDID,
  content,
}: IGetReflectEditorMocks) {
  return [
    {
      request: {
        query: CreateReflectDocument,
      },
      variableMatcher: () => true,
      result: {
        data: {
          createAkashaReflect: {
            document: genReflectionData({
              reflectionId,
              authorProfileDID,
              content,
            }),
            clientMutationId: '',
          },
        },
      },
    },
    {
      request: {
        query: GetFollowingListByDidDocument,
      },
      variableMatcher: () => true,
      maxUsageCount: 2,
      result: {
        data: {
          node: {
            akashaFollowList: {
              edges: [],
              pageInfo: {
                startCursor: null,
                endCursor: null,
                hasNextPage: false,
                hasPreviousPage: false,
                __typename: 'PageInfo',
              },
              __typename: 'AkashaFollowConnection',
            },
            isViewer: false,
            __typename: 'CeramicAccount',
          },
        },
      },
    },
  ];
}
