import { toBinary } from '../toBinary';

interface IGenReflectionData {
  reflectionId: string;
  authorProfileDID: string;
  content: string;
  isReply?: boolean;
  reflection?: string | null;
}

interface IGenReflectionStream {
  beamId: string;
  reflectionId: string;
  replyTo?: string | null;
  isReply?: boolean;
  pageInfo?: {
    startCursor: string;
    endCursor: string;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

interface IGenReflectReflectionStream {
  beamId: string;
  reflectionId: string;
  authorProfileDID: string;
  content: string;
  pageInfo?: {
    startCursor: string;
    endCursor: string;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

const genReflectionData = ({
  reflectionId,
  authorProfileDID,
  content,
  isReply = false,
  reflection = null,
}: IGenReflectionData) => {
  return {
    id: reflectionId,
    author: {
      id: authorProfileDID,
      isViewer: false,
      __typename: 'CeramicAccount',
    },
    version:
      'k6zn4ty0zptz50nar1csfls500hpgk8xvx7cyfbktkl11kpzb3bvs0uvn4rm00tq9agvu1tre2la3r8lyr0e0705jx2ybuj8p54ze1ktlrgvwv0rof0j9ll',
    active: true,
    content: [
      {
        label: 'AkashaApp',
        propertyType: 'slate-block',
        value: window.btoa(toBinary(JSON.stringify({ text: content }))),
        __typename: 'ReflectProviderValue',
      },
    ],
    isReply,
    reflection,
    createdAt: '2024-06-05T07:42:04.736Z',
    beam: {
      id: 'kjzl6kcym7w8yam23sr1xc4z842m4rv5u8y1j513hi6g3q28656dmjs5vysffs6',
      author: {
        id: 'did:pkh:eip155:11155111:0x205616bf38125c5a73edd5b506d0ce820074arae',
        isViewer: false,
        __typename: 'CeramicAccount',
      },
      __typename: 'AkashaBeam',
    },
    nsfw: null,
    __typename: 'AkashaReflect',
  };
};

const genReflectionStream = ({
  beamId,
  reflectionId,
  isReply = false,
  replyTo = null,
  pageInfo = {
    startCursor:
      'eyJ0eXBlIjoiY29udGVudCIsImlkIjoiazJ0Nnd6aGtoYWJ6M212Ym9jYjhrNGIyeDJkeWpxOWYzbWl4cWFkN25sc3d4d2dmdTV4ZDl4MmxsNTBwajQiLCJ2YWx1ZSI6eyJjcmVhdGVkQXQiOiIyMDI0LTA2LTA1VDA3OjQyOjEwLjUzOVoifX0',
    endCursor:
      'eyJ0eXBlIjoiY29udGVudCIsImlkIjoiazJ0Nnd6aGtoYWJ6M3Q0NTJkZHNrcDNqZ3hkdWF0ZXp4NzdyMTFoMmJkYzdnNnkyZHZudWhmOXNhZWI2aHIiLCJ2YWx1ZSI6eyJjcmVhdGVkQXQiOiIyMDI0LTA2LTA1VDA3OjQyOjAxLjczMloifX0',
    hasNextPage: false,
    hasPreviousPage: false,
  },
}: IGenReflectionStream) => {
  return {
    akashaReflectStreamList: {
      edges: [
        {
          node: {
            reflectionID: reflectionId,
            moderationID: null,
            beamID: beamId,
            active: true,
            status: null,
            createdAt: '2024-06-05T07:42:10.539Z',
            isReply,
            replyTo,
            __typename: 'AkashaReflectStream',
          },
          cursor: pageInfo.startCursor,
          __typename: 'AkashaReflectStreamEdge',
        },
      ],
      pageInfo: {
        ...pageInfo,
        __typename: 'PageInfo',
      },
      __typename: 'AkashaReflectStreamConnection',
    },
    isViewer: false,
    __typename: 'CeramicAccount',
  };
};

const genReflectReflection = ({
  beamId,
  reflectionId,
  authorProfileDID,
  content,
  pageInfo = {
    startCursor:
      'eyJ0eXBlIjoiY29udGVudCIsImlkIjoiazJ0Nnd6aGtoYWJ6M212Ym9jYjhrNGIyeDJkeWpxOWYzbWl4cWFkN25sc3d4d2dmdTV4ZDl4MmxsNTBwajQiLCJ2YWx1ZSI6eyJjcmVhdGVkQXQiOiIyMDI0LTA2LTA1VDA3OjQyOjEwLjUzOVoifX0',
    endCursor:
      'eyJ0eXBlIjoiY29udGVudCIsImlkIjoiazJ0Nnd6aGtoYWJ6M3Q0NTJkZHNrcDNqZ3hkdWF0ZXp4NzdyMTFoMmJkYzdnNnkyZHZudWhmOXNhZWI2aHIiLCJ2YWx1ZSI6eyJjcmVhdGVkQXQiOiIyMDI0LTA2LTA1VDA3OjQyOjAxLjczMloifX0',
    hasNextPage: false,
    hasPreviousPage: false,
  },
}: IGenReflectReflectionStream) => {
  return {
    akashaReflectIndex: {
      edges: [
        {
          node: {
            id: reflectionId,
            author: {
              id: authorProfileDID,
              isViewer: false,
              __typename: 'CeramicAccount',
            },
            version:
              'k6zn3ty0zptz4zzkgnhmaisirhupfb9sqr5zuaez5hagmrbtlnacz3yyv1izq1gjzmopqi6eleka07qet2rtn9x8y838v9gkrkv1h5uvfpbwwdh54zsbcbe',
            active: true,
            content: [
              {
                label: 'AkashaApp',
                propertyType: 'slate-block',
                value: window.btoa(toBinary(JSON.stringify({ text: content }))),
                __typename: 'ReflectProviderValue',
              },
            ],
            isReply: true,
            reflection: 'kjzl6kcym7w8yagwc0lxn4hwgdzttqmv36vfvb52thc67hqdtg5rp9kt65zofxw',
            createdAt: '2024-06-06T08:33:35.747Z',
            beam: {
              id: beamId,
              author: {
                id: 'did:pkh:eip155:11155111:0x7fe1697d026268fa519f4df90637cf1ebcccf252',
                isViewer: false,
                __typename: 'CeramicAccount',
              },
              __typename: 'AkashaBeam',
            },
            nsfw: null,
            __typename: 'AkashaReflect',
          },
          cursor: pageInfo.startCursor,
          __typename: 'AkashaReflectEdge',
        },
      ],
      pageInfo: {
        ...pageInfo,
        __typename: 'PageInfo',
      },
      __typename: 'AkashaReflectConnection',
    },
  };
};

export { genReflectionData, genReflectionStream, genReflectReflection };
