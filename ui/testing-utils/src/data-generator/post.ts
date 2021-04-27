import faker from 'faker';
import { genUser } from './user';

const genAuthor = () => {
  return {
    ...genUser(),
    totalFollowers: faker.datatype.number(99999),
    totalFollowing: faker.datatype.number(9999),
    totalPosts: `${faker.datatype.number(1000)}`,
  };
};

const genPostData = () => {
  return {
    author: genAuthor(),
    content: genSlatePost().content,
    entryId: faker.random.alphaNumeric(26),
    ipfsLink: faker.random.alphaNumeric(26),
    totalComments: faker.datatype.number(9999),
    quotedBy: [],
    quotedByAthors: null,
    quotes: [],
    tags: [],
    _id: faker.datatype.uuid(),
  };
};

const genSlatePost = () => {
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
        url:
          'https://hub.textile.io/ipfs/bafkreidketqm2q5xuxvtezegtu7hchc2a6bdlazpxftdudczngkrht674i',
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

export { genSlatePost, genPostData };
