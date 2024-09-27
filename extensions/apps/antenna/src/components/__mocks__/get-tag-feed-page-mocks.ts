import { genIndexedStreamCount, genInterestsByDID } from '@akashaorg/af-testing';
import {
  GetAppsByIdDocument,
  GetIndexedStreamCountDocument,
  GetInterestsByDidDocument,
} from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import { AUTHENTICATED_DID } from './constants';

interface IGetTagFeedPageMocks {
  count: number;
  tag?: string;
}

export function getTagFeedPageMocks({ count, tag }: IGetTagFeedPageMocks) {
  return {
    mocks: [
      {
        request: {
          query: GetIndexedStreamCountDocument,
        },
        variableMatcher: () => true,
        result: {
          data: {
            node: genIndexedStreamCount({ count }),
          },
        },
      },
      {
        request: {
          query: GetInterestsByDidDocument,
        },
        variableMatcher: () => true,
        result: {
          data: {
            node: genInterestsByDID({ profileDID: AUTHENTICATED_DID, tag }),
          },
        },
      },
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
  };
}
