import { IArticleData } from '@akashaorg/typings/ui';
import { Profile } from '@akashaorg/typings/sdk/graphql-types-new';

export const apps = [
  {
    title: 'Image Editor',
    author: 'Author',
    type: 'App',
  },
  {
    title: 'Image Editor',
    author: 'Author',
    type: 'App',
  },
  {
    title: 'Image Editor',
    author: 'Author',
    type: 'App',
  },
  {
    title: 'Image Editor',
    author: 'Author',
    type: 'App',
  },
];

export const topics = [
  'Amazon',
  'Ethereum',
  'Devcon',
  'Famous',
  'Dancing',
  'Web3',
  'Web3',
  'Euro',
  'Mobile',
  "DAO's",
  'Famous',
  'Famous',
  'Ukraine',
  'Amazon',
  'Notion',
  'Figma',
  'Desktop',
  'Famous',
  "NFT's",
  'Crypto',
  'Devcon',
  'Famous',
  'Developer',
  'Famous',
  'Web3',
  'Design',
  'Euro',
  'Mobile',
  "DAO's",
  'Desktop',
  'Famous',
  'Ukraine',
  'Amazon',
  'Hackathon',
  'Figma',
  'Desktop',
  'Figma',
];

export const userData: {
  ethAddress: string;
  avatar?: Profile['avatar'];
}[] = [
  {
    ethAddress: '0x003410490050000320006570034567114572000',
    avatar: { default: { src: 'https://placebeard.it/360x360', height: 360, width: 360 } },
  },
  {
    ethAddress: '0x004410490050000320006570034567114572001',
    avatar: { default: { src: 'https://placebeard.it/360x360', height: 360, width: 360 } },
  },
  {
    ethAddress: '0x005410490050000320006570034567114572002',
    avatar: { default: { src: 'https://placebeard.it/360x360', height: 360, width: 360 } },
  },
  {
    ethAddress: '0x006410490050000320006570034567114572003',
    avatar: { default: { src: 'https://placebeard.it/360x360', height: 360, width: 360 } },
  },
];

