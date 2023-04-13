import type * as Types from './graphql-types-new';

export type CommentFragmentFragment = { version: any, active: boolean, isReply: boolean, repliesCount: number, author: { id: string }, content: Array<{ provider: string, property: string, value: string }>, post?: { id: string, author: { id: string } } | null };

export type GetCommentsFromPostQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
  after?: Types.InputMaybe<Types.Scalars['String']>;
  before?: Types.InputMaybe<Types.Scalars['String']>;
  first?: Types.InputMaybe<Types.Scalars['Int']>;
  last?: Types.InputMaybe<Types.Scalars['Int']>;
}>;


export type GetCommentsFromPostQuery = { node?: { comments: { edges?: Array<{ node?: { version: any, active: boolean, isReply: boolean, repliesCount: number, author: { id: string }, content: Array<{ provider: string, property: string, value: string }>, post?: { id: string, author: { id: string } } | null } | null } | null> | null, pageInfo: { startCursor?: string | null, endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean } } } | {} | null };

export type GetCommentsByAuthorDidQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
  after?: Types.InputMaybe<Types.Scalars['String']>;
  before?: Types.InputMaybe<Types.Scalars['String']>;
  first?: Types.InputMaybe<Types.Scalars['Int']>;
  last?: Types.InputMaybe<Types.Scalars['Int']>;
}>;


export type GetCommentsByAuthorDidQuery = { node?: { commentList?: { edges?: Array<{ node?: { version: any, active: boolean, isReply: boolean, repliesCount: number, author: { id: string }, content: Array<{ provider: string, property: string, value: string }>, post?: { id: string, author: { id: string } } | null } | null } | null> | null, pageInfo: { startCursor?: string | null, endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean } } | null } | {} | null };

export type GetCommentRepliesQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
  after?: Types.InputMaybe<Types.Scalars['String']>;
  before?: Types.InputMaybe<Types.Scalars['String']>;
  first?: Types.InputMaybe<Types.Scalars['Int']>;
  last?: Types.InputMaybe<Types.Scalars['Int']>;
}>;


export type GetCommentRepliesQuery = { node?: { replies: { edges?: Array<{ node?: { reply?: { version: any, active: boolean, isReply: boolean, repliesCount: number, author: { id: string }, content: Array<{ provider: string, property: string, value: string }>, post?: { id: string, author: { id: string } } | null } | null } | null } | null> | null, pageInfo: { startCursor?: string | null, endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean } } } | {} | null };

export type CreateCommentMutationVariables = Types.Exact<{
  i: Types.CreateCommentInput;
}>;


export type CreateCommentMutation = { createComment?: { clientMutationId?: string | null, document: { version: any, active: boolean, isReply: boolean, repliesCount: number, author: { id: string }, content: Array<{ provider: string, property: string, value: string }>, post?: { id: string, author: { id: string } } | null } } | null };

export type UpdateCommentMutationVariables = Types.Exact<{
  i: Types.UpdateCommentInput;
}>;


export type UpdateCommentMutation = { updateComment?: { clientMutationId?: string | null, document: { version: any, active: boolean, isReply: boolean, repliesCount: number, author: { id: string }, content: Array<{ provider: string, property: string, value: string }>, post?: { id: string, author: { id: string } } | null } } | null };

export type CreateCommentReplyMutationVariables = Types.Exact<{
  i: Types.CreateCommentReplyInput;
}>;


export type CreateCommentReplyMutation = { createCommentReply?: { document: { active: boolean, comment?: { version: any, active: boolean, isReply: boolean, repliesCount: number, author: { id: string }, content: Array<{ provider: string, property: string, value: string }>, post?: { id: string, author: { id: string } } | null } | null, reply?: { version: any, active: boolean, isReply: boolean, repliesCount: number, author: { id: string }, content: Array<{ provider: string, property: string, value: string }>, post?: { id: string, author: { id: string } } | null } | null } } | null };

export type UpdateCommentReplyMutationVariables = Types.Exact<{
  i: Types.UpdateCommentReplyInput;
}>;


export type UpdateCommentReplyMutation = { updateCommentReply?: { document: { active: boolean, comment?: { version: any, active: boolean, isReply: boolean, repliesCount: number, author: { id: string }, content: Array<{ provider: string, property: string, value: string }>, post?: { id: string, author: { id: string } } | null } | null, reply?: { version: any, active: boolean, isReply: boolean, repliesCount: number, author: { id: string }, content: Array<{ provider: string, property: string, value: string }>, post?: { id: string, author: { id: string } } | null } | null } } | null };

export type PostFragmentFragment = { id: string, commentsCount: number, quotesCount: number, active: boolean, tags?: Array<string | null> | null, version: any, author: { id: string }, content: Array<{ property: string, provider: string, value: string }> };

