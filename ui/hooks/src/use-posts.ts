import { IEntryData } from '@akashaproject/design-system/lib/components/Cards/entry-cards/entry-box';
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
  getComment: (commentId: string) => void;
  getPosts: (payload: GetItemsPayload) => void;
  getComments: (payload: GetItemsPayload) => void;
  getUserPosts: (payload: { pubKey: string; limit: number; offset?: string }) => void;
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
  logger?: {};
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
}

export interface GetEntriesResponse {
  channelInfo: any;
  data: { posts: { nextIndex: string; results: any[]; total: number } };
}

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
  });

  const actions: PostsActions = {
    getPost: postId => {
      const entryCall = postsService.entries.getEntry({ entryId: postId });
      const ipfsGatewayCall = ipfsService.getSettings({});
      const getEntryCall = combineLatest([ipfsGatewayCall, entryCall]);
      setPostsState(prev => ({
        ...prev,
        fetchingPosts: prev.fetchingPosts.concat([postId]),
      }));
      getEntryCall.subscribe(async (responses: [any, any]) => {
        const [ipfsResp, entryResp] = responses;
        const ipfsGateway = ipfsResp.data;
        const entry = entryResp.data?.getPost;
        if (entry) {
          const mappedEntry = mapEntry(entry, ipfsGateway, logger);

          const status = await moderationRequest.checkStatus(false, { user }, mappedEntry.entryId);

          const qstatus =
            mappedEntry.quote &&
            (await moderationRequest.checkStatus(false, { user }, mappedEntry.quote.entryId));

          if (status && status.constructor === Object) {
            const modifiedEntry = {
              ...mappedEntry,
              reported: status.reported,
              delisted: status.delisted,
              quote: mappedEntry.quote
                ? {
                    ...mappedEntry.quote,
                    reported:
                      qstatus && status.constructor === Object
                        ? qstatus.reported
                        : mappedEntry.quote.reported,
                    delisted:
                      qstatus && status.constructor === Object
                        ? qstatus.delisted
                        : mappedEntry.quote.reported,
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
        nextPostIndex: null,
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
      calls.subscribe((responses: [any, any]) => {
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
      setPostsState(prev => ({ ...prev, isFetchingPosts: true }));
      const ipfsSettingsCall = ipfsService.getSettings({});
      const calls = combineLatest([ipfsSettingsCall, entriesCall]);
      calls.subscribe(async (responses: [any, any]) => {
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
            if (entry.quotes.length > 0 && newQuoteIds.indexOf(entry.quotes[0]._id) === -1) {
              newQuoteIds.push(entry.quotes[0]._id);
            }
            return mapEntry(entry, ipfsGateway, logger);
          })
          .reduce((obj, post) => ({ ...obj, [post.entryId]: post }), {});

        const status = await moderationRequest.checkStatus(true, { user, contentIds: newIds });

        const qstatus =
          !!newQuoteIds.length &&
          (await moderationRequest.checkStatus(true, { user, contentIds: newQuoteIds }));
        if (status && status.constructor === Array) {
          status.forEach((res: any) => {
            const target = posts[res.contentId];
            let quote: any;

            if (target.quote) {
              const { reported, delisted } = qstatus.find(
                (el: any) => el.contentId === target.quote.entryId,
              );
              quote = {
                ...target.quote,
                reported: reported,
                delisted: delisted,
              };
            }

            posts[res.contentId] = {
              ...target,
              delisted: res.delisted,
              reported: res.reported,
              quote: quote,
            };
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
      }, createErrorHandler('usePosts.getPosts', false, onError));
    },
    getComments: payload => {
      const commentsCall = postsService.comments.getComments({
        ...payload,
        offset: payload.offset || postsState.nextCommentIndex,
      });
      const ipfsSettingsCall = ipfsService.getSettings({});
      setPostsState(prev => ({ ...prev, isFetchingComments: true }));
      const calls = combineLatest([ipfsSettingsCall, commentsCall]);
      calls.subscribe((responses: [any, any]) => {
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
      }, createErrorHandler('usePosts.getComments', false, onError));
    },
    optimisticPublishComment: (commentData, postId, loggedProfile) => {
      const publishObj = buildPublishObject(commentData, postId);
      const pending = createPendingEntry(
        {
          ethAddress: loggedProfile.ethAddress as string,
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
        pendingComments: [pending, ...prev.pendingComments],
      }));
      const publishCall = postsService.comments.addComment(publishObj);
      publishCall.subscribe((resp: any) => {
        const commentId = resp.data.addComment;
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
      let pending: any;
      if (!disablePendingFeedback) {
        pending = createPendingEntry(
          {
            ethAddress: loggedProfile.ethAddress as string,
            avatar: loggedProfile.avatar,
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
            pendingPosts: [pending, ...prev.pendingPosts],
          };
        });
      }

      const postEntryCall = postsService.entries.postEntry(publishObj);
      postEntryCall.subscribe((postingResp: any) => {
        const publishedEntryId = postingResp.data.createPost;
        if (!disablePendingFeedback) {
          const entryData = pending as IEntryData;
          setPostsState(prev => ({
            ...prev,
            postsData: {
              ...prev.postsData,
              [publishedEntryId]: { ...entryData, entryId: publishedEntryId },
            },
            pendingPosts: [],
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

      combineLatest([ipfsGatewayCall, userPostsCall]).subscribe((responses: [any, any]) => {
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
        const posts = results
          .filter(excludeNonSlateContent)
          .map(entry => {
            newIds.push(entry._id);
            return mapEntry(entry, ipfsGatewayResp.data, logger);
          })
          .reduce((obj, post) => ({ ...obj, [post.entryId]: post }), {});

        setPostsState(prev => ({
          ...prev,
          postIds: prev.postIds.concat(newIds),
          postsData: { ...prev.postsData, ...posts },
          nextPostIndex: nextIndex,
          isFetchingPosts: false,
          totalItems: total,
        }));
      }, createErrorHandler('usePosts.getUserPosts', false, onError));
    },
    updatePostsState: (updatedEntry: any) => {
      setPostsState(prev => ({
        ...prev,
        postsData: { ...prev.postsData, [updatedEntry.entryId]: updatedEntry },
      }));
    },
  };
  return [postsState, actions];
};

export default usePosts;
