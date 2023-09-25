export const mockSearchProfiles = [
  {
    did: {
      id: 'did:pkh:eip155:5:0x36c703c4d2fa2437dc883e2e0884e57404e11234',
    },
    name: 'Test',
    userName: 'test',
    avatar: null,
    coverImage: null,
    description: null,
    ethAddress: '0x13e218c7969DC9Ed2046198acDA41c95BfBB7469',
    totalPosts: '1',
    totalFollowers: 5,
    totalFollowing: 4,
    totalInterests: 1,
  },
  {
    did: {
      id: 'did:pkh:eip155:5:0x36c703c4d2fa2437dc883e2e0884e57404e11234',
    },
    name: 'lalala',
    userName: 'testing',
    avatar: null,
    coverImage: null,
    description: null,
    ethAddress: '0xea6bCEbC4aD892A0f744bbc7b7940293829322Bc',
    totalPosts: '1',
    totalFollowers: 0,
    totalFollowing: 0,
    totalInterests: 1,
  },
  {
    did: {
      id: 'did:pkh:eip155:5:0x36c703c4d2fa2437dc883e2e0884e57404e11234',
    },
    name: null,
    userName: 'test7acc',
    avatar: null,
    coverImage: null,
    description: null,
    ethAddress: '0xFC31185De616E0d6b7E4D9A7C13a16f0ca92d09e',
    totalPosts: '0',
    totalFollowers: 1,
    totalFollowing: 0,
    totalInterests: 0,
  },
  {
    did: {
      id: 'did:pkh:eip155:5:0x36c703c4d2fa2437dc883e2e0884e57404e11234',
    },
    name: 'test333',
    userName: 'test333a',
    avatar: 'bafkreiccot7ck2ovlv4rlhl6bazwqt3vkkjubd3jn5rkbldkmxpobh6ada',
    coverImage: null,
    description: null,
    ethAddress: '0x98472ECda828dA52e5721dEfC01a577d71F1e132',
    totalPosts: '0',
    totalFollowers: 0,
    totalFollowing: 0,
    totalInterests: 0,
  },
];

export const mockProfile = {
  avatar: {
    url: 'https://bafkreig3met3m6gkcysgu4krykapfjzrhz54jdntn4y7esu6ga36jqld7i.ipfs.hub.textile.io',
    fallbackUrl:
      'https://bafkreig3met3m6gkcysgu4krykapfjzrhz54jdntn4y7esu6ga36jqld7i.ipfs.infura-ipfs.io',
  },
  coverImage: {
    url: 'https://bafkreig5wajd7vnssqrq35qzzwzwz5c53ptfiklqsx6rndttgxbcw5u2q4.ipfs.hub.textile.io',
    fallbackUrl:
      'https://bafkreig5wajd7vnssqrq35qzzwzwz5c53ptfiklqsx6rndttgxbcw5u2q4.ipfs.infura-ipfs.io',
  },
  did: {
    id: 'did:pkh:eip155:5:0x36c703c4d2fa2437dc883e2e0884e57404e11234',
  },
  name: 'Tetrarcha',
  userName: 'tetrarch',
  description: null,
  ethAddress: '0x3Ff1621520d621b39572b952138c869758a41201',
  totalPosts: '9',
  totalFollowers: 8,
  totalFollowing: 16,
  totalInterests: 4,
  providers: [
    {
      provider: 'ewa.providers.ens',
      property: 'userName',
      value: 'tetrarch.akasha.eth',
    },
    {
      provider: 'ewa.providers.basic',
      property: 'userName',
      value: 'tetrarch',
    },
  ],
  default: [
    {
      provider: 'ewa.providers.ens',
      property: 'userName',
      value: 'tetrarch.akasha.eth',
    },
    {
      provider: 'ewa.providers.basic',
      property: 'name',
      value: 'Tetrarcha',
    },
    {
      provider: 'ewa.providers.basic',
      property: 'avatar',
      value: 'bafkreig3met3m6gkcysgu4krykapfjzrhz54jdntn4y7esu6ga36jqld7i',
    },
    {
      provider: 'ewa.providers.basic',
      property: 'coverImage',
      value: 'bafkreig5wajd7vnssqrq35qzzwzwz5c53ptfiklqsx6rndttgxbcw5u2q4',
    },
  ],
  contentId: 'bbaareiav5sekussb27f6e3f7z66weker43fqdlmmlxsnkq735pfbfy3lxu',
  reported: false,
  moderated: false,
  delisted: false,
  reason: '',
};