export const articles: IArticleData[] = [
  {
    id: 'bbaryabc123zxcv7scxkfe32fce21ce2ce2rv',
    authorAvatar: { url: '' },
    authorName: 'Estelle Collier',
    authorEthAddress: '0x',
    authorPubkey: 'bbary',
    publishDate: '14 Dec 2022',
    readTime: 6,
    isCopyrighted: true,
    isPublished: true,
    title: 'How does Ethereum work, anyway?',
    subtitle:
      "Odds are you've heard about the Ethereum blockchain, whether or not you know what it is.",
    content: [
      {
        type: 'paragraph',
        value:
          "Odds are you've heard about the Ethereum blockchain, whether or not you know what it is. It's been in the news a lot lately, including the cover of some major magazines, but reading those articles can be like gibberish if you don't have a foundation for what exactly Ethereum is. So what is it? In essence, a public database that keeps a permanent record of digital transactions. Importantly, this database doesn't require any central authority to maintain and secure it. Instead it operates as a “trustless” transactional system — a framework in which individuals can make peer-to-peer transactions without needing to trust a third party OR one another.",
      },
      {
        type: 'paragraph',
        value:
          "Still confused? That's where this post comes in.My aim is to explain how Ethereum functions at a technical level, without complex math or scary- looking formulas.Even if you're not a programmer, I hope you'll walk away with at least better grasp of the tech.If some parts are too technical and difficult to grok, that's totally fine! There's really no need to understand every little detail.I recommend just focusing on understanding things at a broad level",
      },
      {
        type: 'paragraph',
        value:
          "Many of the topics covered in this post are a breakdown of the concepts discussed in the yellow paper.I've added my own explanations and diagrams to make understanding Ethereum easier.Those brave enough to take on the technical challenge can also read the Ethereum yellow paper.",
      },
      {
        type: 'paragraph',
        value:
          "Many of the topics covered in this post are a breakdown of the concepts discussed in the yellow paper.I've added my own explanations and diagrams to make understanding Ethereum easier.Those brave enough to take on the technical challenge can also read the Ethereum yellow paper.",
      },
    ],
    topics: ["NFT's", 'Crypto', 'Devcon', 'Famous', 'Developer', 'Web3', 'Web3', 'Web3', 'Design'],
    mentions: 11,
    replies: 8,
  },
  {
    id: 'bbaryabc123zxcv7scxkfe32fce21ce2ce2vr',
    authorAvatar: { url: '' },
    authorName: 'Usain Bolt',
    authorEthAddress: '0x',
    authorPubkey: 'bbary',
    lastUpdateDate: 'a few seconds ago',
    readTime: 6,
    isCopyrighted: true,
    isDraft: true,
    isShared: true,
    collaborators: userData,
    title: 'How does Ethereum work, anyway?',
    subtitle:
      "Odds are you've heard about the Ethereum blockchain, whether or not you know what it is.",
    content: [
      {
        type: 'paragraph',
        value:
          "Odds are you've heard about the Ethereum blockchain, whether or not you know what it is. It's been in the news a lot lately, including the cover of some major magazines, but reading those articles can be like gibberish if you don't have a foundation for what exactly Ethereum is. So what is it? In essence, a public database that keeps a permanent record of digital transactions. Importantly, this database doesn't require any central authority to maintain and secure it. Instead it operates as a “trustless” transactional system — a framework in which individuals can make peer-to-peer transactions without needing to trust a third party OR one another.",
      },
      {
        type: 'paragraph',
        value:
          "Still confused? That's where this post comes in.My aim is to explain how Ethereum functions at a technical level, without complex math or scary- looking formulas.Even if you're not a programmer, I hope you'll walk away with at least better grasp of the tech.If some parts are too technical and difficult to grok, that's totally fine! There's really no need to understand every little detail.I recommend just focusing on understanding things at a broad level",
      },
      {
        type: 'paragraph',
        value:
          "Many of the topics covered in this post are a breakdown of the concepts discussed in the yellow paper.I've added my own explanations and diagrams to make understanding Ethereum easier.Those brave enough to take on the technical challenge can also read the Ethereum yellow paper.",
      },
      {
        type: 'paragraph',
        value:
          "Many of the topics covered in this post are a breakdown of the concepts discussed in the yellow paper.I've added my own explanations and diagrams to make understanding Ethereum easier.Those brave enough to take on the technical challenge can also read the Ethereum yellow paper.",
      },
    ],
    topics: ["NFT's", 'Crypto', 'Devcon', 'Famous', 'Developer', 'Web3', 'Web3', 'Web3', 'Design'],
  },
  {
    id: 'bbaryabc123zxcv7scxkfe32fce21ce2cer2v',
    authorAvatar: { url: '' },
    authorName: 'Estelle Collier',
    authorEthAddress: '0x',
    authorPubkey: 'bbary',
    publishDate: '14 Dec 2022',
    readTime: 6,
    isCopyrighted: true,
    isPublished: true,
    title: 'Why I think cats are weird',
    subtitle: 'Have you ever watched the famous youtube video when the cats smells the cucumber?',
    content: [
      {
        type: 'paragraph',
        value: 'This is just a long text about cats',
      },
    ],
    topics: ['cats', 'nyan'],
    mentions: 11,
    replies: 8,
  },
  {
    id: 'bbaryabc123zxcv7scxkfe32fce21ce2cerv2',
    authorAvatar: { url: '' },
    authorName: 'Usain Bolt',
    authorEthAddress: '0x',
    authorPubkey: 'bbary',
    lastUpdateDate: '14 Dec 2022',
    readTime: 6,
    isCopyrighted: true,
    isDraft: true,
    title: 'Why I think cats are weird',
    subtitle: 'Have you ever watched the famous youtube video when the cats smells the cucumber?',
    content: [
      {
        type: 'paragraph',
        value: 'This is just a long text about cats',
      },
    ],
    topics: ['cats', 'nyan'],
  },
];