export type GetPostsQueryVariables = Types.Exact<{
  after?: Types.InputMaybe<Types.Scalars['String']>;
  before?: Types.InputMaybe<Types.Scalars['String']>;
  first?: Types.InputMaybe<Types.Scalars['Int']>;
  last?: Types.InputMaybe<Types.Scalars['Int']>;
}>;


export type GetPostsQuery = { postIndex?: { edges?: Array<{ node?: { id: string, commentsCount: number, quotesCount: number, active: boolean, tags?: Array<string | null> | null, version: any, author: { id: string }, content: Array<{ property: string, provider: string, value: string }> } | null } | null> | null, pageInfo: { startCursor?: string | null, endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean } } | null };

export type GetPostsByAuthorDidQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
  after?: Types.InputMaybe<Types.Scalars['String']>;
  before?: Types.InputMaybe<Types.Scalars['String']>;
  first?: Types.InputMaybe<Types.Scalars['Int']>;
  last?: Types.InputMaybe<Types.Scalars['Int']>;
}>;


export type GetPostsByAuthorDidQuery = { node?: { postList?: { edges?: Array<{ node?: { id: string, commentsCount: number, quotesCount: number, active: boolean, tags?: Array<string | null> | null, version: any, author: { id: string }, content: Array<{ property: string, provider: string, value: string }> } | null } | null> | null, pageInfo: { startCursor?: string | null, endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean } } | null } | {} | null };

export type GetPostByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type GetPostByIdQuery = { node?: { id: string, commentsCount: number, quotesCount: number, active: boolean, tags?: Array<string | null> | null, version: any, author: { id: string }, content: Array<{ property: string, provider: string, value: string }> } | {} | null };

export type GetQuotedPostsFromPostQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type GetQuotedPostsFromPostQuery = { node?: { quotes: { edges?: Array<{ node?: { quotedPost?: { id: string, commentsCount: number, quotesCount: number, active: boolean, tags?: Array<string | null> | null, version: any, author: { id: string }, content: Array<{ property: string, provider: string, value: string }> } | null, post?: { id: string, commentsCount: number, quotesCount: number, active: boolean, tags?: Array<string | null> | null, version: any, author: { id: string }, content: Array<{ property: string, provider: string, value: string }> } | null } | null } | null> | null } } | {} | null };

export type GetMentionsFromPostQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type GetMentionsFromPostQuery = { node?: { mentions: { edges?: Array<{ node?: { profile?: { id: string, name: string, description?: string | null, createdAt: any, did: { id: string }, links?: Array<{ href: any, label?: string | null } | null> | null, background?: { alternatives?: Array<{ src: any, width: number, height: number } | null> | null, default: { src: any, width: number, height: number } } | null, avatar?: { default: { src: any, width: number, height: number }, alternatives?: Array<{ src: any, width: number, height: number } | null> | null } | null } | null, post?: { id: string, commentsCount: number, quotesCount: number, active: boolean, tags?: Array<string | null> | null, version: any, author: { id: string }, content: Array<{ property: string, provider: string, value: string }> } | null } | null } | null> | null } } | {} | null };

export type CreatePostMutationVariables = Types.Exact<{
  i: Types.CreatePostInput;
}>;


export type CreatePostMutation = { createPost?: { document: { id: string, commentsCount: number, quotesCount: number, active: boolean, tags?: Array<string | null> | null, version: any, author: { id: string }, content: Array<{ property: string, provider: string, value: string }> } } | null };

export type UpdatePostMutationVariables = Types.Exact<{
  i: Types.UpdatePostInput;
}>;


export type UpdatePostMutation = { updatePost?: { clientMutationId?: string | null, document: { id: string, commentsCount: number, quotesCount: number, active: boolean, tags?: Array<string | null> | null, version: any, author: { id: string }, content: Array<{ property: string, provider: string, value: string }> } } | null };

export type CreatePostQuoteMutationVariables = Types.Exact<{
  i: Types.CreatePostQuoteInput;
}>;


export type CreatePostQuoteMutation = { createPostQuote?: { clientMutationId?: string | null, document: { active: boolean, post?: { id: string, commentsCount: number, quotesCount: number, active: boolean, tags?: Array<string | null> | null, version: any, author: { id: string }, content: Array<{ property: string, provider: string, value: string }> } | null, quotedPost?: { id: string, commentsCount: number, quotesCount: number, active: boolean, tags?: Array<string | null> | null, version: any, author: { id: string }, content: Array<{ property: string, provider: string, value: string }> } | null } } | null };

export type CreatePostProfileMentionMutationVariables = Types.Exact<{
  i: Types.CreateProfileMentionInput;
}>;


