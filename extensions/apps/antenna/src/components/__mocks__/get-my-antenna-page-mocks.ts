import { GetInterestsByDidDocument } from '@akashaorg/ui-awf-hooks/src/generated';
import { AUTHENTICATED_DID } from './constants';
import { genInterestsByDID } from '@akashaorg/af-testing';
import { GetAppsByIdDocument } from '@akashaorg/ui-awf-hooks/lib/generated/apollo';

export function getMyAntennaPageMocks() {
  return {
    mocks: [
      {
        request: {
          query: GetInterestsByDidDocument,
        },
        variableMatcher: () => true,
        result: {
          data: {
            node: genInterestsByDID({ profileDID: AUTHENTICATED_DID }),
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
