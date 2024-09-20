import { toBinary } from '../toBinary';

interface IGenBeamData {
  beamId: string;
  active?: boolean;
  authorProfileDID: string;
  isViewer?: boolean;
  nsfw?: boolean;
  reflectionsCount?: number;
}

interface IGenBeamStream {
  beamId: string;
  pageInfo?: {
    startCursor: string;
    endCursor: string;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

interface IGenContentBlock {
  blockId: string;
  authorProfileDID: string;
  content: string;
}

const genBeamData = ({
  beamId,
  active = true,
  authorProfileDID,
  isViewer = false,
  nsfw = false,
  reflectionsCount = 10,
}: IGenBeamData) => {
  return {
    id: beamId,
    reflectionsCount,
    active,
    embeddedStream: null,
    author: {
      id: authorProfileDID,
      isViewer,
      __typename: 'CeramicAccount',
    },
    content: [
      {
        blockID: 'kjzl6kcym7w8y51qzk3hsr5l9af8q4q1yacipuyrn8ycmz5tpv1u568x90ux7ks',
        order: 0,
        __typename: 'BeamBlockRecord',
      },
      {
        blockID: 'kjzl6kcym7w8y97lrac40t1oa9u6x4a82qi2249ys591b2uvswanuhagrhp6w7b',
        order: 1,
        __typename: 'BeamBlockRecord',
      },
      {
        blockID: 'kjzl6kcym7w8y5m9z6mev1llg7lmrmsnyxxd93xm3nq37yih1avtrppmpr2hwb1',
        order: 2,
        __typename: 'BeamBlockRecord',
      },
    ],
    tags: [],
    mentions: null,
    version:
      'k2zn3ty0zptz513z3s2buzbzn0v2o96ql5w592syhkz99pfkusu3f76xivwd1xxdkf1iz77i3zonlnul74i2q657f69oxu9wry816kzucgklvvvbsy1ryth',
    createdAt: '2024-06-06T10:15:48.452Z',
    nsfw,
    appVersionID: 'k2t6wzhkhabz3cypdahnph5pmxph7hg8k7118bdoxcodwjemo1y39x0wg89ibf',
    appID: 'kt6wzhkhabz49drt2sgrwt2k8s10vvscaucv7ufm2b7sad14g2aljdqn5yr2h',
    reflections: {
      edges: [],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: null,
        endCursor: null,
        __typename: 'PageInfo',
      },
      __typename: 'AkashaReflectInterfaceConnection',
    },
    __typename: 'AkashaBeam',
  };
};

const genBeamSlate = () => {
  return {
    content: [
      {
        type: 'paragraph',
        children: [
          { text: '' },
          {
            url: 'https://google.com',
            type: 'link',
            children: [{ text: '' }],
          },
          {
            text: ' -> test',
            type: 'text',
          },
        ],
      },
      {
        type: 'paragraph',
        children: [{ text: 'another line', type: 'text' }],
      },
      {
        type: 'paragraph',
        children: [{ text: '3rd line', type: 'text' }],
      },
      {
        url: 'https://pbs.twimg.com/profile_banners/3296506527/1556880274/1500x500',
        size: {
          width: 640,
          height: 426,
          naturalWidth: 640,
          naturalHeight: 426,
        },
        type: 'image',
        children: [{ text: '' }],
      },
    ],
  };
};

const genBeamStream = ({
  beamId,
  pageInfo = {
    startCursor:
      'eyJ0eXBlIjoiY49udGVudCIsImlkIjoiazJ0Nnd6aGtoYWJ6NjJ6dzJqY2JydHhrb2Y2cWZhYTg1YWxkc295Z2dqZDd6YWNjYnB5Z2p3c3BmZjE2YXAiLCJ2YWx1ZSI6eyJjcmVhdGVkQXQiOiIyMDI0LTA2LTA1VDA5OjQ5OjU1LjU5M1oifX0',
    endCursor:
      'eyJ0eXBlIjoiY29udGVudCIsImlkIjoiazJ0Nnd6aGtoYWJ6NjgxdWU2bzd2YWM5a2cyM3d2bWxkdXRpc21wNGk3bzg3ZmFxeG5jbGIzaXl6OTMwY3AiLCJ2YWx1ZSI6eyJjcmVhdGVkQXQiOiIyMDI0LTA2LTA0VDA5OjIzOjEyLjMwNVoifX0',
    hasNextPage: false,
    hasPreviousPage: false,
  },
}: IGenBeamStream) => {
  return {
    akashaBeamStreamList: {
      edges: [
        {
          node: {
            beamID: beamId,
            createdAt: '2024-06-05T09:49:55.593Z',
            active: true,
            status: null,
            moderationID: null,
            appID: 'kt6wzhkhabz49drt2sgrwt2k8s10vvscaucv7ufm2b7sad14g2aljdqn5yr2h',
            __typename: 'AkashaBeamStream',
          },
          cursor: pageInfo.startCursor,
          __typename: 'AkashaBeamStreamEdge',
        },
      ],
      pageInfo: {
        ...pageInfo,
        __typename: 'PageInfo',
      },
      __typename: 'AkashaBeamStreamConnection',
    },
    isViewer: false,
    __typename: 'CeramicAccount',
  };
};

const genContentBlock = ({ blockId, content, authorProfileDID }: IGenContentBlock) => {
  return {
    id: blockId,
    content: [
      {
        propertyType: 'slate-block',
        value: window.btoa(toBinary(JSON.stringify({ text: content }))),
        label: '@akashaorg/app-antenna',
        __typename: 'BlockLabeledValue',
      },
    ],
    active: true,
    appVersion: {
      application: {
        name: 'antenna-test',
        displayName: 'Antenna App',
        id: 'k2t6wzhkhabz6gwifgv2ru08ghnitdv8dwwx7r823mt2s4ziz54aw1bsrv2ejc',
        __typename: 'AkashaApp',
      },
      applicationID: 'k2t6wzhkhabz6gwifgv2ru08ghnitdv8dwwx7r823mt2s4ziz54aw1bsrv2ejc',
      id: 'k2t4wzhkhabz3aut9p2mhjzp80hzo7bee18l1pt94syakfbfcj7phve27kiwwp',
      version: '0.1.0',
      __typename: 'AkashaAppRelease',
    },
    appVersionID: 'k2t4wzhkhabz3aut9p2mhjzp80hzo7bee18l1pt94syakfbfcj7phve27kiwwp',
    createdAt: '2024-06-06T07:25:01.861Z',
    kind: 'TEXT',
    author: {
      id: authorProfileDID,
      isViewer: false,
      __typename: 'CeramicAccount',
    },
    version:
      'k6zn3ty0zptz511iyp1e3gnb5guv5gndv1fmfocbfcttijcbn3afe8zes6tg1ik5k8ojha8ea3fvl91b1hlb15w488ni7q38sz9sbmy674hubm2o31b1cxj',
    nsfw: false,
    __typename: 'AkashaContentBlock',
  };
};

interface IGetIndexedStream {
  streamId: string;
  pageInfo?: {
    startCursor: string;
    endCursor: string;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

const getIndexedStream = ({
  streamId,
  pageInfo = {
    startCursor:
      'eyJ0eXBlIjoiY29udGVudCIsImlkIjoiazJ0Nnd6aGtoYWJ6MGs3YnVsNWVscW1zeWZwbDV5enNyb3N1cmk4aW10MDZtaHVsajN5OGx1ZTJoa2Jid28iLCJ2YWx1ZSI6eyJjcmVhdGVkQXQiOiIyMDI0LTA1LTIxVDE0OjQ3OjA3LjM0M1oifX0',
    endCursor:
      'eyJ0eXBlIjoiY29udGVudCIsImlkIjoiazJ0Nnd6aGtoYWJ6MWhuMXYxb3F4c2Y3NnF4ajNnZ2ViYXo5Y3ZkMmQ5bzBoaHBpYjl2ODF6aXR2ZG1mbXUiLCJ2YWx1ZSI6eyJjcmVhdGVkQXQiOiIyMDI0LTA1LTIxVDE0OjMwOjM0LjA1NFoifX0',
    hasPreviousPage: false,
    hasNextPage: false,
  },
}: IGetIndexedStream) => {
  return {
    akashaIndexedStreamList: {
      edges: [
        {
          node: {
            createdAt: '2024-05-21T14:47:07.343Z',
            active: true,
            status: null,
            indexValue: 'fasfas',
            indexType: 'core#tag',
            stream: streamId,
            streamType: 'BEAM',
            moderationID: null,
            __typename: 'AkashaIndexedStream',
          },
          cursor:
            'eyJ0eXBlIjoiY29udGVudCIsImlkIjoiazJ0Nnd6aGtoYWJ6MGs3YnVsNWVscW1zeWZwbDV5enNyb3N1cmk4aW10MDZtaHVsajN5OGx1ZTJoa2Jid28iLCJ2YWx1ZSI6eyJjcmVhdGVkQXQiOiIyMDI0LTA1LTIxVDE0OjQ3OjA3LjM0M1oifX0',
          __typename: 'AkashaIndexedStreamEdge',
        },
      ],
      pageInfo: {
        ...pageInfo,
        __typename: 'PageInfo',
      },
      __typename: 'AkashaIndexedStreamConnection',
    },
    akashaIndexedStreamListCount: 1,
    isViewer: false,
    __typename: 'CeramicAccount',
  };
};

interface IGetIndexedStreamCount {
  count: number;
}

const genIndexedStreamCount = ({ count }: IGetIndexedStreamCount) => {
  return {
    akashaIndexedStreamListCount: count,
    isViewer: false,
    __typename: 'CeramicAccount',
  };
};

export {
  genBeamSlate,
  genBeamStream,
  genContentBlock,
  genBeamData,
  getIndexedStream,
  genIndexedStreamCount,
};
