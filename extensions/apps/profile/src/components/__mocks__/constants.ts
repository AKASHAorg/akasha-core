import { genProfileByDID } from '@akashaorg/af-testing';
import { relayStylePagination } from '@apollo/client/utilities';

export const PROFILE_DID = 'did:pkh:eip155:11155111:0x405616bf38175c5a73edd5b506d0ce820074acae';

export const AUTHENTICATED_DID =
  'did:pkh:eip155:11155111:0x3dd4dcf15396f2636719447247c45bb3a9506e50';

export const AUTHENTICATED_PROFILE = genProfileByDID({
  profileDID: AUTHENTICATED_DID,
}).akashaProfile;

export const PROFILE_STATS = {
  totalFollowing: 15,
  totalFollowers: 20,
  totalBeams: 10,
  totalTopics: 1,
  totalReflections: 5,
};

export const NEW_PROFILE = {
  name: 'coffeelover',
  bio: 'bio',
  link: 'https://x.com/coffeelover',
};

export const APOLLO_TYPE_POLICIES = {
  typePolicies: {
    AkashaReflectConnection: {
      merge: true,
    },
    AkashaFollow: {
      merge: true,
    },
    CeramicAccount: {
      merge: true,
      fields: {
        akashaFollowList: relayStylePagination(['sorting', 'filters']),
        akashaReflectStreamList: relayStylePagination(['sorting', 'filters']),
      },
    },
    AkashaProfile: {
      merge: true,
      fields: {
        followers: relayStylePagination(['sorting', 'filters']),
      },
    },
  },
};

export const NEW_AVATAR_URL = 'https://placehold.co/76x76';

export const NEW_COVER_IMAGE_URL = 'https://placehold.co/600x200';
