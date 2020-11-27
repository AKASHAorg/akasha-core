const query = {
  getProfile: async (_source, { ethAddress }, { dataSources }) => {
    return await dataSources.profileAPI.getProfile(ethAddress);
  },
  resolveProfile: async (_source, { pubKey }, { dataSources }) => {
    return await dataSources.profileAPI.resolveProfile(pubKey);
  },
  getPost: async (_source, { id }, { dataSources }) => {
    const postData = await dataSources.postsAPI.getPost(id);
    const author = await dataSources.profileAPI.resolveProfile(postData.author);
    return Object.assign({}, postData, { author });
  },

  getTag: async (_source, { name }, { dataSources }) => {
    return dataSources.tagsAPI.getTag(name);
  },
  tags: async (_source, { limit, offset }, { dataSources }) => {
    return dataSources.tagsAPI.getTags(limit, offset);
  },
  posts: async (_source, { limit, offset }, { dataSources }) => {
    const data = await dataSources.postsAPI.getPosts(limit, offset);
    const results = [];
    for (const post of data.results) {
      const author = await dataSources.profileAPI.resolveProfile(post.author);
      results.push(Object.assign({}, post, { author }));
    }
    data.results = results;
    return data;
  },
  isFollowing: async (_source, { follower, following }, { dataSources }) => {
    const profile = await dataSources.profileAPI.getProfile(follower);
    const followingProfile = await dataSources.profileAPI.getProfile(following);
    return profile.following.indexOf(followingProfile.pubKey) !== -1;
  },
};

export default query;
