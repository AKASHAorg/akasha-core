import * as Types from './graphql-types';

export type DataProviderFragmentFragment = { provider: string, property: string, value: string };

export type AuthorInfoFragment = { pubKey: string, name?: string | null, userName?: string | null, avatar?: string | null, coverImage?: string | null, description?: string | null, ethAddress: string, totalPosts?: string | null, totalFollowers: number, totalFollowing: number, totalInterests: number };

export type GetCommentQueryVariables = Types.Exact<{
  commentID: Types.Scalars['String'];
}>;


export type GetCommentQuery = { getComment: { creationDate: string, updatedAt?: string | null, replyTo?: string | null, postId: string, totalReplies?: number | null, _id: string, content?: Array<{ provider: string, property: string, value: string }> | null, author: { pubKey: string, name?: string | null, userName?: string | null, avatar?: string | null, coverImage?: string | null, description?: string | null, ethAddress: string, totalPosts?: string | null, totalFollowers: number, totalFollowing: number, totalInterests: number } } };

export type GetCommentsQueryVariables = Types.Exact<{
  offset?: Types.InputMaybe<Types.Scalars['String']>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  postID: Types.Scalars['String'];
}>;


export type GetCommentsQuery = { getComments?: { total?: number | null, nextIndex?: string | null, results?: Array<{ creationDate: string, replyTo?: string | null, postId: string, totalReplies?: number | null, _id: string, content?: Array<{ provider: string, property: string, value: string }> | null, author: { pubKey: string, name?: string | null, userName?: string | null, avatar?: string | null, coverImage?: string | null, description?: string | null, ethAddress: string, totalPosts?: string | null, totalFollowers: number, totalFollowing: number, totalInterests: number } }> | null } | null };

export type GetRepliesQueryVariables = Types.Exact<{
  offset?: Types.InputMaybe<Types.Scalars['String']>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  postID: Types.Scalars['String'];
  commentID: Types.Scalars['String'];
}>;


export type GetRepliesQuery = { getReplies?: { total?: number | null, nextIndex?: string | null, results?: Array<{ creationDate: string, replyTo?: string | null, postId: string, totalReplies?: number | null, _id: string, content?: Array<{ provider: string, property: string, value: string }> | null, author: { pubKey: string, name?: string | null, userName?: string | null, avatar?: string | null, coverImage?: string | null, description?: string | null, ethAddress: string, totalPosts?: string | null, totalFollowers: number, totalFollowing: number, totalInterests: number } }> | null } | null };

export type AddCommentMutationVariables = Types.Exact<{
  content?: Types.InputMaybe<Array<Types.DataProviderInput> | Types.DataProviderInput>;
  comment?: Types.InputMaybe<Types.CommentData>;
}>;


export type AddCommentMutation = { addComment?: string | null };

export type EditCommentMutationVariables = Types.Exact<{
  content?: Types.InputMaybe<Array<Types.DataProviderInput> | Types.DataProviderInput>;
  comment?: Types.InputMaybe<Types.CommentData>;
  id: Types.Scalars['String'];
}>;


export type EditCommentMutation = { editComment?: boolean | null };

export type RemoveCommentMutationVariables = Types.Exact<{
  id: Types.Scalars['String'];
}>;


export type RemoveCommentMutation = { removeComment?: boolean | null };

export type PostResultFragment = { title?: string | null, type: Types.PostType, _id: string, creationDate: string, updatedAt?: string | null, tags?: Array<string> | null, totalComments: string, quotedBy?: Array<string | null> | null, content?: Array<{ provider: string, property: string, value: string }> | null, author: { pubKey: string, name?: string | null, userName?: string | null, avatar?: string | null, coverImage?: string | null, description?: string | null, ethAddress: string, totalPosts?: string | null, totalFollowers: number, totalFollowing: number, totalInterests: number }, quotedByAuthors?: Array<{ pubKey: string, name?: string | null, userName?: string | null, avatar?: string | null, coverImage?: string | null, description?: string | null, ethAddress: string, totalPosts?: string | null, totalFollowers: number, totalFollowing: number, totalInterests: number } | null> | null, quotes?: Array<{ title?: string | null, type: Types.PostType, _id: string, creationDate: string, updatedAt?: string | null, tags?: Array<string> | null, totalComments: string, content?: Array<{ provider: string, property: string, value: string }> | null, author: { pubKey: string, name?: string | null, userName?: string | null, avatar?: string | null, coverImage?: string | null, description?: string | null, ethAddress: string, totalPosts?: string | null, totalFollowers: number, totalFollowing: number, totalInterests: number } }> | null };

