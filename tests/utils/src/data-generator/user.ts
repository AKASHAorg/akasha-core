const genProfileByDID = (profileDID?: string) => {
  return {
    akashaProfile: {
      id: 'k2t6wzhkhabz4h6cyxd7y7uodszszzgaid7jkh6k7hs0hplj4jvk03s0e5b2lx',
      did: {
        id: profileDID,
        isViewer: false,
        __typename: 'CeramicAccount',
      },
      name: 'CoffeeLover',
      links: [],
      background: null,
      description: 'AKASHA',
      avatar: null,
      followers: {
        pageInfo: {
          startCursor: null,
          endCursor: null,
          hasPreviousPage: false,
          hasNextPage: false,
          __typename: 'PageInfo',
        },
        __typename: 'AkashaFollowInterfaceConnection',
      },
      createdAt: '2024-05-24T07:45:26.191Z',
      nsfw: false,
      __typename: 'AkashaProfile',
    },
    isViewer: false,
    __typename: 'CeramicAccount',
  };
};

export { genProfileByDID };
