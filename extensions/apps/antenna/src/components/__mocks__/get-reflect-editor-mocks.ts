import { genReflectionData } from '@akashaorg/af-testing';
import {
  CreateReflectDocument,
  GetFollowingListByDidDocument,
  IndexReflectionDocument,
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
        query: IndexReflectionDocument,
      },
      variableMatcher: () => true,
      result: {
        data: {
          indexReflection: {
            document: {
              reflectionID: reflectionId,
              __typename: 'IndexReflectPayloadDocument',
            },
            __typename: 'IndexReflectPayload',
          },
        },
      },
    },
    {
      request: {
        query: GetFollowingListByDidDocument,
      },
      variableMatcher: () => true,
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
    /*@TODO revisit this mock which is needed as a result of refetch on reflect editor */
    {
      request: {
        query: GetFollowingListByDidDocument,
      },
      variableMatcher: () => true,
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
