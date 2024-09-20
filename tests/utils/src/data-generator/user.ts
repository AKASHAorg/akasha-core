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
      links: [
        {
          href: faker.internet.url(),
          label: null,
          __typename: 'ProfileLinkSource',
        },
      ],
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
      appVersionID: 'k2t6wzhkhabz3cypdahnph5pmxph7hg8k7118bdoxcodwjemo1y39x0wg89ibf',
      appID: 'kt6wzhkhabz49drt2sgrwt2k8s10vvscaucv7ufm2b7sad14g2aljdqn5yr2h',
      description: faker.lorem.sentence(),
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

interface IGenFollowDocumentByDid {
  isFollowing: boolean;
  profile: IGenProfileByDID;
  pageInfo?: {
    startCursor: string;
    endCursor: string;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

const genFollowDocumentByDid = (params?: IGenFollowDocumentByDid) => {
  const profileData = params
    ? genProfileByDID({ ...params.profile, pageInfo: params.pageInfo })
    : null;
  const pageInfo = params?.pageInfo
    ? params.pageInfo
    : { startCursor: null, endCursor: null, hasPreviousPage: false, hasNextPage: false };
  return {
    akashaFollowList: {
      edges: profileData
        ? [
            {
              node: {
                id: faker.string.uuid(),
                isFollowing: params.isFollowing,
                profileID: profileData.akashaProfile.id,
                profile: profileData.akashaProfile,
                __typename: 'AkashaFollowEdge',
              },
              cursor: pageInfo.startCursor ?? '',
            },
          ]
        : [],
      pageInfo: {
        ...pageInfo,
        __typename: 'PageInfo',
      },
      __typename: 'AkashaFollowConnection',
    },
    isViewer: false,
    __typename: 'CeramicAccount',
  };
};

export { genProfileByDID, genFollowDocumentByDid };
