interface IGenInterestsByDID {
  profileDID: string;
  tag?: string;
}

const genInterestsByDID = ({ profileDID, tag = 'web3' }: IGenInterestsByDID) => {
  return {
    akashaProfileInterests: {
      topics: [
        {
          value: tag,
          labelType: 'core#interest',
          __typename: 'ProfileLabeled',
        },
      ],
      did: {
        id: profileDID,
        __typename: 'CeramicAccount',
      },
      id: 'k2t6wzhkhabz0l38svbk19xkfba5iqeswek2v555c3x4bn9aqt9h69fuaungkw',
      __typename: 'AkashaProfileInterests',
    },
    isViewer: false,
    __typename: 'CeramicAccount',
  };
};

export { genInterestsByDID };
