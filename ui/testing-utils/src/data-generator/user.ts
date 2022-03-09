import faker from 'faker';

const genUser = (ethAddress?: string, userName?: string) => {
  return {
    avatar: faker.image.avatar(),
    coverImage: faker.image.imageUrl(),
    description: faker.lorem.sentences(3),
    ethAddress: ethAddress || faker.finance.ethereumAddress(),
    name: faker.fake('{{name.firstName}} {{name.lastName}}'),
    pubKey: faker.datatype.uuid(),
    userName: userName || faker.internet.userName(),
    default: [],
    providers: [],
  };
};

export const genLoggedInState = (loggedIn = false) => {
  if (!loggedIn)
    return {
      ethAddress: null,
      pubKey: null,
      isReady: false,
      waitForAuth: false,
      isSigningIn: false,
      fromCache: true,
    };
  return {
    ethAddress: '0x92Aa5CF1302883Ba0D470918a46033890Dd36048',
    pubKey: 'bbaareieeoufgnvi6izyvaalsv4tuvz6q3ccszygalvzyovsq3ukw6wbepe',
    isReady: true,
    waitForAuth: false,
    isSigningIn: false,
    fromCache: true,
  };
};

const genLoggedUser = (ethAddress?: string) => {
  const userName = faker.internet.userName();
  const ensName = faker.internet.userName();

  return {
    ...genUser(ethAddress, userName),
    default: [
      {
        property: 'userName',
        provider: 'ewa.providers.basic',
        value: userName,
      },
    ],
    providers: [
      {
        property: 'userName',
        provider: 'ewa.providers.basic',
        value: userName,
      },
      {
        property: 'userName',
        provider: 'ewa.providers.ens',
        value: ensName,
      },
    ],
  };
};

const genEthAddress = () => {
  return faker.finance.ethereumAddress();
};

export { genLoggedUser, genEthAddress, genUser };
