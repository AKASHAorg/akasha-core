import { faker } from '@faker-js/faker';

interface IGenProfileByDID {
  profileDID: string;
  pageInfo?: {
    startCursor: string;
    endCursor: string;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
  nsfw?: boolean;
}

const genProfileByDID = ({
  profileDID,
  pageInfo = { startCursor: null, endCursor: null, hasPreviousPage: false, hasNextPage: false },
  nsfw = false,
}: IGenProfileByDID) => {
  return {
    akashaProfile: {
      id: faker.string.uuid(),
      did: {
        id: profileDID,
        isViewer: false,
        __typename: 'CeramicAccount',
      },
      name: faker.internet.userName(),
      links: [],
      background: {
        default: {
          src: faker.image.urlPicsumPhotos(),
          width: 600,
          height: 128,
          __typename: 'ProfileImageSource',
        },
        alternatives: null,
        __typename: 'ProfileImageVersions',
      },
      description: 'AKASHA',
      avatar: {
        default: {
          src: faker.image.avatar(),
          width: 159,
          height: 159,
          __typename: 'ProfileImageSource',
        },
        alternatives: null,
        __typename: 'ProfileImageVersions',
      },
      followers: {
        pageInfo: {
          ...pageInfo,
          __typename: 'PageInfo',
        },
        __typename: 'AkashaFollowInterfaceConnection',
      },
      createdAt: '2024-05-24T07:45:26.191Z',
      nsfw,
      __typename: 'AkashaProfile',
    },
    isViewer: false,
    __typename: 'CeramicAccount',
  };
};

export { genProfileByDID };
