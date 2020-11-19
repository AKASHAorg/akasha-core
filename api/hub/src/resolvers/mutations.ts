const mutations = {
  addProfileProvider: async (_, { data }, { dataSources, user }) => {
    if (!user) {
      return Promise.reject('Must be authenticated!');
    }
    return await dataSources.profileAPI.addProfileProvider(user.pubKey, data);
  },
  makeDefaultProvider: async (_, { data }, { dataSources, user }) => {
    if (!user) {
      return Promise.reject('Must be authenticated!');
    }
    return await dataSources.profileAPI.makeDefaultProvider(user.pubKey, data);
  },
  registerUserName: async (_, { name }, { dataSources, user }) => {
    if (!user) {
      return Promise.reject('Must be authenticated!');
    }
    return await dataSources.profileAPI.registerUserName(user.pubKey, name);
  },
  createTag: async (_, { name }, { dataSources, user }) => {
    if (!user) {
      return Promise.reject('Must be authenticated!');
    }
    return await dataSources.tagsAPI.addTag(name);
  },
  createPost: async (_, { content, post }, { dataSources, user }) => {
    if (!user) {
      return Promise.reject('Must be authenticated!');
    }
    const postID = await dataSources.postsAPI.createPost(user.pubKey, content, post);
    if (post.tags && post.tags.length) {
      for (const tag of post.tags) {
        await dataSources.tagsAPI.indexPost('Posts', postID[0], tag);
      }
    }
    return postID[0];
  },
};
export default mutations;
