import faker from 'faker';
import { genSlatePost } from './post';
import { genUser } from './user';

const genAuthor = () => {
  return {
    ...genUser(),
    totalFollowers: faker.datatype.number(99999),
    totalFollowing: faker.datatype.number(9999),
    totalPosts: `${faker.datatype.number(1000)}`,
  };
};

const genCommentData = () => {
  return {
    author: genAuthor(),
    content: genSlatePost().content,
    postId: faker.random.alphaNumeric(26),
    replyTo: faker.random.alphaNumeric(26),
    mentions: [],
    creationDate: new Date(),
    updatedAt: new Date(),
    _id: faker.datatype.uuid(),
  };
};

export { genCommentData };