export type FeedResultFragment = { nextIndex?: number | null, total?: number | null, results?: Array<{ title?: string | null, type: Types.PostType, _id: string, creationDate: string, updatedAt?: string | null, tags?: Array<string> | null, totalComments: string, quotedBy?: Array<string | null> | null, content?: Array<{ provider: string, property: string, value: string }> | null, author: { pubKey: string, name?: string | null, userName?: string | null, avatar?: string | null, coverImage?: string | null, description?: string | null, ethAddress: string, totalPosts?: string | null, totalFollowers: number, totalFollowing: number, totalInterests: number }, quotedByAuthors?: Array<{ pubKey: string, name?: string | null, userName?: string | null, avatar?: string | null, coverImage?: string | null, description?: string | null, ethAddress: string, totalPosts?: string | null, totalFollowers: number, totalFollowing: number, totalInterests: number } | null> | null, quotes?: Array<{ title?: string | null, type: Types.PostType, _id: string, creationDate: string, updatedAt?: string | null, tags?: Array<string> | null, totalComments: string, content?: Array<{ provider: string, property: string, value: string }> | null, author: { pubKey: string, name?: string | null, userName?: string | null, avatar?: string | null, coverImage?: string | null, description?: string | null, ethAddress: string, totalPosts?: string | null, totalFollowers: number, totalFollowing: number, totalInterests: number } }> | null }> | null };

export type GetEntryQueryVariables = Types.Exact<{
  id: Types.Scalars['String'];
  pubKey?: Types.InputMaybe<Types.Scalars['String']>;
}>;


export type GetEntryQuery = { getPost: { title?: string | null, type: Types.PostType, _id: string, creationDate: string, updatedAt?: string | null, tags?: Array<string> | null, totalComments: string, quotedBy?: Array<string | null> | null, content?: Array<{ provider: string, property: string, value: string }> | null, author: { pubKey: string, name?: string | null, userName?: string | null, avatar?: string | null, coverImage?: string | null, description?: string | null, ethAddress: string, totalPosts?: string | null, totalFollowers: number, totalFollowing: number, totalInterests: number }, quotedByAuthors?: Array<{ pubKey: string, name?: string | null, userName?: string | null, avatar?: string | null, coverImage?: string | null, description?: string | null, ethAddress: string, totalPosts?: string | null, totalFollowers: number, totalFollowing: number, totalInterests: number } | null> | null, quotes?: Array<{ title?: string | null, type: Types.PostType, _id: string, creationDate: string, updatedAt?: string | null, tags?: Array<string> | null, totalComments: string, content?: Array<{ provider: string, property: string, value: string }> | null, author: { pubKey: string, name?: string | null, userName?: string | null, avatar?: string | null, coverImage?: string | null, description?: string | null, ethAddress: string, totalPosts?: string | null, totalFollowers: number, totalFollowing: number, totalInterests: number } }> | null } };

export type GetEntriesQueryVariables = Types.Exact<{
  offset?: Types.InputMaybe<Types.Scalars['String']>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  pubKey?: Types.InputMaybe<Types.Scalars['String']>;
}>;


