import faker from 'faker';
import { Profile } from '@akashaorg/typings/sdk/graphql-types-new';

const genUser = (ethAddress?: string): Profile => {
  const avatarUrl = faker.image.avatar();
  const coverImageUrl = faker.image.imageUrl();
  return {
    id: '123',
    avatar: { default: { src: avatarUrl, width: 200, height: 200 } },
    coverImage: { default: { src: coverImageUrl, width: 200, height: 200 } },
    description: faker.lorem.sentences(3),
    name: faker.fake('{{name.firstName}} {{name.lastName}}'),
    did: { id: `did:${ethAddress}`, isViewer: true },
    followers: null,
  };
};

export const genLoggedInState = (loggedIn = false): Profile => {
  if (!loggedIn) return null;
  return {
    id: '124',
    did: { id: 'did:0x92Aa5CF1302883Ba0D470918a46033890Dd36048', isViewer: true },
    name: faker.fake('{{name.firstName}} {{name.lastName}}'),
    avatar: {
      default: {
        src: 'https://api.dicebear.com/6.x/bottts-neutral/svg?seed=0x92Aa5CF1302883Ba0D470918a46033890Dd36048',
        width: 200,
        height: 200,
      },
    },
    coverImage: {
      default: {
        src: 'https://api.dicebear.com/6.x/avataaars/svg?seed=0x92Aa5CF1302883Ba0D470918a46033890Dd36048',
        width: 520,
        height: 320,
      },
    },
    description: 'profile description',
    followers: null,
  };
};

const genLoggedUser = (ethAddress?: string) => {
  return {
    ...genUser(ethAddress),
  };
};

const genEthAddress = () => {
  return faker.finance.ethereumAddress();
};

export { genLoggedUser, genEthAddress, genUser };