export type CreatePostProfileMentionMutation = { createProfileMention?: { document: { post?: { id: string, commentsCount: number, quotesCount: number, active: boolean, tags?: Array<string | null> | null, version: any, author: { id: string }, content: Array<{ property: string, provider: string, value: string }> } | null, profile?: { id: string, name: string, description?: string | null, createdAt: any, did: { id: string }, links?: Array<{ href: any, label?: string | null } | null> | null, background?: { alternatives?: Array<{ src: any, width: number, height: number } | null> | null, default: { src: any, width: number, height: number } } | null, avatar?: { default: { src: any, width: number, height: number }, alternatives?: Array<{ src: any, width: number, height: number } | null> | null } | null } | null } } | null };

export type UserProfileFragmentFragment = { id: string, name: string, description?: string | null, createdAt: any, did: { id: string }, links?: Array<{ href: any, label?: string | null } | null> | null, background?: { alternatives?: Array<{ src: any, width: number, height: number } | null> | null, default: { src: any, width: number, height: number } } | null, avatar?: { default: { src: any, width: number, height: number }, alternatives?: Array<{ src: any, width: number, height: number } | null> | null } | null };

export type GetProfileByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type GetProfileByIdQuery = { node?: { id: string, name: string, description?: string | null, createdAt: any, did: { id: string }, links?: Array<{ href: any, label?: string | null } | null> | null, background?: { alternatives?: Array<{ src: any, width: number, height: number } | null> | null, default: { src: any, width: number, height: number } } | null, avatar?: { default: { src: any, width: number, height: number }, alternatives?: Array<{ src: any, width: number, height: number } | null> | null } | null } | {} | null };

export type GetProfileByDidQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type GetProfileByDidQuery = { node?: { profile?: { id: string, name: string, description?: string | null, createdAt: any, did: { id: string }, links?: Array<{ href: any, label?: string | null } | null> | null, background?: { alternatives?: Array<{ src: any, width: number, height: number } | null> | null, default: { src: any, width: number, height: number } } | null, avatar?: { default: { src: any, width: number, height: number }, alternatives?: Array<{ src: any, width: number, height: number } | null> | null } | null } | null } | {} | null };

export type GetProfilesQueryVariables = Types.Exact<{
  after?: Types.InputMaybe<Types.Scalars['String']>;
  before?: Types.InputMaybe<Types.Scalars['String']>;
  first?: Types.InputMaybe<Types.Scalars['Int']>;
  last?: Types.InputMaybe<Types.Scalars['Int']>;
}>;


export type GetProfilesQuery = { profileIndex?: { edges?: Array<{ node?: { id: string, name: string, description?: string | null, createdAt: any, did: { id: string }, links?: Array<{ href: any, label?: string | null } | null> | null, background?: { alternatives?: Array<{ src: any, width: number, height: number } | null> | null, default: { src: any, width: number, height: number } } | null, avatar?: { default: { src: any, width: number, height: number }, alternatives?: Array<{ src: any, width: number, height: number } | null> | null } | null } | null } | null> | null, pageInfo: { startCursor?: string | null, endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean } } | null };

export type GetInterestsQueryVariables = Types.Exact<{
  after?: Types.InputMaybe<Types.Scalars['String']>;
  before?: Types.InputMaybe<Types.Scalars['String']>;
  first?: Types.InputMaybe<Types.Scalars['Int']>;
  last?: Types.InputMaybe<Types.Scalars['Int']>;
}>;


export type GetInterestsQuery = { interestsIndex?: { edges?: Array<{ node?: { id: string, topics: Array<{ value: string, labelType: string }>, did: { id: string } } | null } | null> | null, pageInfo: { startCursor?: string | null, endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean } } | null };

export type GetInterestsByDidQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type GetInterestsByDidQuery = { node?: { interests?: { id: string, topics: Array<{ value: string, labelType: string }>, did: { id: string } } | null } | {} | null };

export type GetInterestsByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type GetInterestsByIdQuery = { node?: { id: string, topics: Array<{ value: string, labelType: string }>, did: { id: string } } | {} | null };

export type GetFollowingListByDidQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
  after?: Types.InputMaybe<Types.Scalars['String']>;
  before?: Types.InputMaybe<Types.Scalars['String']>;
  first?: Types.InputMaybe<Types.Scalars['Int']>;
  last?: Types.InputMaybe<Types.Scalars['Int']>;
}>;


export type GetFollowingListByDidQuery = { node?: { followList?: { edges?: Array<{ node?: { isFollowing: boolean, profile?: { id: string, name: string, description?: string | null, createdAt: any, did: { id: string }, links?: Array<{ href: any, label?: string | null } | null> | null, background?: { alternatives?: Array<{ src: any, width: number, height: number } | null> | null, default: { src: any, width: number, height: number } } | null, avatar?: { default: { src: any, width: number, height: number }, alternatives?: Array<{ src: any, width: number, height: number } | null> | null } | null } | null } | null } | null> | null, pageInfo: { startCursor?: string | null, endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean } } | null } | {} | null };