export type GetEntriesQuery = { posts?: { nextIndex?: string | null, total?: number | null, results?: Array<{ title?: string | null, type: Types.PostType, _id: string, creationDate: string, updatedAt?: string | null, tags?: Array<string> | null, totalComments: string, quotedBy?: Array<string | null> | null, content?: Array<{ provider: string, property: string, value: string }> | null, author: { pubKey: string, name?: string | null, userName?: string | null, avatar?: string | null, coverImage?: string | null, description?: string | null, ethAddress: string, totalPosts?: string | null, totalFollowers: number, totalFollowing: number, totalInterests: number }, quotedByAuthors?: Array<{ pubKey: string, name?: string | null, userName?: string | null, avatar?: string | null, coverImage?: string | null, description?: string | null, ethAddress: string, totalPosts?: string | null, totalFollowers: number, totalFollowing: number, totalInterests: number } | null> | null, quotes?: Array<{ title?: string | null, type: Types.PostType, _id: string, creationDate: string, updatedAt?: string | null, tags?: Array<string> | null, totalComments: string, content?: Array<{ provider: string, property: string, value: string }> | null, author: { pubKey: string, name?: string | null, userName?: string | null, avatar?: string | null, coverImage?: string | null, description?: string | null, ethAddress: string, totalPosts?: string | null, totalFollowers: number, totalFollowing: number, totalInterests: number } }> | null }> | null } | null };

export type CreateEntryMutationVariables = Types.Exact<{
  content?: Types.InputMaybe<Array<Types.DataProviderInput> | Types.DataProviderInput>;
  post?: Types.InputMaybe<Types.PostData>;
}>;


export type CreateEntryMutation = { createPost?: string | null };

export type EditEntryMutationVariables = Types.Exact<{
  content?: Types.InputMaybe<Array<Types.DataProviderInput> | Types.DataProviderInput>;
  post?: Types.InputMaybe<Types.PostData>;
  id: Types.Scalars['String'];
}>;


export type EditEntryMutation = { editPost?: boolean | null };

export type RemoveEntryMutationVariables = Types.Exact<{
  id: Types.Scalars['String'];
}>;


export type RemoveEntryMutation = { removePost?: boolean | null };

export type GetPostsByAuthorQueryVariables = Types.Exact<{
  author: Types.Scalars['String'];
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  pubKey?: Types.InputMaybe<Types.Scalars['String']>;
}>;


export type GetPostsByAuthorQuery = { getPostsByAuthor?: { nextIndex?: number | null, total?: number | null, results?: Array<{ title?: string | null, type: Types.PostType, _id: string, creationDate: string, updatedAt?: string | null, tags?: Array<string> | null, totalComments: string, quotedBy?: Array<string | null> | null, content?: Array<{ provider: string, property: string, value: string }> | null, author: { pubKey: string, name?: string | null, userName?: string | null, avatar?: string | null, coverImage?: string | null, description?: string | null, ethAddress: string, totalPosts?: string | null, totalFollowers: number, totalFollowing: number, totalInterests: number }, quotedByAuthors?: Array<{ pubKey: string, name?: string | null, userName?: string | null, avatar?: string | null, coverImage?: string | null, description?: string | null, ethAddress: string, totalPosts?: string | null, totalFollowers: number, totalFollowing: number, totalInterests: number } | null> | null, quotes?: Array<{ title?: string | null, type: Types.PostType, _id: string, creationDate: string, updatedAt?: string | null, tags?: Array<string> | null, totalComments: string, content?: Array<{ provider: string, property: string, value: string }> | null, author: { pubKey: string, name?: string | null, userName?: string | null, avatar?: string | null, coverImage?: string | null, description?: string | null, ethAddress: string, totalPosts?: string | null, totalFollowers: number, totalFollowing: number, totalInterests: number } }> | null }> | null } | null };

export type GetPostsByTagQueryVariables = Types.Exact<{
  tag: Types.Scalars['String'];
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  pubKey?: Types.InputMaybe<Types.Scalars['String']>;
}>;


