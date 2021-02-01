import { IEntryData } from '@akashaproject/design-system/lib/components/Cards/entry-cards/entry-box';
import { IAkashaError } from '@akashaproject/ui-awf-typings';
import * as React from 'react';
import { combineLatest } from 'rxjs';
import {
  buildPublishObject,
  createPendingEntry,
  mapEntry,
  PROPERTY_SLATE_CONTENT,
} from './utils/entry-utils';
import { createErrorHandler } from './utils/error-handler';

export interface GetPostsPayload {
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
  getPosts: (payload: GetPostsPayload) => void;
  getUserPosts: (userId: string) => void;
  optimisticPublish: (
    postData: PublishPostData,
    loggedProfile: any,
    currentEmbedEntry: any,
  ) => void;
}

export interface UsePostsProps {
  postsService: { entries: any };
  ipfsService: any;
  profileService?: any;
  onError: (error: IAkashaError) => void;
  logger?: {};
}

export interface PostsState {
  /* post ids for feed */
  postIds: string[];
  /* posts data */
  postsData: { [key: string]: any };
  nextIndex: string | null;
  isFetchingList: boolean;
  isFetchingPosts: string[];
  pending: any[];
}

export interface GetEntriesResponse {
  channelInfo: any;
  data: { posts: { nextIndex: string; results: any[] } };
}

const usePosts = (props: UsePostsProps): [PostsState, PostsActions] => {
  const { postsService, ipfsService, profileService, logger, onError } = props;
  const [postsState, setPostsState] = React.useState<PostsState>({
    postIds: [],
    postsData: {},
    nextIndex: '',
    isFetchingList: false,
    isFetchingPosts: [],
    pending: [],
  });

  const actions: PostsActions = {
    getPost: postId => {
      const entryCall = postsService.entries.getEntry({ entryId: postId });
      const ipfsGatewayCall = ipfsService.getSettings({});
      const getEntryCall = combineLatest([ipfsGatewayCall, entryCall]);
      setPostsState(prev => ({
        ...prev,
        isFetchingPosts: prev.isFetchingPosts.concat([postId]),
      }));
      getEntryCall.subscribe((responses: [any, any]) => {
        const [ipfsResp, entryResp] = responses;
        const ipfsGateway = ipfsResp.data;
        const entry = entryResp.data?.getPost;
        if (entry) {
          const mappedEntry = mapEntry(entry, ipfsGateway, logger);
          setPostsState(prev => ({
            ...prev,
            postsData: { ...prev.postsData, [mappedEntry.entryId]: mappedEntry },
            isFetchingPosts: prev.isFetchingPosts.filter(id => id !== postId),
          }));
        }
      }, createErrorHandler('usePosts.getPost', false, onError));
    },
    getPosts: payload => {
      const entriesCall = postsService.entries.getEntries({
        ...payload,
        offset: payload.offset || postsState.nextIndex,
      });
      setPostsState(prev => ({ ...prev, isFetchingList: true }));
      const ipfsSettingsCall = ipfsService.getSettings({});
      const calls = combineLatest([ipfsSettingsCall, entriesCall]);
      calls.subscribe((responses: [any, any]) => {
        const [ipfsResp, entriesResp] = responses;
        const ipfsGateway = ipfsResp.data;
        const { data }: GetEntriesResponse = entriesResp;

        const { nextIndex, results } = data.posts;
        const newIds: string[] = [];
        const posts = results
          .filter(entry => {
            return (
              entry.content.findIndex((elem: any) => elem.property === PROPERTY_SLATE_CONTENT) > -1
            );
          })
          .map(entry => {
            newIds.push(entry._id);
            return mapEntry(entry, ipfsGateway, logger);
          })
          .reduce((obj, post) => ({ ...obj, [post.entryId]: post }), {});

        setPostsState(prev => ({
          ...prev,
          postsData: { ...prev.postsData, ...posts },
          postIds: prev.postIds.concat(newIds),
          isFetchingList: false,
          nextIndex,
        }));
      }, createErrorHandler('usePosts.getPosts', false, onError));
    },
    optimisticPublish: (postData, loggedProfile, currentEmbedEntry) => {
      const publishObj = buildPublishObject(postData);
      const pending = createPendingEntry(
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

      const postEntryCall = postsService.entries.postEntry(publishObj);
      setPostsState(prev => {
        return {
          ...prev,
          pending: [pending, ...prev.pending],
        };
      });

      postEntryCall.subscribe((postingResp: any) => {
        const publishedEntryId = postingResp.data.createPost;
        const entryData = pending as IEntryData;
        setPostsState(prev => ({
          ...prev,
          postsData: { ...prev.postsData, [publishedEntryId]: entryData },
          pending: [],
          postIds: [publishedEntryId, ...prev.postIds],
        }));
      }, createErrorHandler('usePosts.optimisticPublish', false, onError));
    },
    getUserPosts: (userId: string) => {
      if (!profileService) {
        return console.error('Cannot use getUserPosts without passing profileService module!');
      }
      const userPostsCall = profileService.getPosts(userId);
      const ipfsGatewayCall = ipfsService.getSettings({});
      combineLatest([ipfsGatewayCall, userPostsCall]).subscribe((responses: [any, any]) => {
        const [ipfsGatewayResp, userPostsResp] = responses;
        setPostsState(prev => ({
          ...prev,
          postIds: userPostsResp.data.map((post: any) => post._id),
          // should we keep already fetched data for posts?
          // if yes, start the reduce with {...prev.postsData}
          postsData: userPostsResp.data.reduce(
            (acc: {}, post: any) => ({
              ...acc,
              [post._id]: mapEntry(post, ipfsGatewayResp.data, logger),
            }),
            {
              /* ...prev.postsData */
            },
          ),
        }));
      }, createErrorHandler('usePosts.getUserPosts', false, onError));
    },
  };
  return [postsState, actions];
};

export default usePosts;