export type GetFollowersListByDidQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
  after?: Types.InputMaybe<Types.Scalars['String']>;
  before?: Types.InputMaybe<Types.Scalars['String']>;
  first?: Types.InputMaybe<Types.Scalars['Int']>;
  last?: Types.InputMaybe<Types.Scalars['Int']>;
}>;


export type GetFollowersListByDidQuery = { node?: { profile?: { followers: { edges?: Array<{ node?: { isFollowing: boolean, profile?: { id: string, name: string, description?: string | null, createdAt: any, did: { id: string }, links?: Array<{ href: any, label?: string | null } | null> | null, background?: { alternatives?: Array<{ src: any, width: number, height: number } | null> | null, default: { src: any, width: number, height: number } } | null, avatar?: { default: { src: any, width: number, height: number }, alternatives?: Array<{ src: any, width: number, height: number } | null> | null } | null } | null } | null } | null> | null, pageInfo: { startCursor?: string | null, endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean } } } | null } | {} | null };

export type GetMyProfileQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetMyProfileQuery = { viewer?: { profile?: { id: string, name: string, description?: string | null, createdAt: any, did: { id: string }, links?: Array<{ href: any, label?: string | null } | null> | null, background?: { alternatives?: Array<{ src: any, width: number, height: number } | null> | null, default: { src: any, width: number, height: number } } | null, avatar?: { default: { src: any, width: number, height: number }, alternatives?: Array<{ src: any, width: number, height: number } | null> | null } | null } | null } | null };

export type CreateProfileMutationVariables = Types.Exact<{
  i: Types.CreateProfileInput;
}>;


export type CreateProfileMutation = { createProfile?: { clientMutationId?: string | null, document: { id: string, name: string, description?: string | null, createdAt: any, did: { id: string }, links?: Array<{ href: any, label?: string | null } | null> | null, background?: { alternatives?: Array<{ src: any, width: number, height: number } | null> | null, default: { src: any, width: number, height: number } } | null, avatar?: { default: { src: any, width: number, height: number }, alternatives?: Array<{ src: any, width: number, height: number } | null> | null } | null } } | null };

export type UpdateProfileMutationVariables = Types.Exact<{
  i: Types.UpdateProfileInput;
}>;


export type UpdateProfileMutation = { updateProfile?: { clientMutationId?: string | null, document: { id: string, name: string, description?: string | null, createdAt: any, did: { id: string }, links?: Array<{ href: any, label?: string | null } | null> | null, background?: { alternatives?: Array<{ src: any, width: number, height: number } | null> | null, default: { src: any, width: number, height: number } } | null, avatar?: { default: { src: any, width: number, height: number }, alternatives?: Array<{ src: any, width: number, height: number } | null> | null } | null } } | null };

export type CreateInterestsMutationVariables = Types.Exact<{
  i: Types.CreateInterestsInput;
}>;


export type CreateInterestsMutation = { createInterests?: { clientMutationId?: string | null, document: { id: string, topics: Array<{ value: string, labelType: string }>, did: { id: string } } } | null };

export type UpdateInterestsMutationVariables = Types.Exact<{
  i: Types.UpdateInterestsInput;
}>;


export type UpdateInterestsMutation = { updateInterests?: { clientMutationId?: string | null, document: { id: string, topics: Array<{ value: string, labelType: string }>, did: { id: string } } } | null };

export type CreateFollowMutationVariables = Types.Exact<{
  i: Types.CreateFollowInput;
}>;


export type CreateFollowMutation = { createFollow?: { document: { isFollowing: boolean, id: string, profile?: { id: string, name: string, description?: string | null, createdAt: any, did: { id: string }, links?: Array<{ href: any, label?: string | null } | null> | null, background?: { alternatives?: Array<{ src: any, width: number, height: number } | null> | null, default: { src: any, width: number, height: number } } | null, avatar?: { default: { src: any, width: number, height: number }, alternatives?: Array<{ src: any, width: number, height: number } | null> | null } | null } | null, did: { id: string } } } | null };

export type UpdateFollowMutationVariables = Types.Exact<{
  i: Types.UpdateFollowInput;
}>;


export type UpdateFollowMutation = { updateFollow?: { document: { isFollowing: boolean, id: string, profile?: { id: string, name: string, description?: string | null, createdAt: any, did: { id: string }, links?: Array<{ href: any, label?: string | null } | null> | null, background?: { alternatives?: Array<{ src: any, width: number, height: number } | null> | null, default: { src: any, width: number, height: number } } | null, avatar?: { default: { src: any, width: number, height: number }, alternatives?: Array<{ src: any, width: number, height: number } | null> | null } | null } | null, did: { id: string } } } | null };
