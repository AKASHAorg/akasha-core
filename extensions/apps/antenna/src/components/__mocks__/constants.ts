import { genProfileByDID } from '@akashaorg/af-testing';
import { relayStylePagination } from '@apollo/client/utilities';

export const BEAM_ID = 'kjzl6kcym7w8y5coci0at0tquy8zmferlog88ys14oj2qgyjy8soxzpbflmlzey';

export const REFLECTION_ID = 'kjzl6kcym7w8yavmnzr502vunhfmsy5mc9hbbiprgpr2sfob4ajzdzcezr5pumq';

export const TAG_FEED = {
  authorProfileDID: 'did:pkh:eip155:11155111:0xe35ffb3752f6fb15a07ecfa8a1bb65ec51029718',
  content: 'Beam',
  reflectionsCount: 1,
};

export const BEAM_FEED = {
  authorProfileDID: 'did:pkh:eip155:11155111:0x7fe1697d026268fa519f4df90637cf1ebcccf252',
  content: 'Beam',
  reflectionsCount: 1,
};

export const REFLECT_FEED = {
  authorProfileDID: 'did:pkh:eip155:11155111:0x404ea3f8e4a5fcc8bdcdb7a74f25357113fdf989',
  reflectionId: 'kjzl6kcym7w8yaknlainhkpejftbsmffx9799hf1nrmkptk2gvqi7t27d3rp1ve',
  content: 'Reflect feed',
  preview: {
    reflectionId: 'kjzl6kcym7w8y70ra8llsn1l6qi4iy9d5g1acypb2uh9bl1bw479h92gygkmze3',
    content: 'Reflection Preview',
  },
};

export const BEAM_SECTION = {
  authorProfileDID: 'did:pkh:eip155:11155111:0x1d3ac7a3d118f60a726f2dc52a614b2a6ae8dd00',
  content: 'Beam',
  reflectionsCount: 10,
};

export const REFLECTION_SECTION = {
  authorProfileDID: 'did:pkh:eip155:11155111:0x4d3ac7a3d118f60a726f2dc52a614b2a6ae9dd11',
  content: 'Reflection',
};

export const REPLY_TO = REFLECTION_ID;

export const NEW_REFLECTION = 'New reflection';

export const NEW_REFLECTION_ID = 'kjzl6kcym7w8ya09ffxtm0db3cvf9rt7fisv4lud1ksyf4sfw55o9dqqc6lbk5l';

export const AUTHENTICATED_DID =
  'did:pkh:eip155:11155111:0x3dd4dcf15396f2636719447247c45bb3a9506e50';

export const AUTHENTICATED_PROFILE = genProfileByDID({
  profileDID: AUTHENTICATED_DID,
}).akashaProfile;

export const TAG_NAME = 'akasha';

export const TAG_COUNT = 1;

export const APOLLO_TYPE_POLICIES = {
  typePolicies: {
    AkashaBeam: {
      merge: true,
    },
    CeramicAccount: {
      merge: true,
      fields: {
        akashaBeamStreamList: relayStylePagination(['sorting', 'filters']),
        akashaReflectStreamList: relayStylePagination(['sorting', 'filters']),
        akashaBeamList: relayStylePagination(['sorting', 'filters']),
      },
    },
    Query: {
      fields: {
        akashaBeamIndex: relayStylePagination(['sorting', 'filters']),
      },
    },
  },
};

const emptyCharactersArr = Array<string>(8).fill('');
export const NEW_REFLECTION_BEYOND_TEXT_LIMIT = [
  'random text',
  ...emptyCharactersArr,
  'random text',
  ...emptyCharactersArr,
  'random text',
  ...emptyCharactersArr,
  'random text',
  ...emptyCharactersArr,
  'random text',
  ...emptyCharactersArr,
];
