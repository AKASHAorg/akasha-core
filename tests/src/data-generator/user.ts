import faker from 'faker';
import { AkashaProfile } from '@akashaorg/typings/lib/ui';

const genUser = (profileDID?: string): AkashaProfile => {
  const avatarUrl = faker.image.avatar();
  const coverImageUrl = faker.image.imageUrl();
  return {
    id: '123',
    avatar: { default: { src: avatarUrl, width: 200, height: 200 } },
    background: { default: { src: coverImageUrl, width: 200, height: 200 } },
    description: faker.lorem.sentences(3),
    links: [
      { href: 'https://github.com/AKASHAorg/akasha-core' },
      { href: 'https://twitter.com/AKASHAorg' },
    ],
    name: faker.fake('{{name.firstName}} {{name.lastName}}'),
    did: { id: profileDID },
    createdAt: faker.date.past().toISOString(),
    followersCount: 0,
  };
};

export const genLoggedInState = (loggedIn = false): AkashaProfile => {
  if (!loggedIn) return null;
  return {
    id: '124',
    did: { id: 'did:0x92Aa5CF1302883Ba0D470918a46033890Dd36048' },
    name: faker.fake('{{name.firstName}} {{name.lastName}}'),
    avatar: {
      default: {
        src: 'https://api.dicebear.com/6.x/bottts-neutral/svg?seed=0x92Aa5CF1302883Ba0D470918a46033890Dd36048',
        width: 200,
        height: 200,
      },
    },
    background: {
      default: {
        src: 'https://api.dicebear.com/6.x/avataaars/svg?seed=0x92Aa5CF1302883Ba0D470918a46033890Dd36048',
        width: 520,
        height: 320,
      },
    },
    description: 'profile description',
    createdAt: faker.date.past().toISOString(),
    followersCount: 2,
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