export type GetPostsByTagQuery = { getPostsByTag?: { nextIndex?: number | null, total?: number | null, results?: Array<{ title?: string | null, type: Types.PostType, _id: string, creationDate: string, updatedAt?: string | null, tags?: Array<string> | null, totalComments: string, quotedBy?: Array<string | null> | null, content?: Array<{ provider: string, property: string, value: string }> | null, author: { pubKey: string, name?: string | null, userName?: string | null, avatar?: string | null, coverImage?: string | null, description?: string | null, ethAddress: string, totalPosts?: string | null, totalFollowers: number, totalFollowing: number, totalInterests: number }, quotedByAuthors?: Array<{ pubKey: string, name?: string | null, userName?: string | null, avatar?: string | null, coverImage?: string | null, description?: string | null, ethAddress: string, totalPosts?: string | null, totalFollowers: number, totalFollowing: number, totalInterests: number } | null> | null, quotes?: Array<{ title?: string | null, type: Types.PostType, _id: string, creationDate: string, updatedAt?: string | null, tags?: Array<string> | null, totalComments: string, content?: Array<{ provider: string, property: string, value: string }> | null, author: { pubKey: string, name?: string | null, userName?: string | null, avatar?: string | null, coverImage?: string | null, description?: string | null, ethAddress: string, totalPosts?: string | null, totalFollowers: number, totalFollowing: number, totalInterests: number } }> | null }> | null } | null };

export type VideoPreviewFFragment = { url?: string | null, secureUrl?: string | null, type?: string | null, width?: string | null, height?: string | null };

export type LinkPreviewFFragment = { url: string, mediaType?: string | null, contentType: string, favicons?: Array<string | null> | null, title?: string | null, siteName?: string | null, description?: string | null, images?: Array<string | null> | null, imagePreviewHash?: string | null, faviconPreviewHash?: string | null, videos?: Array<{ url?: string | null, secureUrl?: string | null, type?: string | null, width?: string | null, height?: string | null } | null> | null };

export type GetLinkPreviewMutationVariables = Types.Exact<{
  link: Types.Scalars['String'];
}>;


export type GetLinkPreviewMutation = { getLinkPreview?: { url: string, mediaType?: string | null, contentType: string, favicons?: Array<string | null> | null, title?: string | null, siteName?: string | null, description?: string | null, images?: Array<string | null> | null, imagePreviewHash?: string | null, faviconPreviewHash?: string | null, videos?: Array<{ url?: string | null, secureUrl?: string | null, type?: string | null, width?: string | null, height?: string | null } | null> | null } | null };

export type GetCustomFeedQueryVariables = Types.Exact<{
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
}>;


export type GetCustomFeedQuery = { getCustomFeed?: { nextIndex?: number | null, total?: number | null, results?: Array<{ title?: string | null, type: Types.PostType, _id: string, creationDate: string, updatedAt?: string | null, tags?: Array<string> | null, totalComments: string, quotedBy?: Array<string | null> | null, content?: Array<{ provider: string, property: string, value: string }> | null, author: { pubKey: string, name?: string | null, userName?: string | null, avatar?: string | null, coverImage?: string | null, description?: string | null, ethAddress: string, totalPosts?: string | null, totalFollowers: number, totalFollowing: number, totalInterests: number }, quotedByAuthors?: Array<{ pubKey: string, name?: string | null, userName?: string | null, avatar?: string | null, coverImage?: string | null, description?: string | null, ethAddress: string, totalPosts?: string | null, totalFollowers: number, totalFollowing: number, totalInterests: number } | null> | null, quotes?: Array<{ title?: string | null, type: Types.PostType, _id: string, creationDate: string, updatedAt?: string | null, tags?: Array<string> | null, totalComments: string, content?: Array<{ provider: string, property: string, value: string }> | null, author: { pubKey: string, name?: string | null, userName?: string | null, avatar?: string | null, coverImage?: string | null, description?: string | null, ethAddress: string, totalPosts?: string | null, totalFollowers: number, totalFollowing: number, totalInterests: number } }> | null }> | null } | null };

