import { getPreviewFromContent } from 'link-preview-js';
import { commentsStats, REGEX_VALID_URL, statsProvider } from './constants';
import { queryCache } from '../storage/cache';
import { fetchWithTimeout } from '../helpers';

const query = {
  getProfile: async (_source, { ethAddress }, { dataSources }) => {
    return dataSources.profileAPI.getProfile(ethAddress);
  },
  resolveProfile: async (_source, { pubKey }, { dataSources }) => {
    return dataSources.profileAPI.resolveProfile(pubKey);
  },
  getPost: async (_source, { id, pubKey }, { dataSources }) => {
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
      const qPosts: any = await Promise.all(
        postData.quotedBy?.map(postID =>
          query.getPost(_source, { pubKey, id: postID }, { dataSources }),
        ),
      );
      let uniqueAuthors = {};
      qPosts.forEach(el => {
        uniqueAuthors[el.author.pubKey] = el.author;
      });
      const quotedByAuthors: any = Object.values(uniqueAuthors);
      uniqueAuthors = null;
      if (pubKey) {
        const pProfile = await dataSources.profileAPI.resolveProfile(pubKey);
        quotedByAuthors?.sort((a, b) => {
          return pProfile.following.indexOf(b.pubKey) - pProfile.following.indexOf(a.pubKey);
        });
      }

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
        const qPosts: any = await Promise.all(
          post.quotedBy?.map(postID =>
            query.getPost(_source, { pubKey, id: postID }, { dataSources }),
          ),
        );
        let uniqueAuthors = {};
        qPosts.forEach(el => {
          uniqueAuthors[el.author.pubKey] = el.author;
        });
        const quotedByAuthors: any = Object.values(uniqueAuthors);
        uniqueAuthors = null;
        if (pubKey) {
          const pProfile = await dataSources.profileAPI.resolveProfile(pubKey);
          quotedByAuthors?.sort((a, b) => {
            return pProfile.following.indexOf(b.pubKey) - pProfile.following.indexOf(a.pubKey);
          });
        }
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
    const profile = await dataSources.profileAPI.getProfile(follower);
    const followingProfile = await dataSources.profileAPI.getProfile(following);
    return profile.following.indexOf(followingProfile.pubKey) !== -1;
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
    const results = await dataSources.postsAPI.globalSearch(keyword);
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
    const returned = await dataSources.profileAPI.getFollowers(pubKey, limit, offset);
    returned.results = await Promise.all(
      returned.results.map(_pubKey => {
        return query.resolveProfile(_source, { pubKey: _pubKey }, { dataSources });
      }),
    );
    return returned;
  },

  getFollowing: async (_source, { limit, offset, pubKey }, { dataSources }) => {
    const returned = await dataSources.profileAPI.getFollowing(pubKey, limit, offset);
    returned.results = await Promise.all(
      returned.results.map(_pubKey => {
        return query.resolveProfile(_source, { pubKey: _pubKey }, { dataSources });
      }),
    );
    return returned;
  },
  getLinkPreview: async (_source, { link }) => {
    if (!link || typeof link !== `string`) {
      throw new Error(`did not receive a valid url`);
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
    return getPreviewFromContent(normalizedResponse);
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
    const res = await dataSources.profileAPI.getFollowing(user.pubKey, 1000, 0);
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
};

export default query;
