const query = {
  profile: async (_source, { ethAddress }, { dataSources }) => {
    const data = await dataSources.profileAPI.getProfile(ethAddress);
    // return {
    //   ethAddress:
    //   userName:
    //   name:
    //   description:
    //   avatar:
    //   coverImage:
    // }
    // tslint:disable-next-line:no-console
    console.log('data', data);
    return data;
  },
  post: async (_source, { id }, { dataSources }) => {
    return dataSources.postsAPI.getPost(id);
  },
};

export default query;
