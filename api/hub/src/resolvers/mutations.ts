import { commentsStats, postsStats, REGEX_VALID_URL, statsProvider } from './constants';
import { queryCache } from '../storage/cache';
import {
  addToIpfs,
  createIpfsGatewayLink,
  fetchWithTimeout,
  isIpfsEnabled,
  logger,
  verifyEd25519Sig,
} from '../helpers';
import { getPreviewFromContent } from 'link-preview-js';

const dataSigError = new Error('Data signature was not validated!');
const mutations = {
  addProfileProvider: async (_, { data }, { dataSources, user, signature }) => {
    if (!user) {
      return Promise.reject('Must be authenticated!');
    }
    const verified = await verifyEd25519Sig({
      pubKey: user?.pubKey,
      data: data,
      signature: signature,
    });
    if (!verified) {
      logger.warn(`bad addProfileProvider sig`);
      return Promise.reject(dataSigError);
    }
    return dataSources.profileAPI.addProfileProvider(user.pubKey, data);
  },
  makeDefaultProvider: async (_, { data }, { dataSources, user, signature }) => {
    if (!user) {
      return Promise.reject('Must be authenticated!');
    }
    const verified = await verifyEd25519Sig({
      pubKey: user?.pubKey,
      data: data,
      signature: signature,
    });
    if (!verified) {
      logger.warn(`bad makeDefaultProvider sig`);
      return Promise.reject(dataSigError);
    }
    return dataSources.profileAPI.makeDefaultProvider(user.pubKey, data);
  },
  registerUserName: async (_, { name }, { dataSources, user, signature }) => {
    if (!user) {
      return Promise.reject('Must be authenticated!');
    }
    const verified = await verifyEd25519Sig({
      pubKey: user?.pubKey,
      data: name,
      signature: signature,
    });
    if (!verified) {
      logger.warn(`bad registerUserName sig`);
      return Promise.reject(dataSigError);
    }
    return dataSources.profileAPI.registerUserName(user.pubKey, name);
  },
  createTag: async (_, { name }, { dataSources, user, signature }) => {
    if (!user) {
      return Promise.reject('Must be authenticated!');
    }
    const verified = await verifyEd25519Sig({
      pubKey: user?.pubKey,
      data: name,
      signature: signature,
    });
    if (!verified) {
      logger.warn(`bad createTag sig`);
      return Promise.reject(dataSigError);
    }
    return dataSources.tagsAPI.addTag(name);
  },
  createPost: async (_, { content, post }, { dataSources, user, signature }) => {
    if (!user) {
      return Promise.reject('Must be authenticated!');
    }
    const verified = await verifyEd25519Sig({
      pubKey: user?.pubKey,
      data: content,
      signature: signature,
    });
    if (!verified) {
      logger.warn(`bad createPost sig`);
      return Promise.reject(dataSigError);
    }
    logger.info(`verified createPost sig`);
    const profile = await dataSources.profileAPI.resolveProfile(user.pubKey, true);
    if (!profile.length) {
      return Promise.reject('[Must be authenticated! Profile not found!]');
    }
    const profileData = profile[0];
    const postID = await dataSources.postsAPI.createPost(user.pubKey, content, post);
    if (postID?.length) {
      const totalPostsIndex = profileData.metaData.findIndex(
        m => m.provider === statsProvider && m.property === postsStats,
      );
      if (totalPostsIndex !== -1) {
        profileData.metaData[totalPostsIndex].value =
          +profileData.metaData[totalPostsIndex].value + 1;
        profileData.metaData[totalPostsIndex].value =
          profileData.metaData[totalPostsIndex].value.toString();
      } else {
        profileData.metaData.push({
          provider: statsProvider,
          property: postsStats,
          value: '1',
        });
      }
      await dataSources.profileAPI.updateProfile([profileData]);
    }
    if (post.tags && post.tags.length) {
      for (const tag of post.tags) {
        await dataSources.tagsAPI.indexPost('Posts', postID[0], tag);
      }
    }
    const userIDCache = dataSources.profileAPI.getCacheKey(user.pubKey);
    await queryCache.del(userIDCache);
    return postID[0];
  },
  editPost: async (_, { content, post, id }, { dataSources, user, signature }) => {
    if (!user) {
      return Promise.reject('Must be authenticated!');
    }
    if (!id) {
      return Promise.reject('Must provide a post [id]!');
    }
    const verified = await verifyEd25519Sig({
      pubKey: user?.pubKey,
      data: content,
      signature: signature,
    });
    if (!verified) {
      logger.warn(`bad editPost sig`);
      return Promise.reject(dataSigError);
    }

    const profile = await dataSources.profileAPI.resolveProfile(user.pubKey, true);
    if (!profile.length) {
      return Promise.reject('[Must be authenticated! Profile not found!]');
    }
    const result = await dataSources.postsAPI.editPost(user.pubKey, id, content, post);
    if (result?.addedTags?.length) {
      for (const tag of result.addedTags) {
        await dataSources.tagsAPI.indexPost('Posts', id, tag);
      }
    }

    if (result?.removedTags?.length) {
      for (const tag of result.removedTags) {
        await dataSources.tagsAPI.removePostIndex(id, tag);
      }
    }
    return true;
  },
  removePost: async (_, { id }, { dataSources, user, signature }) => {
    if (!user) {
      return Promise.reject('Must be authenticated!');
    }
    if (!id) {
      return Promise.reject('Must provide a post [id]!');
    }
    const verified = await verifyEd25519Sig({
      pubKey: user?.pubKey,
      data: id,
      signature: signature,
    });
    if (!verified) {
      logger.warn(`bad removePost sig`);
      return Promise.reject(dataSigError);
    }
    const result = await dataSources.postsAPI.deletePost(user.pubKey, id);
    if (result?.removedTags?.length) {
      for (const tag of result.removedTags) {
        await dataSources.tagsAPI.removePostIndex(id, tag);
      }
    }
    return true;
  },
  follow: async (_, { ethAddress }, { dataSources, user, signature }) => {
    if (!user) {
      return Promise.reject('Must be authenticated!');
    }
    const verified = await verifyEd25519Sig({
      pubKey: user?.pubKey,
      data: ethAddress,
      signature: signature,
    });
    if (!verified) {
      logger.warn(`bad follow sig`);
      return Promise.reject(dataSigError);
    }
    return dataSources.profileAPI.followProfile(user.pubKey, ethAddress);
  },
  unFollow: async (_, { ethAddress }, { dataSources, user, signature }) => {
    if (!user) {
      return Promise.reject('Must be authenticated!');
    }
    const verified = await verifyEd25519Sig({
      pubKey: user?.pubKey,
      data: ethAddress,
      signature: signature,
    });
    if (!verified) {
      logger.warn(`bad unFollow sig`);
      return Promise.reject(dataSigError);
    }
    return dataSources.profileAPI.unFollowProfile(user.pubKey, ethAddress);
  },
  saveMetaData: async (_, { data }, { dataSources, user, signature }) => {
    if (!user) {
      return Promise.reject('Must be authenticated!');
    }
    const verified = await verifyEd25519Sig({
      pubKey: user?.pubKey,
      data: data,
      signature: signature,
    });
    if (!verified) {
      logger.warn(`bad saveMetaData sig`);
      return Promise.reject(dataSigError);
    }
    return dataSources.profileAPI.saveMetadata(user.pubKey, data);
  },
  addComment: async (_, { content, comment }, { dataSources, user, signature }) => {
    if (!user) {
      return Promise.reject('Must be authenticated!');
    }
    const verified = await verifyEd25519Sig({
      pubKey: user?.pubKey,
      data: content,
      signature: signature,
    });
    if (!verified) {
      logger.warn(`bad addComment sig`);
      return Promise.reject(dataSigError);
    }
    if (!comment.postID) {
      return Promise.reject('Must provide a postID to the call!');
    }
    const postData = await dataSources.postsAPI.getRealPost(comment.postID);
    if (!postData) {
      return Promise.reject('Post was not found!');
    }
    const commentID = await dataSources.commentsAPI.addComment(user.pubKey, content, comment);
    if (!commentID?.length) {
      return Promise.reject('Could not save the comment!');
    }
    const totalCommentsIndex = postData.metaData.findIndex(
      m => m.provider === statsProvider && m.property === commentsStats,
    );
    if (totalCommentsIndex !== -1) {
      postData.metaData[totalCommentsIndex].value =
        +postData.metaData[totalCommentsIndex].value + 1;
      postData.metaData[totalCommentsIndex].value =
        postData.metaData[totalCommentsIndex].value.toString();
    } else {
      postData.metaData.push({
        provider: statsProvider,
        property: commentsStats,
        value: '1',
      });
    }
    await dataSources.postsAPI.updatePosts([postData]);
    if (comment.tags && comment.tags.length) {
      for (const tag of comment.tags) {
        await dataSources.tagsAPI.indexComment('Comments', commentID[0], tag);
      }
    }
    const postIDCache = dataSources.postsAPI.getPostCacheKey(comment.postID);
    await queryCache.del(postIDCache);
    await queryCache.del(dataSources.postsAPI.getInitialPostCacheKey(comment.postID));
    return commentID[0];
  },
  editComment: async (_, { content, comment, id }, { dataSources, user, signature }) => {
    if (!user) {
      return Promise.reject('Must be authenticated!');
    }
    if (!id) {
      return Promise.reject('Must provide a comment [id]!');
    }
    const verified = await verifyEd25519Sig({
      pubKey: user?.pubKey,
      data: content,
      signature: signature,
    });
    if (!verified) {
      logger.warn(`bad addComment sig`);
      return Promise.reject(dataSigError);
    }
    if (!comment.postID) {
      return Promise.reject('Must provide a postID to the call!');
    }
    const postData = await dataSources.postsAPI.getRealPost(comment.postID);
    if (!postData) {
      return Promise.reject(`Post with [id] ${comment.postID} was not found!`);
    }
    const result = await dataSources.commentsAPI.editComment(user.pubKey, id, content, comment);
    if (result?.addedTags?.length) {
      for (const tag of result.addedTags) {
        await dataSources.tagsAPI.indexComment('Comments', id, tag);
      }
    }

    if (result?.removedTags?.length) {
      for (const tag of result.removedTags) {
        await dataSources.tagsAPI.removeCommentIndex(id, tag);
      }
    }
    return true;
  },

  removeComment: async (_, { id }, { dataSources, user, signature }) => {
    if (!user) {
      return Promise.reject('Must be authenticated!');
    }
    if (!id) {
      return Promise.reject('Must provide a comment [id]!');
    }
    const verified = await verifyEd25519Sig({
      pubKey: user?.pubKey,
      data: id,
      signature: signature,
    });
    if (!verified) {
      logger.warn(`bad removeComment sig`);
      return Promise.reject(dataSigError);
    }
    const result = await dataSources.commentsAPI.deleteComment(user.pubKey, id);
    if (result?.removedTags?.length) {
      for (const tag of result.removedTags) {
        await dataSources.tagsAPI.removeCommentIndex(id, tag);
      }
    }
    return true;
  },
  toggleInterestSub: async (_, { sub }, { dataSources, user, signature }) => {
    if (!user) {
      return Promise.reject('Must be authenticated!');
    }
    if (!sub) {
      return Promise.reject('Must provide a tag to sub/unsub!');
    }
    const verified = await verifyEd25519Sig({
      pubKey: user?.pubKey,
      data: { sub },
      signature: signature,
    });
    if (!verified) {
      logger.warn(`bad toggleInterestSub sig`);
      return Promise.reject(dataSigError);
    }
    return dataSources.profileAPI.toggleInterestSub(user.pubKey, sub);
  },
  getLinkPreview: async (_source, { link }, { user, signature }) => {
    if (!user) {
      return Promise.reject('Must be authenticated!');
    }
    if (!link || typeof link !== `string`) {
      throw new Error(`did not receive a valid url`);
    }
    const verified = await verifyEd25519Sig({
      pubKey: user?.pubKey,
      data: { link },
      signature: signature,
    });
    if (!verified) {
      logger.warn(`bad getLinkPreview sig`);
      return Promise.reject(dataSigError);
    }

    const detectedUrl = link
      .replace(/\n/g, ` `)
      .split(` `)
      .find(token => REGEX_VALID_URL.test(token));

    if (!detectedUrl) {
      throw new Error(`did not receive a valid url`);
    }
    const options = {
      timeout: 12000,
      redirect: 'follow',
      headers: {
        'user-agent': 'Twitterbot',
      },
    };
    const response = await fetchWithTimeout(detectedUrl, options);
    const headers = {};
    response.headers.forEach((header, key) => {
      headers[key] = header;
    });
    const normalizedResponse = {
      url: response.url,
      headers: headers,
      data: await response.text(),
    };
    const preview = await getPreviewFromContent(normalizedResponse);
    if (!isIpfsEnabled) {
      return preview;
    }
    if (preview?.favicons?.length) {
      const pinFavicon = await addToIpfs(preview.favicons[0]);
      if (pinFavicon?.cid) {
        preview.favicons.unshift(createIpfsGatewayLink(pinFavicon.cid.toV1().toString()));
      }
    }

    // typings for link-preview lib are broken
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (preview.mediaType === 'image' && !preview?.images?.length) {
      const pinImage = await addToIpfs(preview.url);
      if (pinImage?.cid) {
        Object.defineProperty(preview, 'images', {
          value: [createIpfsGatewayLink(pinImage.cid.toV1().toString())],
        });
        return preview;
      }
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (preview?.images?.length) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const pinMedia = await addToIpfs(preview.images[0]);

      if (pinMedia?.cid) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        preview.images.unshift(createIpfsGatewayLink(pinMedia.cid.toV1().toString()));
      }
    }
    return preview;
  },
};
export default mutations;
