import { commentsStats, statsProvider } from './constants';

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
  follow: async (_, { ethAddress }, { dataSources, user }) => {
    if (!user) {
      return Promise.reject('Must be authenticated!');
    }
    return await dataSources.profileAPI.followProfile(user.pubKey, ethAddress);
  },
  unFollow: async (_, { ethAddress }, { dataSources, user }) => {
    if (!user) {
      return Promise.reject('Must be authenticated!');
    }
    return await dataSources.profileAPI.unFollowProfile(user.pubKey, ethAddress);
  },
  saveMetaData: async (_, { data }, { dataSources, user }) => {
    if (!user) {
      return Promise.reject('Must be authenticated!');
    }
    return await dataSources.profileAPI.saveMetadata(user.pubKey, data);
  },
  addComment: async (_, { content, comment }, { dataSources, user }) => {
    if (!user) {
      return Promise.reject('Must be authenticated!');
    }
    if (!comment.postID) {
      return Promise.reject('Must provide a postID to the call!');
    }
    const postData = await dataSources.postsAPI.getRealPost(comment.postID);
    if (!postData) {
      return Promise.reject('Post was not found!');
    }
    const commentID = await dataSources.commentsAPI.addComment(user.pubKey, content, comment);
    if (commentID?.length) {
      const totalCommentsIndex = postData.metaData.findIndex(
        m => m.provider === statsProvider && m.property === commentsStats,
      );
      if (totalCommentsIndex !== -1) {
        postData.metaData[totalCommentsIndex].value =
          +postData.metaData[totalCommentsIndex].value + 1;
        postData.metaData[totalCommentsIndex].value = postData.metaData[
          totalCommentsIndex
        ].value.toString();
      } else {
        postData.metaData.push({
          provider: statsProvider,
          property: commentsStats,
          value: '1',
        });
      }
      await dataSources.postsAPI.updatePosts([postData]);
    }
    return commentID[0];
  },
};
export default mutations;
