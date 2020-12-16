import { commentsStats, statsProvider } from './constants';

const query = {
  getProfile: async (_source, { ethAddress }, { dataSources }) => {
    return await dataSources.profileAPI.getProfile(ethAddress);
  },
  resolveProfile: async (_source, { pubKey }, { dataSources }) => {
    return await dataSources.profileAPI.resolveProfile(pubKey);
  },
  getPost: async (_source, { id }, { dataSources }) => {
    const postData = await dataSources.postsAPI.getPost(id);
    const totalCommentsIndex = postData.metaData.findIndex(
      m => m.provider === statsProvider && m.property === commentsStats,
    );
    const totalComments =
      totalCommentsIndex !== -1 ? postData.metaData[totalCommentsIndex].value : '0';
    if (postData && typeof postData.author === 'string') {
      const author = await dataSources.profileAPI.resolveProfile(postData.author);
      Object.assign(postData, { author });
    }
    if (postData.quotes && postData.quotes.length) {
      for (const quote of postData.quotes) {
        if (typeof quote.author !== 'string') {
          continue;
        }
        const resolvedAuthor = await dataSources.profileAPI.resolveProfile(quote.author);
        Object.assign(quote, { author: resolvedAuthor });
      }
    }
    return Object.assign({}, postData, { totalComments });
  },

  getTag: async (_source, { name }, { dataSources }) => {
    return dataSources.tagsAPI.getTag(name);
  },
  searchTags: async (_source, { name }, { dataSources }) => {
    return dataSources.tagsAPI.searchTag(name);
  },
  tags: async (_source, { limit, offset }, { dataSources }) => {
    return dataSources.tagsAPI.getTags(limit, offset);
  },
  posts: async (_source, { limit, offset }, { dataSources }) => {
    const data = await dataSources.postsAPI.getPosts(limit, offset);
    const results = [];

    for (const post of data.results) {
      const author = await dataSources.profileAPI.resolveProfile(post.author);
      const totalCommentsIndex = post.metaData.findIndex(
        m => m.provider === statsProvider && m.property === commentsStats,
      );
      const totalComments =
        totalCommentsIndex !== -1 ? post.metaData[totalCommentsIndex].value : '0';
      if (post.quotes && post.quotes.length) {
        for (const quote of post.quotes) {
          if (typeof quote.author !== 'string') {
            continue;
          }
          const resolvedAuthor = await dataSources.profileAPI.resolveProfile(quote.author);
          Object.assign(quote, { author: resolvedAuthor });
        }
      }

      results.push(Object.assign({}, post, { author, totalComments }));
    }
    data.results = results;
    return data;
  },
  isFollowing: async (_source, { follower, following }, { dataSources }) => {
    const profile = await dataSources.profileAPI.getProfile(follower);
    const followingProfile = await dataSources.profileAPI.getProfile(following);
    return profile.following.indexOf(followingProfile.pubKey) !== -1;
  },
  getComments: async (_source, { postID, limit, offset }, { dataSources }) => {
    const data = await dataSources.commentsAPI.getComments(postID, limit, offset);
    const results = [];
    for (const comment of data.results) {
      const author = await dataSources.profileAPI.resolveProfile(comment.author);
      results.push(Object.assign({}, comment, { author }));
    }
    data.results = results;
    return data;
  },

  getComment: async (_source, { commentID }, { dataSources }) => {
    const commentData = await dataSources.commentsAPI.getComment(commentID);
    const author = await dataSources.profileAPI.resolveProfile(commentData.author);
    return Object.assign({}, commentData, { author });
  },
};

export default query;
