import { IEntryData } from '@akashaproject/design-system/lib/components/EntryCard/entry-box';
import { IAkashaError } from '@akashaproject/ui-awf-typings';
import * as React from 'react';
import { combineLatest } from 'rxjs';

import moderationRequest from './moderation-request';
import {
  buildPublishObject,
  createPendingEntry,
  excludeNonSlateContent,
  mapEntry,
} from './utils/entry-utils';
import { createErrorHandler } from './utils/error-handler';

export interface GetItemsPayload {
  start?: string;
  offset?: string;
  limit?: number;
}

export interface Status {
  delisted: boolean;
  moderated: boolean;
  reported: boolean;
}

export interface PublishPostData {
  metadata: {
    app: string;
    version: number;
    quote?: string;
    tags: string[];
    mentions: string[];
  };
  author: string;
  content: any;
  textContent: any;
}

export interface PostsActions {
  getPost: (postId: string) => void;
  getPostData: (status: Status, postId: string) => void;
  getComment: (commentId: string) => void;
  getPosts: (payload: GetItemsPayload) => void;
  getComments: (payload: GetItemsPayload) => void;
  getUserPosts: (payload: { pubKey: string; limit: number; offset?: string }) => void;
  getTagPosts: (payload: { name: string; limit: number; offset?: string }) => void;
  optimisticPublishComment: (
    commentData: PublishPostData,
    postId: string,
    loggedProfile: any,
  ) => void;
  optimisticPublishPost: (
    postData: PublishPostData,
    loggedProfile: any,
    currentEmbedEntry: any,
    disablePendingFeedback?: boolean,
  ) => void;
  /* reset post ids (basically reset the list) */
  resetPostIds: () => void;
  updatePostsState: (updatedEntry: any) => void;
}

export interface UsePostsProps {
  user: string | null;
  postsService: any;
  ipfsService: any;
  onError: (error: IAkashaError) => void;
  logger?: unknown;
}

export interface PostsState {
  /* post ids for feed */
  postIds: string[];
  /* comment ids */
  commentIds: string[];
  /* posts/comments data */
  postsData: { [key: string]: any };
  /* next index of posts */
  nextPostIndex: string | number | null;
  /* next index of comments */
  nextCommentIndex: string | null;
  isFetchingPosts: boolean;
  fetchingPosts: string[];
  isFetchingComments: boolean;
  fetchingComments: string[];
  /* pending publish posts */
  pendingPosts: any[];
  /* pending publish comments */
  pendingComments: any[];
  totalItems: number | null;
  delistedItems: string[];
  reportedItems: string[];
}

export interface GetEntriesResponse {
  channelInfo: any;
  data: { posts: { nextIndex: string; results: any[]; total: number } };
}