export type TagFieldsFragment = { name: string, creationDate: string, totalPosts: number };

export type GetTagQueryVariables = Types.Exact<{
  name: Types.Scalars['String'];
}>;


export type GetTagQuery = { getTag?: { name: string, creationDate: string, totalPosts: number } | null };

export type GetTagsQueryVariables = Types.Exact<{
  offset?: Types.InputMaybe<Types.Scalars['String']>;
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
}>;


export type GetTagsQuery = { tags?: { nextIndex?: string | null, total?: number | null, results?: Array<{ name: string, creationDate: string, totalPosts: number }> | null } | null };

export type SearchTagsQueryVariables = Types.Exact<{
  name: Types.Scalars['String'];
}>;


export type SearchTagsQuery = { searchTags?: Array<{ name: string, totalPosts: number } | null> | null };

export type CreateTagMutationVariables = Types.Exact<{
  name: Types.Scalars['String'];
}>;


export type CreateTagMutation = { createTag?: string | null };

export type UserProfileFragmentDataFragment = { pubKey: string, name?: string | null, userName?: string | null, avatar?: string | null, coverImage?: string | null, description?: string | null, ethAddress: string, totalPosts?: string | null, totalFollowers: number, totalFollowing: number, totalInterests: number };

export type AddProfileProviderMutationVariables = Types.Exact<{
  data?: Types.InputMaybe<Array<Types.InputMaybe<Types.DataProviderInput>> | Types.InputMaybe<Types.DataProviderInput>>;
}>;


export type AddProfileProviderMutation = { addProfileProvider: string };

export type MakeDefaultProviderMutationVariables = Types.Exact<{
  data?: Types.InputMaybe<Array<Types.InputMaybe<Types.DataProviderInput>> | Types.InputMaybe<Types.DataProviderInput>>;
}>;


export type MakeDefaultProviderMutation = { makeDefaultProvider: string };

export type ToggleInterestSubMutationVariables = Types.Exact<{
  sub: Types.Scalars['String'];
}>;


export type ToggleInterestSubMutation = { toggleInterestSub?: boolean | null };

export type RegisterUsernameMutationVariables = Types.Exact<{
  name: Types.Scalars['String'];
}>;


export type RegisterUsernameMutation = { registerUserName: string };

export type ResolveProfileQueryVariables = Types.Exact<{
  pubKey: Types.Scalars['String'];
}>;


export type ResolveProfileQuery = { resolveProfile: { pubKey: string, name?: string | null, userName?: string | null, avatar?: string | null, coverImage?: string | null, description?: string | null, ethAddress: string, totalPosts?: string | null, totalFollowers: number, totalFollowing: number, totalInterests: number, providers?: Array<{ provider: string, property: string, value: string } | null> | null, default?: Array<{ provider: string, property: string, value: string } | null> | null } };

export type GetProfileQueryVariables = Types.Exact<{
  ethAddress: Types.Scalars['String'];
}>;


export type GetProfileQuery = { getProfile: { pubKey: string, name?: string | null, userName?: string | null, avatar?: string | null, coverImage?: string | null, description?: string | null, ethAddress: string, totalPosts?: string | null, totalFollowers: number, totalFollowing: number, totalInterests: number, providers?: Array<{ provider: string, property: string, value: string } | null> | null, default?: Array<{ provider: string, property: string, value: string } | null> | null } };

export type FollowMutationVariables = Types.Exact<{
  pubKey: Types.Scalars['String'];
}>;


export type FollowMutation = { follow?: boolean | null };

export type UnFollowMutationVariables = Types.Exact<{
  pubKey: Types.Scalars['String'];
}>;


export type UnFollowMutation = { unFollow?: boolean | null };

export type IsFollowingQueryVariables = Types.Exact<{
  follower: Types.Scalars['String'];
  following: Types.Scalars['String'];
}>;


export type IsFollowingQuery = { isFollowing?: boolean | null };

export type SaveMetaDataMutationVariables = Types.Exact<{
  data?: Types.InputMaybe<Types.DataProviderInput>;
}>;


