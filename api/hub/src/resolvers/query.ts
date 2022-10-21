import { commentsStats, statsProvider } from './constants';
import { queryCache, registryCache } from '../storage/cache';
import { ExtendedAuthor, PostOverride } from '../collections/interfaces';
import { ethers } from 'ethers';
import {
  createIpfsGatewayLink,
  createIpfsGatewayPath,
  fetchWithTimeout,
  getIcRegistryContract,
  logger,
  multiAddrToUri,
  verifyEd25519Sig,
} from '../helpers';
import { CID } from 'multiformats/cid';
import { base16 } from 'multiformats/bases/base16';

export const MANIFEST_FILE = 'manifest.json';
const query = {
  getProfile: async (_source, { ethAddress }, { dataSources }) => {
    return dataSources.profileAPI.getProfile(ethAddress);
  },
  resolveProfile: async (_source, { pubKey }, { dataSources }) => {
    return dataSources.profileAPI.resolveProfile(pubKey);
  },
  getPost: async (_source, { id, pubKey }, { dataSources }): Promise<PostOverride> => {
    const cacheKey = dataSources.postsAPI.getPostCacheKey(id);
    const hasKey = await queryCache.has(cacheKey);
    if (hasKey) {
      return queryCache.get(cacheKey);
    }
    const postData = await dataSources.postsAPI.getPost(id, pubKey);
    const totalCommentsIndex = postData.metaData.findIndex(
      m => m.provider === statsProvider && m.property === commentsStats,
    );
    const totalComments =
      totalCommentsIndex !== -1 ? postData.metaData[totalCommentsIndex].value : '0';
    if (postData && typeof postData.author === 'string') {
      const author = await dataSources.profileAPI.resolveProfile(postData.author);
      Object.assign(postData, { author });
    }
    if (postData && postData?.quotedBy?.length && !postData?.quotedByAuthors?.length) {
      const qPosts = await Promise.all(
        postData.quotedBy?.map(postID =>
          query.getPost(_source, { pubKey, id: postID }, { dataSources }),
        ),
      );
      let uniqueAuthors: Record<string, { pubKey: string }> = {};
      qPosts.forEach((el: ExtendedAuthor) => {
        uniqueAuthors[el.author.pubKey] = el.author;
      });
      const quotedByAuthors = Object.values(uniqueAuthors);
      uniqueAuthors = null;
      // @Todo: replace the sorting algo
      // if (pubKey) {
      //   const pProfile = await dataSources.profileAPI.resolveProfile(pubKey);
      //   quotedByAuthors?.sort((a, b) => {
      //     return pProfile.following.indexOf(b.pubKey) - pProfile.following.indexOf(a.pubKey);
      //   });
      // }

      Object.assign(postData, { quotedByAuthors });
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
    const result = Object.assign({}, postData, { totalComments });
    await queryCache.set(cacheKey, result);
    await dataSources.postsAPI.storeCacheKey(postData.author?.pubKey || postData.author, cacheKey);
    return result;
  },

  getTag: async (_source, { name }, { dataSources }) => {
    return dataSources.tagsAPI.getTag(name);
  },
  searchTags: async (_source, { name }, { dataSources }) => {
    return dataSources.tagsAPI.searchTags(name);
  },
  searchProfiles: async (_source, { name }, { dataSources }) => {
    return dataSources.profileAPI.searchProfiles(name);
  },
  tags: async (_source, { limit, offset }, { dataSources }) => {
    return dataSources.tagsAPI.getTags(limit, offset || 0);
  },
  posts: async (_source, { limit, offset, pubKey }, { dataSources }) => {
    const data = await dataSources.postsAPI.getPosts(limit, offset || 0, pubKey);
    const results = [];

    for (const post of data.results) {
      const author =
        typeof post.author === 'string'
          ? await dataSources.profileAPI.resolveProfile(post.author)
          : post.author;
      const totalCommentsIndex = post.metaData.findIndex(
        m => m.provider === statsProvider && m.property === commentsStats,
      );
      const totalComments =
        totalCommentsIndex !== -1 ? post.metaData[totalCommentsIndex].value : '0';

      if (post && post?.quotedBy?.length && !post?.quotedByAuthors?.length) {
        const qPosts = await Promise.all(
          post.quotedBy?.map(postID =>
            query.getPost(_source, { pubKey, id: postID }, { dataSources }),
          ),
        );
        let uniqueAuthors: Record<string, { pubKey: string }> = {};
        qPosts.forEach((el: ExtendedAuthor) => {
          uniqueAuthors[el.author.pubKey] = el.author;
        });
        const quotedByAuthors = Object.values(uniqueAuthors);
        uniqueAuthors = null;
        // @Todo: replace sorting algo
        // if (pubKey) {
        //   const pProfile = await dataSources.profileAPI.resolveProfile(pubKey);
        //   quotedByAuthors?.sort((a, b) => {
        //     return pProfile.following.indexOf(b.pubKey) - pProfile.following.indexOf(a.pubKey);
        //   });
        // }
        Object.assign(post, { quotedByAuthors });
      }
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
    return dataSources.followerAPI.isFollowing(follower, following);
  },
  getComments: async (_source, { postID, limit, offset }, { dataSources }) => {
    const data = await dataSources.commentsAPI.getComments(postID, limit, offset || 0);
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
  getPostsByAuthor: async (_source, { author, limit, offset, pubKey }, { dataSources }) => {
    const returned = await dataSources.postsAPI.getPostsByAuthor(author, offset || 0, limit);
    const posts = await Promise.all(
      returned.results.map(post => {
        return query.getPost(_source, { pubKey, id: post.objectID }, { dataSources });
      }),
    );
    return Object.assign({}, returned, { results: posts });
  },
  getPostsByTag: async (_source, { tag, limit, offset, pubKey }, { dataSources }) => {
    const returned = await dataSources.postsAPI.getPostsByTag(tag, offset || 0, limit);
    const posts = await Promise.all(
      returned.results.map(post => {
        return query.getPost(_source, { pubKey, id: post.objectID }, { dataSources });
      }),
    );
    return Object.assign({}, returned, { results: posts });
  },
  globalSearch: async (_source, { keyword }, { dataSources }) => {
    const results = await dataSources.postsAPI.globalSearch(keyword?.trim());
    results.tags = await (async () => {
      const res = [];
      for (const rec of results.tags) {
        const tag = await dataSources.tagsAPI.getTag(rec.name);
        res.push(Object.assign({}, rec, { totalPosts: tag?.posts?.length || 0 }));
      }
      return res;
    })();
    return results;
  },
  getFollowers: async (_source, { limit, offset, pubKey }, { dataSources }) => {
    const returned = await dataSources.followerAPI.getFollowers(pubKey, limit, offset);
    returned.results = await Promise.all(
      returned.results.map(_pubKey => {
        return query.resolveProfile(_source, { pubKey: _pubKey }, { dataSources });
      }),
    );
    return returned;
  },

  getFollowing: async (_source, { limit, offset, pubKey }, { dataSources }) => {
    const returned = await dataSources.followerAPI.getFollowing(pubKey, limit, offset);
    returned.results = await Promise.all(
      returned.results.map(_pubKey => {
        return query.resolveProfile(_source, { pubKey: _pubKey }, { dataSources });
      }),
    );
    return returned;
  },

  /**
   * Returns posts made by the last 1000 accounts followed
   * @param _source
   * @param limit
   * @param offset
   * @param dataSources
   * @param user
   */
  getCustomFeed: async (_source, { limit, offset }, { dataSources, user }) => {
    if (!user?.pubKey) {
      return Promise.reject('Must be authenticated!');
    }
    const res = await dataSources.followerAPI.getFollowing(user.pubKey, 1000, 0);
    const profile = await dataSources.profileAPI.resolveProfile(user.pubKey);
    const followingList: string[] = res.results;
    const postsIDs = await dataSources.postsAPI.getPostsByAuthorsAndTags(
      followingList || [],
      profile?.interests || [],
      offset,
      limit,
    );
    const posts = await Promise.all(
      postsIDs.results.map(post => {
        return query.getPost(_source, { pubKey: user.pubKey, id: post.objectID }, { dataSources });
      }),
    );
    return Object.assign({}, postsIDs, { results: posts });
  },

  getInterests: async (_source, { pubKey }, { dataSources }) => {
    const interests: string[] = await dataSources.profileAPI.getInterests(pubKey);
    return Array.from(interests);
  },
  getIntegrationInfo: async (_source, { integrationIDs }, { dataSources }) => {
    const results = [];
    const queryPrefix = '0xf-';
    for (const integrationID of integrationIDs) {
      const cacheKey = `${queryPrefix}${integrationID}`;
      const hasKey = await registryCache.has(cacheKey);
      if (hasKey) {
        results.push(registryCache.get(cacheKey));
        continue;
      }
      const data = await getIcRegistryContract().getPackageInfo(integrationID);
      if (data.author === ethers.constants.AddressZero) {
        results.push({
          id: integrationID,
        });
        continue;
      }
      const integrationInfo = {
        id: integrationID,
        name: data.integrationName,
        author: data.author,
        latestReleaseId: data.latestReleaseId,
        integrationType: data.integrationType,
        enabled: data.enabled,
      };
      results.push(integrationInfo);
      await registryCache.set(cacheKey, integrationInfo, 3600);
    }
    return results;
  },
  getLatestRelease: async (_source, { integrationIDs }, { dataSources }) => {
    const results = [];
    const queryPrefix = '0xfi-';
    for (const integrationID of integrationIDs) {
      const cacheKey = `${queryPrefix}${integrationID}`;
      const hasKey = await registryCache.has(cacheKey);
      if (hasKey) {
        results.push(registryCache.get(cacheKey));
        continue;
      }
      const pkgInfo = await getIcRegistryContract().getPackageInfo(integrationID);
      if (pkgInfo.author === ethers.constants.AddressZero) {
        results.push({
          integrationID: integrationID,
        });
        continue;
      }
      const data = await getIcRegistryContract().getReleaseData(pkgInfo.latestReleaseId);
      const cid = CID.parse('f' + data.manifestHash.substring(2), base16.decoder);
      const ipfsLink = createIpfsGatewayPath(cid.toString());
      logger.info(`fetching manifest ${ipfsLink}`);
      const d = await fetchWithTimeout(ipfsLink, {
        timeout: 60000,
        redirect: 'follow',
      });
      const { links, sources } = (await d.json()) as { links: string[]; sources: string[] };
      const ipfsSources = multiAddrToUri(sources);
      let manifest: {
        mainFile: string;
        license?: string;
        description?: string;
        keywords?: string[];
        displayName?: string;
      };
      if (ipfsSources.length) {
        const manifestReq = await fetchWithTimeout(`${ipfsSources[0]}/${MANIFEST_FILE}`, {
          timeout: 10000,
          redirect: 'follow',
        });
        manifest = (await manifestReq.json()) as typeof manifest;
        ipfsSources[0] = `${ipfsSources[0]}/${manifest.mainFile}`;
      }
      const releaseInfo = {
        id: pkgInfo.latestReleaseId,
        name: pkgInfo.integrationName,
        version: data.version,
        integrationType: pkgInfo.integrationType,
        links: links,
        sources: ipfsSources.slice(0, 1),
        author: pkgInfo.author,
        integrationID: integrationID,
        enabled: pkgInfo.enabled,
        manifestData: manifest,
        createdAt: data.createdAt?.toNumber(),
      };
      results.push(releaseInfo);
      await registryCache.set(cacheKey, releaseInfo, 7200);
    }
    return results;
  },

  isUserNameAvailable: async (_source, { userName }, { dataSources, user, signature }) => {
    if (!user) {
      return Promise.reject('Must be authenticated!');
    }
    if (!userName || typeof userName !== `string`) {
      throw new Error(`did not receive a valid userName`);
    }
    const verified = await verifyEd25519Sig({
      pubKey: user?.pubKey,
      data: { userName },
      signature: signature,
    });
    if (!verified) {
      logger.warn(`bad isUserNameAvailable sig`);
      return Promise.reject(`Data signature for isUserNameAvailable was not validated!`);
    }
    return dataSources.profileAPI.isUserNameAvailable(userName);
  },
  getReplies: async (_source, { postID, commentID, limit, offset }, { dataSources }) => {
    const data = await dataSources.commentsAPI.getReplies(
      postID,
      commentID,
      limit || 5,
      offset || 0,
    );
    const results = [];
    for (const comment of data.results) {
      const author = await dataSources.profileAPI.resolveProfile(comment.author);
      results.push(Object.assign({}, comment, { author }));
    }
    data.results = results;
    return data;
  },
};

export default query;