// tslint:disable:cyclomatic-complexity
/* eslint-disable complexity */
const usePosts = (props: UsePostsProps): [PostsState, PostsActions] => {
  const { user, postsService, ipfsService, logger, onError } = props;
  const [postsState, setPostsState] = React.useState<PostsState>({
    postIds: [],
    commentIds: [],
    postsData: {},
    nextPostIndex: null,
    nextCommentIndex: '',
    isFetchingPosts: false,
    isFetchingComments: false,
    fetchingPosts: [],
    fetchingComments: [],
    pendingPosts: [],
    pendingComments: [],
    totalItems: null,
    delistedItems: [],
    reportedItems: [],
  });

  const [fetchCommentsPayload, setFetchCommentsPayload] = React.useState<GetItemsPayload | null>(
    null,
  );

  React.useEffect(() => {
    if (postsState.isFetchingComments && fetchCommentsPayload) {
      const commentsCall = postsService.comments.getComments(fetchCommentsPayload);
      // console.log(payload.offset, postsState.nextCommentIndex, 'offset, nextIdx');
      const ipfsSettingsCall = ipfsService.getSettings({});
      const calls = combineLatest([ipfsSettingsCall, commentsCall]);
      const sub = calls.subscribe((responses: any[]) => {
        const [ipfsResp, commentsResp] = responses;
        const { data } = commentsResp;
        const { nextIndex, results, total }: GetEntriesResponse['data']['posts'] = data.getComments;
        const newIds: string[] = [];
        const comments = results
          .filter(excludeNonSlateContent)
          .map(entry => {
            newIds.push(entry._id);
            return mapEntry(entry, ipfsResp.data);
          })
          .reduce((obj, post) => ({ ...obj, [post.entryId]: post }), {});

        setPostsState(prev => ({
          ...prev,
          nextCommentIndex: nextIndex,
          postsData: { ...prev.postsData, ...comments },
          commentIds: prev.commentIds.concat(newIds),
          isFetchingComments: false,
          totalItems: total,
        }));
        setFetchCommentsPayload(null);
      }, createErrorHandler('usePosts.getComments', false, onError));
      return () => sub && sub.unsubscribe();
    }
    return;
  }, [postsState.isFetchingComments, fetchCommentsPayload]);

  const actions: PostsActions = {
    getPost: async postId => {
      // check moderation status of post
      const [status] = await moderationRequest.checkStatus(true, { user, contentIds: [postId] });
      // if post is delisted,
      if (status.delisted) {
        // short circuit other requests
        setPostsState(prev => ({
          ...prev,
          delistedItems: !prev.delistedItems.includes(postId)
            ? prev.delistedItems.concat(postId)
            : prev.delistedItems,
        }));
        // if post is reported and not yet moderated
      } else if (status.reported && !status.moderated) {
        // update state,
        setPostsState(prev => ({
          ...prev,
          reportedItems: !prev.reportedItems.includes(postId)
            ? prev.reportedItems.concat(postId)
            : prev.reportedItems,
        }));
        // then continue to fetch post
        actions.getPostData(status, postId);
      } else {
        actions.getPostData(status, postId);
      }
    },
    getPostData: (status: Status, postId) => {
      const entryCall = postsService.entries.getEntry({ entryId: postId });
      const ipfsGatewayCall = ipfsService.getSettings({});
      const getEntryCall = combineLatest([ipfsGatewayCall, entryCall]);
      setPostsState(prev => ({
        ...prev,
        fetchingPosts: prev.fetchingPosts.concat([postId]),
      }));
      getEntryCall.subscribe(async (responses: any[]) => {
        const [ipfsResp, entryResp] = responses;
        const ipfsGateway = ipfsResp.data;
        const entry = entryResp.data?.getPost;
        if (entry) {
          const mappedEntry = mapEntry(
            {
              ...entry,
              reported: status.moderated ? false : status.reported,
              delisted: status.delisted,
            },
            ipfsGateway,
            logger,
          );

          const quotestatus =
            mappedEntry.quote &&
            (await moderationRequest.checkStatus(true, {
              user,
              contentIds: [mappedEntry.quote.entryId],
            }));

          if (quotestatus && quotestatus.constructor === Array) {
            const modifiedEntry = {
              ...mappedEntry,
              reported: status.reported,
              delisted: status.delisted,
              quote: mappedEntry.quote
                ? {
                    ...mappedEntry.quote,
                    // if moderated, bypass value of reported for the user
                    reported: quotestatus[0].moderated ? false : quotestatus[0].reported,
                    delisted: quotestatus[0].delisted,
                  }
                : mappedEntry.quote,
            };

            setPostsState(prev => ({
              ...prev,
              postsData: { ...prev.postsData, [modifiedEntry.entryId]: modifiedEntry },
              fetchingPosts: prev.fetchingPosts.filter(id => id !== postId),
            }));
          } else {
            setPostsState(prev => ({
              ...prev,
              postsData: { ...prev.postsData, [mappedEntry.entryId]: mappedEntry },
              fetchingPosts: prev.fetchingPosts.filter(id => id !== postId),
            }));
          }
        }
      }, createErrorHandler('usePosts.getPost', false, onError));
    },
    resetPostIds: () => {
      setPostsState(prev => ({
        ...prev,
        postIds: [],
        commentIds: [],
        fetchingPosts: [],
        fetchingComments: [],
        pendingPosts: [],
        pendingComments: [],
        nextPostIndex: null,
        nextCommentIndex: null,
        totalItems: null,
      }));
    },
    getComment: commentId => {
      const commentCall = postsService.comments.getComment({ commentID: commentId });
      const ipfsGatewayCall = ipfsService.getSettings({});
      const calls = combineLatest([ipfsGatewayCall, commentCall]);
      setPostsState(prev => ({
        ...prev,
        fetchingComments: prev.fetchingComments.concat([commentId]),
      }));
      calls.subscribe((responses: any[]) => {
        const [ipfsResp, commentResp] = responses;
        const comment = commentResp.data?.getComment;
        if (comment) {
          const mappedComment = mapEntry(comment, ipfsResp.data, logger);
          setPostsState(prev => ({
            ...prev,
            postsData: { ...prev.postsData, [mappedComment.entryId]: mappedComment },
            fetchingComments: prev.fetchingComments.filter(id => id !== commentId),
          }));
        }
      }, createErrorHandler('usePosts.getComment', false, onError));
    },
    getPosts: payload => {
      const entriesCall = postsService.entries.getEntries({
        ...payload,
        offset: payload.offset || postsState.nextPostIndex,
      });
      setPostsState(prev => ({
        ...prev,
        isFetchingPosts: true,
      }));
      const ipfsSettingsCall = ipfsService.getSettings({});
      const calls = combineLatest([ipfsSettingsCall, entriesCall]);
      calls.subscribe(async (responses: any[]) => {
        const [ipfsResp, entriesResp] = responses;
        const ipfsGateway = ipfsResp.data;
        const { data }: GetEntriesResponse = entriesResp;

        const { nextIndex, results, total } = data.posts;
        const newIds: string[] = [];
        const newQuoteIds: string[] = [];
        const posts = results
          .filter(excludeNonSlateContent)
          .map(entry => {
            newIds.push(entry._id);
            // check if entry has quote and id of such quote is not yet in the list
            if (entry.quotes?.length > 0 && newQuoteIds.indexOf(entry.quotes[0]._id) === -1) {
              newQuoteIds.push(entry.quotes[0]._id);
            }
            return mapEntry(entry, ipfsGateway, logger);
          })
          .reduce((obj, post) => ({ ...obj, [post.entryId]: post }), {});
        try {
          const status = await moderationRequest.checkStatus(true, { user, contentIds: newIds });
          const quotestatus =
            !!newQuoteIds.length &&
            (await moderationRequest.checkStatus(true, { user, contentIds: newQuoteIds }));
          if (status && status.constructor === Array) {
            status.forEach((res: any) => {
              const target = posts[res.contentId];
              let quote: any;

              if (target.quote) {
                const { reported, delisted, moderated } = quotestatus.find(
                  (el: any) => el.contentId === target.quote.entryId,
                );
                quote = {
                  ...target.quote,
                  // if moderated, bypass value of reported for the user
                  reported: moderated ? false : reported,
                  delisted: delisted,
                };
              }

              if (res.delisted) {
                const index = newIds.indexOf(res.contentId);
                if (index > -1) {
                  // remove the entry id from newIds
                  newIds.splice(index, 1);
                }
                // remove the entry from posts object
                delete posts[res.contentId];
              } else {
                // update entry in posts object
                posts[res.contentId] = {
                  ...target,
                  delisted: res.delisted,
                  // if moderated, bypass value of reported for the user
                  reported: res.moderated ? false : res.reported,
                  quote: quote,
                };
              }
            });
          }
          setPostsState(prev => ({
            ...prev,
            nextPostIndex: nextIndex,
            postsData: { ...prev.postsData, ...posts },
            postIds: prev.postIds.concat(newIds),
            isFetchingPosts: false,
            totalItems: total,
          }));
        } catch (err) {
          newIds.forEach(id => {
            createErrorHandler(
              `${id}`,
              false,
              onError,
            )(new Error(`Failed to fetch moderated content. ${err.message}`));
          });
        }
      }, createErrorHandler('usePosts.getPosts', false, onError));
    },
    getComments: payload => {
      if (postsState.commentIds.length === postsState.totalItems || postsState.isFetchingComments) {
        return;
      }
      const { offset = postsState.nextCommentIndex, ...other } = payload;

      setPostsState(prev => ({ ...prev, isFetchingComments: true }));

      const params: GetItemsPayload = { ...other };
      if (offset) {
        params.offset = offset;
      }
      setFetchCommentsPayload(params);
    },
    optimisticPublishComment: (commentData, postId, loggedProfile) => {
      const publishObj = buildPublishObject(commentData, postId);
      const pendingId = `${loggedProfile.ethAddress}-${postsState.pendingPosts.length}`;
      const pending = createPendingEntry(
        {
          ethAddress: loggedProfile.ethAddress as string,
          pubKey: loggedProfile.pubKey,
          avatar: loggedProfile.avatar,
          userName: loggedProfile.userName,
          name: loggedProfile.name,
          coverImage: loggedProfile.coverImage,
          description: loggedProfile.description,
        },
        commentData,
      );
      setPostsState(prev => ({
        ...prev,
        pendingComments: [{ pendingId, ...pending }, ...prev.pendingComments],
      }));
      const publishCall = postsService.comments.addComment(publishObj);
      publishCall.subscribe((resp: any) => {
        const commentId = resp.data?.addComment;
        if (!commentId) {
          return setPostsState(prev => {
            const pendingComments = prev.pendingComments.slice();
            const erroredIdx = pendingComments.findIndex(p => p.pendingId === pendingId);
            pendingComments.splice(erroredIdx, 1, {
              ...pendingComments[erroredIdx],
              error: 'There was an error publishing this comment!',
            });

            return {
              ...prev,
              pendingComments,
            };
          });
        }
        setPostsState(prev => ({
          ...prev,
          pendingComments: [],
          postsData: { ...prev.postsData, [commentId]: pending },
          commentIds: [commentId, ...prev.commentIds],
        }));
      }, createErrorHandler('usePosts.optimusticPublishComment'));
    },
    optimisticPublishPost: (postData, loggedProfile, currentEmbedEntry, disablePendingFeedback) => {
      const publishObj = buildPublishObject(postData);
      const pendingId = `${loggedProfile.ethAddress}-${postsState.pendingPosts.length}`;
      let pending: any;
      if (!disablePendingFeedback) {
        pending = createPendingEntry(
          {
            ethAddress: loggedProfile.ethAddress as string,
            pubKey: loggedProfile.pubKey,
            avatar: loggedProfile.avatar,
            name: loggedProfile.name,
            userName: loggedProfile.userName,
            ensName: loggedProfile.ensName,
            coverImage: loggedProfile.coverImage,
            description: loggedProfile.description,
          },
          postData,
          currentEmbedEntry,
        );

        setPostsState(prev => {
          return {
            ...prev,
            pendingPosts: [{ pendingId, ...pending }, ...prev.pendingPosts],
          };
        });
      }
      const postEntryCall = postsService.entries.postEntry(publishObj);
      postEntryCall.subscribe((postingResp: any) => {
        if (!postingResp.data?.createPost) {
          if (!disablePendingFeedback) {
            return setPostsState(prev => {
              const pendingPosts = prev.pendingPosts.slice();
              const erroredIdx = pendingPosts.findIndex(p => p.pendingId === pendingId);
              pendingPosts.splice(erroredIdx, 1, {
                ...pendingPosts[erroredIdx],
                error: 'There was an error publishing this post!',
              });

              return {
                ...prev,
                pendingPosts,
              };
            });
          }
        }
        const publishedEntryId = postingResp.data.createPost;
        if (!disablePendingFeedback) {
          const entryData = pending as IEntryData;
          setPostsState(prev => ({
            ...prev,
            postsData: {
              ...prev.postsData,
              [publishedEntryId]: { ...entryData, entryId: publishedEntryId },
            },
            pendingPosts: prev.pendingPosts.filter(post => post.pendingId !== pendingId),
            postIds: [publishedEntryId, ...prev.postIds],
          }));
        }
      }, createErrorHandler('usePosts.optimisticPublishPost', false, onError));
    },
    getUserPosts: payload => {
      const req: any = {
        ...payload,
      };
      if (typeof postsState.nextPostIndex === 'number') {
        req.offset = postsState.nextPostIndex;
      }
      setPostsState(prev => ({ ...prev, isFetchingPosts: true }));

      const userPostsCall = postsService.entries.entriesByAuthor(req);
      const ipfsGatewayCall = ipfsService.getSettings({});

      combineLatest([ipfsGatewayCall, userPostsCall]).subscribe(async (responses: any[]) => {
        const [ipfsGatewayResp, userPostsResp] = responses;
        const {
          results,
          nextIndex,
          total,
        }: {
          results: any[];
          nextIndex: number;
          total: number;
        } = userPostsResp.data.getPostsByAuthor;
        const newIds: string[] = [];
        const newQuoteIds: string[] = [];
        const posts = results
          .filter(excludeNonSlateContent)
          .map(entry => {
            newIds.push(entry._id);
            // check if entry has quote and id of such quote is not yet in the list
            if (entry.quotes?.length > 0 && newQuoteIds.indexOf(entry.quotes[0]._id) === -1) {
              newQuoteIds.push(entry.quotes[0]._id);
            }
            return mapEntry(entry, ipfsGatewayResp.data, logger);
          })
          .reduce((obj, post) => ({ ...obj, [post.entryId]: post }), {});

        try {
          const status = await moderationRequest.checkStatus(true, { user, contentIds: newIds });
          const quotestatus =
            !!newQuoteIds.length &&
            (await moderationRequest.checkStatus(true, { user, contentIds: newQuoteIds }));
          if (status && status.constructor === Array) {
            status.forEach((res: any) => {
              const target = posts[res.contentId];
              let quote: any;

              if (target.quote) {
                const { reported, delisted, moderated } = quotestatus.find(
                  (el: any) => el.contentId === target.quote.entryId,
                );
                quote = {
                  ...target.quote,
                  // if moderated, bypass value of reported for the user
                  reported: moderated ? false : reported,
                  delisted: delisted,
                };
              }

              if (res.delisted) {
                const index = newIds.indexOf(res.contentId);
                if (index > -1) {
                  // remove the entry id from newIds
                  newIds.splice(index, 1);
                }
                // remove the entry from posts object
                delete posts[res.contentId];
              } else {
                // update entry in posts object
                posts[res.contentId] = {
                  ...target,
                  delisted: res.delisted,
                  // if moderated, bypass value of reported for the user
                  reported: res.moderated ? false : res.reported,
                  quote: quote,
                };
              }
            });
          }
          setPostsState(prev => ({
            ...prev,
            nextPostIndex: nextIndex,
            postsData: { ...prev.postsData, ...posts },
            postIds: prev.postIds.concat(newIds),
            isFetchingPosts: false,
            totalItems: total,
          }));
        } catch (err) {
          newIds.forEach(id => {
            createErrorHandler(
              `${id}`,
              false,
              onError,
            )(new Error(`Failed to fetch moderated content. ${err.message}`));
          });
        }
      }, createErrorHandler('usePosts.getUserPosts', false, onError));
    },
    getTagPosts: payload => {
      const req: any = {
        ...payload,
      };
      if (typeof postsState.nextPostIndex === 'number') {
        req.offset = postsState.nextPostIndex;
      }
      setPostsState(prev => ({ ...prev, isFetchingPosts: true }));

      const tagPostsCall = postsService.entries.entriesByTag(req);
      const ipfsGatewayCall = ipfsService.getSettings({});

      combineLatest([ipfsGatewayCall, tagPostsCall]).subscribe(async (responses: any[]) => {
        const [ipfsGatewayResp, tagPostsResp] = responses;
        const {
          results,
          nextIndex,
          total,
        }: {
          results: any[];
          nextIndex: number;
          total: number;
        } = tagPostsResp.data.getPostsByTag;
        const newIds: string[] = [];
        const newQuoteIds: string[] = [];
        const posts = results
          .filter(excludeNonSlateContent)
          .map(entry => {
            newIds.push(entry._id);
            // check if entry has quote and id of such quote is not yet in the list
            if (entry.quotes?.length > 0 && newQuoteIds.indexOf(entry.quotes[0]._id) === -1) {
              newQuoteIds.push(entry.quotes[0]._id);
            }
            return mapEntry(entry, ipfsGatewayResp.data, logger);
          })
          .reduce((obj, post) => ({ ...obj, [post.entryId]: post }), {});

        try {
          const status = await moderationRequest.checkStatus(true, { user, contentIds: newIds });
          const quotestatus =
            !!newQuoteIds.length &&
            (await moderationRequest.checkStatus(true, { user, contentIds: newQuoteIds }));
          if (status && status.constructor === Array) {
            status.forEach((res: any) => {
              const target = posts[res.contentId];
              let quote: any;

              if (target.quote) {
                const { reported, delisted, moderated } = quotestatus.find(
                  (el: any) => el.contentId === target.quote.entryId,
                );
                quote = {
                  ...target.quote,
                  // if moderated, bypass value of reported for the user
                  reported: moderated ? false : reported,
                  delisted: delisted,
                };
              }

              if (res.delisted) {
                const index = newIds.indexOf(res.contentId);
                if (index > -1) {
                  // remove the entry id from newIds
                  newIds.splice(index, 1);
                }
                // remove the entry from posts object
                delete posts[res.contentId];
              } else {
                // update entry in posts object
                posts[res.contentId] = {
                  ...target,
                  delisted: res.delisted,
                  // if moderated, bypass value of reported for the user
                  reported: res.moderated ? false : res.reported,
                  quote: quote,
                };
              }
            });
          }
          setPostsState(prev => ({
            ...prev,
            nextPostIndex: nextIndex,
            postsData: { ...prev.postsData, ...posts },
            postIds: prev.postIds.concat(newIds),
            isFetchingPosts: false,
            totalItems: total,
          }));
        } catch (err) {
          newIds.forEach(id => {
            createErrorHandler(
              `${id}`,
              false,
              onError,
            )(new Error(`Failed to fetch moderated content. ${err.message}`));
          });
        }
      }, createErrorHandler('usePosts.getTagPosts', false, onError));
    },
    updatePostsState: (updatedEntry: any) => {
      setPostsState(prev => {
        const index = prev.reportedItems.indexOf(updatedEntry.entryId);
        if (index > -1) {
          prev.reportedItems.splice(index, 1);
        }
        return {
          ...prev,
          postsData: { ...prev.postsData, [updatedEntry.entryId]: updatedEntry },
          reportedItems: prev.reportedItems,
        };
      });
    },
  };
  return [postsState, actions];
};
// tslint:disable:cyclomatic-complexity
/* eslint-disable complexity */
export default usePosts;