export type SaveMetaDataMutation = { saveMetaData: string };

export type SearchProfilesQueryVariables = Types.Exact<{
  name: Types.Scalars['String'];
}>;


export type SearchProfilesQuery = { searchProfiles?: Array<{ pubKey: string, name?: string | null, userName?: string | null, avatar?: string | null, coverImage?: string | null, description?: string | null, ethAddress: string, totalPosts?: string | null, totalFollowers: number, totalFollowing: number, totalInterests: number } | null> | null };

export type GlobalSearchQueryVariables = Types.Exact<{
  keyword: Types.Scalars['String'];
}>;


export type GlobalSearchQuery = { globalSearch?: { posts?: Array<{ id: string } | null> | null, profiles?: Array<{ id: string } | null> | null, tags?: Array<{ id: string, name: string, totalPosts: number } | null> | null, comments?: Array<{ id: string } | null> | null } | null };

export type GetFollowersQueryVariables = Types.Exact<{
  pubKey: Types.Scalars['String'];
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
}>;


export type GetFollowersQuery = { getFollowers?: { nextIndex?: number | null, total?: number | null, results?: Array<{ pubKey: string, name?: string | null, userName?: string | null, avatar?: string | null, coverImage?: string | null, description?: string | null, ethAddress: string, totalPosts?: string | null, totalFollowers: number, totalFollowing: number, totalInterests: number }> | null } | null };

export type GetFollowingQueryVariables = Types.Exact<{
  pubKey: Types.Scalars['String'];
  limit?: Types.InputMaybe<Types.Scalars['Int']>;
  offset?: Types.InputMaybe<Types.Scalars['Int']>;
}>;


export type GetFollowingQuery = { getFollowing?: { nextIndex?: number | null, total?: number | null, results?: Array<{ pubKey: string, name?: string | null, userName?: string | null, avatar?: string | null, coverImage?: string | null, description?: string | null, ethAddress: string, totalPosts?: string | null, totalFollowers: number, totalFollowing: number, totalInterests: number }> | null } | null };

export type GetInterestsQueryVariables = Types.Exact<{
  pubKey: Types.Scalars['String'];
}>;


export type GetInterestsQuery = { getInterests?: Array<string | null> | null };

export type IsUserNameAvailableQueryVariables = Types.Exact<{
  userName: Types.Scalars['String'];
}>;


export type IsUserNameAvailableQuery = { isUserNameAvailable?: boolean | null };

export type IntegrationInfoFragmentFragment = { id: string, name: string, author: string, integrationType: number, latestReleaseId: string, enabled: boolean };

export type IntegrationReleaseInfoFragmentFragment = { id?: string | null, name: string, version: string, integrationType: number, sources?: Array<string> | null, integrationID: string, author: string, enabled: boolean, createdAt?: number | null, links?: { publicRepository?: string | null, documentation?: string | null, detailedDescription?: string | null } | null, manifestData: { mainFile: string, license?: string | null, keywords?: Array<string | null> | null, description?: string | null, displayName?: string | null } };

export type GetLatestReleaseQueryVariables = Types.Exact<{
  integrationIDs?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
}>;


export type GetLatestReleaseQuery = { getLatestRelease?: Array<{ id?: string | null, name: string, version: string, integrationType: number, sources?: Array<string> | null, integrationID: string, author: string, enabled: boolean, createdAt?: number | null, links?: { publicRepository?: string | null, documentation?: string | null, detailedDescription?: string | null } | null, manifestData: { mainFile: string, license?: string | null, keywords?: Array<string | null> | null, description?: string | null, displayName?: string | null } } | null> | null };

export type GetIntegrationInfoQueryVariables = Types.Exact<{
  integrationIDs?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
}>;


export type GetIntegrationInfoQuery = { getIntegrationInfo?: Array<{ id: string, name: string, author: string, integrationType: number, latestReleaseId: string, enabled: boolean } | null> | null };
