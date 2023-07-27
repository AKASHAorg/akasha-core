import {
  GetBeamsQuery,
  GetReflectionsFromBeamQuery,
} from '@akashaorg/typings/sdk/graphql-operation-types-new';
import {
  PROPERTY_SLATE_CONTENT,
  serializeSlateToBase64,
} from '@akashaorg/ui-awf-hooks/lib/utils/entry-utils';

const randomBetween = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const createDummyBeams =
  (count: number) =>
  ({ pageParam = 0 }): GetBeamsQuery => {
    return {
      beamIndex: {
        edges: Array.from({ length: count }, (_, i) => ({
          node: {
            id: `${pageParam}_${Math.floor(Math.random() * 100)}`,
            reflectionsCount: 1,
            rebeamsCount: 1,
            active: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            author: { id: 'some-author-id' },
            version: 0,
            content: [
              {
                provider: 'akasha-beams',
                property: PROPERTY_SLATE_CONTENT,
                value: serializeSlateToBase64(
                  slateContent
                    .slice(0, randomBetween(1, slateContent.length))
                    .sort(() => Math.random() - 0.5),
                ),
              },
            ],
          },
        })),
        pageInfo: {
          hasNextPage: true,
          hasPreviousPage: false,
        },
      },
    };
  };

export const createDummyReflections =
  (count: number) =>
  ({ pageParam = 0 }): GetReflectionsFromBeamQuery => {
    return {
      node: {
        reflections: {
          edges: Array.from({ length: count }, (_, i) => ({
            node: {
              id: `${pageParam}_${Math.floor(Math.random() * 100)}`,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              version: 0,
              active: true,
              isReply: false,
              reflectionsCount: 2,
              author: { id: 'some-author-id' },
              content: [
                {
                  provider: 'akasha-reflections',
                  property: PROPERTY_SLATE_CONTENT,
                  value: serializeSlateToBase64(
                    slateContent
                      .slice(0, randomBetween(1, slateContent.length))
                      .sort(() => Math.random() - 0.5),
                  ),
                },
              ],
              beam: { id: 'some-beam-id', author: { id: 'some-author-id' } },
            },
          })),
        },
      },
    };
  };

const slateContent = [
  {
    type: 'paragraph',
    children: [
      {
        text: "Odds are you've heard about the Ethereum blockchain, whether or not you know what it is. It's been in the news a lot lately, including the cover of some major magazines, but reading those articles can be like gibberish if you don't have a foundation for what exactly Ethereum is. So what is it? In essence, a public database that keeps a permanent record of digital transactions. Importantly, this database doesn't require any central authority to maintain and secure it. Instead it operates as a “trustless” transactional system — a framework in which individuals can make peer-to-peer transactions without needing to trust a third party OR one another.",
      },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: 'An Application Programming Interface (API) is a set of definitions for how to use a piece of software. An API sits between an application and a web server, and facilitates the transfer of data between them.',
      },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: 'bootnode: The nodes which can be used to initiate the discovery process when running a node. The endpoints of these nodes are recorded in the Ethereum source code.',
      },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: "Still confused? That's where this post comes in.My aim is to explain how Ethereum functions at a technical level, without complex math or scary- looking formulas.Even if you're not a programmer, I hope you'll walk away with at least better grasp of the tech.If some parts are too technical and difficult to grok, that's totally fine! There's really no need to understand every little detail.I recommend just focusing on understanding things at a broad level",
      },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: "Many of the topics covered in this post are a breakdown of the concepts discussed in the yellow paper.I've added my own explanations and diagrams to make understanding Ethereum easier.Those brave enough to take on the technical challenge can also read the Ethereum yellow paper.",
      },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: "Many of the topics covered in this post are a breakdown of the concepts discussed in the yellow paper.I've added my own explanations and diagrams to make understanding Ethereum easier.Those brave enough to take on the technical challenge can also read the Ethereum yellow paper.",
      },
    ],
  },
];
