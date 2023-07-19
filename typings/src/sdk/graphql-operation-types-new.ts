import type * as Types from './graphql-types-new';

export type BeamFragmentFragment = { id: string, reflectionsCount: number, rebeamsCount: number, active: boolean, tags?: Array<string | null> | null, version: any, author: { id: string }, content: Array<{ property: string, provider: string, value: string }> };

export type GetBeamsQueryVariables = Types.Exact<{
  after?: Types.InputMaybe<Types.Scalars['String']>;
  before?: Types.InputMaybe<Types.Scalars['String']>;
  first?: Types.InputMaybe<Types.Scalars['Int']>;
  last?: Types.InputMaybe<Types.Scalars['Int']>;
}>;


export type GetBeamsQuery = { beamIndex?: { edges?: Array<{ node?: { id: string, reflectionsCount: number, rebeamsCount: number, active: boolean, tags?: Array<string | null> | null, version: any, author: { id: string }, content: Array<{ property: string, provider: string, value: string }> } | null } | null> | null, pageInfo: { startCursor?: string | null, endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean } } | null };

export type GetBeamsByAuthorDidQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
  after?: Types.InputMaybe<Types.Scalars['String']>;
  before?: Types.InputMaybe<Types.Scalars['String']>;
  first?: Types.InputMaybe<Types.Scalars['Int']>;
  last?: Types.InputMaybe<Types.Scalars['Int']>;
}>;


export type GetBeamsByAuthorDidQuery = { node?: { isViewer: boolean, beamList?: { edges?: Array<{ node?: { id: string, reflectionsCount: number, rebeamsCount: number, active: boolean, tags?: Array<string | null> | null, version: any, author: { id: string }, content: Array<{ property: string, provider: string, value: string }> } | null } | null> | null, pageInfo: { startCursor?: string | null, endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean } } | null } | {} | null };

export type GetBeamByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type GetBeamByIdQuery = { node?: { id: string, reflectionsCount: number, rebeamsCount: number, active: boolean, tags?: Array<string | null> | null, version: any, author: { id: string }, content: Array<{ property: string, provider: string, value: string }> } | {} | null };

export type GetRebeamsFromBeamQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type GetRebeamsFromBeamQuery = { node?: { rebeams: { edges?: Array<{ node?: { quotedBeam?: { id: string, reflectionsCount: number, rebeamsCount: number, active: boolean, tags?: Array<string | null> | null, version: any, author: { id: string }, content: Array<{ property: string, provider: string, value: string }> } | null, beam?: { id: string, reflectionsCount: number, rebeamsCount: number, active: boolean, tags?: Array<string | null> | null, version: any, author: { id: string }, content: Array<{ property: string, provider: string, value: string }> } | null } | null } | null> | null } } | {} | null };

export type GetMentionsFromBeamQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type GetMentionsFromBeamQuery = { node?: { mentions: { edges?: Array<{ node?: { profile?: { id: string, name: string, description?: string | null, createdAt: any, did: { id: string }, links?: Array<{ href: any, label?: string | null } | null> | null, background?: { alternatives?: Array<{ src: any, width: number, height: number } | null> | null, default: { src: any, width: number, height: number } } | null, avatar?: { default: { src: any, width: number, height: number }, alternatives?: Array<{ src: any, width: number, height: number } | null> | null } | null, followers: { pageInfo: { startCursor?: string | null, endCursor?: string | null, hasPreviousPage: boolean, hasNextPage: boolean } } } | null, beam?: { id: string, reflectionsCount: number, rebeamsCount: number, active: boolean, tags?: Array<string | null> | null, version: any, author: { id: string }, content: Array<{ property: string, provider: string, value: string }> } | null } | null } | null> | null } } | {} | null };

export type CreateBeamMutationVariables = Types.Exact<{
  i: Types.CreateBeamInput;
}>;


export type CreateBeamMutation = { createBeam?: { document: { id: string, reflectionsCount: number, rebeamsCount: number, active: boolean, tags?: Array<string | null> | null, version: any, author: { id: string }, content: Array<{ property: string, provider: string, value: string }> } } | null };

export type UpdateBeamMutationVariables = Types.Exact<{
  i: Types.UpdateBeamInput;
}>;


export type UpdateBeamMutation = { updateBeam?: { clientMutationId?: string | null, document: { id: string, reflectionsCount: number, rebeamsCount: number, active: boolean, tags?: Array<string | null> | null, version: any, author: { id: string }, content: Array<{ property: string, provider: string, value: string }> } } | null };

export type CreateRebeamMutationVariables = Types.Exact<{
  i: Types.CreateRebeamInput;
}>;


export type CreateRebeamMutation = { createRebeam?: { clientMutationId?: string | null, document: { active: boolean, beam?: { id: string, reflectionsCount: number, rebeamsCount: number, active: boolean, tags?: Array<string | null> | null, version: any, author: { id: string }, content: Array<{ property: string, provider: string, value: string }> } | null, quotedBeam?: { id: string, reflectionsCount: number, rebeamsCount: number, active: boolean, tags?: Array<string | null> | null, version: any, author: { id: string }, content: Array<{ property: string, provider: string, value: string }> } | null } } | null };

export type CreateBeamProfileMentionMutationVariables = Types.Exact<{
  i: Types.CreateProfileMentionInput;
}>;


export type CreateBeamProfileMentionMutation = { createProfileMention?: { document: { beam?: { id: string, reflectionsCount: number, rebeamsCount: number, active: boolean, tags?: Array<string | null> | null, version: any, author: { id: string }, content: Array<{ property: string, provider: string, value: string }> } | null, profile?: { id: string, name: string, description?: string | null, createdAt: any, did: { id: string }, links?: Array<{ href: any, label?: string | null } | null> | null, background?: { alternatives?: Array<{ src: any, width: number, height: number } | null> | null, default: { src: any, width: number, height: number } } | null, avatar?: { default: { src: any, width: number, height: number }, alternatives?: Array<{ src: any, width: number, height: number } | null> | null } | null, followers: { pageInfo: { startCursor?: string | null, endCursor?: string | null, hasPreviousPage: boolean, hasNextPage: boolean } } } | null } } | null };

export type ReflectFragmentFragment = { version: any, active: boolean, isReply: boolean, reflectionsCount: number, author: { id: string }, content: Array<{ provider: string, property: string, value: string }>, beam?: { id: string, author: { id: string } } | null };

export type GetReflectionsFromBeamQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
  after?: Types.InputMaybe<Types.Scalars['String']>;
  before?: Types.InputMaybe<Types.Scalars['String']>;
  first?: Types.InputMaybe<Types.Scalars['Int']>;
  last?: Types.InputMaybe<Types.Scalars['Int']>;
}>;


export type GetReflectionsFromBeamQuery = { node?: { reflections: { edges?: Array<{ node?: { version: any, active: boolean, isReply: boolean, reflectionsCount: number, author: { id: string }, content: Array<{ provider: string, property: string, value: string }>, beam?: { id: string, author: { id: string } } | null } | null } | null> | null, pageInfo: { startCursor?: string | null, endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean } } } | {} | null };

export type GetReflectionsByAuthorDidQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
  after?: Types.InputMaybe<Types.Scalars['String']>;
  before?: Types.InputMaybe<Types.Scalars['String']>;
  first?: Types.InputMaybe<Types.Scalars['Int']>;
  last?: Types.InputMaybe<Types.Scalars['Int']>;
}>;


export type GetReflectionsByAuthorDidQuery = { node?: { isViewer: boolean, reflectList?: { edges?: Array<{ node?: { version: any, active: boolean, isReply: boolean, reflectionsCount: number, author: { id: string }, content: Array<{ provider: string, property: string, value: string }>, beam?: { id: string, author: { id: string } } | null } | null } | null> | null, pageInfo: { startCursor?: string | null, endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean } } | null } | {} | null };

export type GetReflectReflectionsQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
  after?: Types.InputMaybe<Types.Scalars['String']>;
  before?: Types.InputMaybe<Types.Scalars['String']>;
  first?: Types.InputMaybe<Types.Scalars['Int']>;
  last?: Types.InputMaybe<Types.Scalars['Int']>;
}>;


export type GetReflectReflectionsQuery = { node?: { reflections: { edges?: Array<{ node?: { reflect?: { version: any, active: boolean, isReply: boolean, reflectionsCount: number, author: { id: string }, content: Array<{ provider: string, property: string, value: string }>, beam?: { id: string, author: { id: string } } | null } | null } | null } | null> | null, pageInfo: { startCursor?: string | null, endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean } } } | {} | null };

export type CreateReflectMutationVariables = Types.Exact<{
  i: Types.CreateReflectInput;
}>;


export type CreateReflectMutation = { createReflect?: { clientMutationId?: string | null, document: { version: any, active: boolean, isReply: boolean, reflectionsCount: number, author: { id: string }, content: Array<{ provider: string, property: string, value: string }>, beam?: { id: string, author: { id: string } } | null } } | null };

export type UpdateReflectMutationVariables = Types.Exact<{
  i: Types.UpdateReflectInput;
}>;


export type UpdateReflectMutation = { updateReflect?: { clientMutationId?: string | null, document: { version: any, active: boolean, isReply: boolean, reflectionsCount: number, author: { id: string }, content: Array<{ provider: string, property: string, value: string }>, beam?: { id: string, author: { id: string } } | null } } | null };

export type CreateReflectReflectionMutationVariables = Types.Exact<{
  i: Types.CreateReflectionInput;
}>;


export type CreateReflectReflectionMutation = { createReflection?: { document: { active: boolean, reflect?: { version: any, active: boolean, isReply: boolean, reflectionsCount: number, author: { id: string }, content: Array<{ provider: string, property: string, value: string }>, beam?: { id: string, author: { id: string } } | null } | null, reflection?: { version: any, active: boolean, isReply: boolean, reflectionsCount: number, author: { id: string }, content: Array<{ provider: string, property: string, value: string }>, beam?: { id: string, author: { id: string } } | null } | null } } | null };

export type UpdateReflectReflectionMutationVariables = Types.Exact<{
  i: Types.UpdateReflectionInput;
}>;


export type UpdateReflectReflectionMutation = { updateReflection?: { document: { active: boolean, reflect?: { version: any, active: boolean, isReply: boolean, reflectionsCount: number, author: { id: string }, content: Array<{ provider: string, property: string, value: string }>, beam?: { id: string, author: { id: string } } | null } | null, reflection?: { version: any, active: boolean, isReply: boolean, reflectionsCount: number, author: { id: string }, content: Array<{ provider: string, property: string, value: string }>, beam?: { id: string, author: { id: string } } | null } | null } } | null };

export type UserProfileFragmentFragment = { id: string, name: string, description?: string | null, createdAt: any, did: { id: string }, links?: Array<{ href: any, label?: string | null } | null> | null, background?: { alternatives?: Array<{ src: any, width: number, height: number } | null> | null, default: { src: any, width: number, height: number } } | null, avatar?: { default: { src: any, width: number, height: number }, alternatives?: Array<{ src: any, width: number, height: number } | null> | null } | null, followers: { pageInfo: { startCursor?: string | null, endCursor?: string | null, hasPreviousPage: boolean, hasNextPage: boolean } } };

export type GetProfileByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type GetProfileByIdQuery = { node?: { id: string, name: string, description?: string | null, createdAt: any, did: { id: string }, links?: Array<{ href: any, label?: string | null } | null> | null, background?: { alternatives?: Array<{ src: any, width: number, height: number } | null> | null, default: { src: any, width: number, height: number } } | null, avatar?: { default: { src: any, width: number, height: number }, alternatives?: Array<{ src: any, width: number, height: number } | null> | null } | null, followers: { pageInfo: { startCursor?: string | null, endCursor?: string | null, hasPreviousPage: boolean, hasNextPage: boolean } } } | {} | null };

export type GetProfileByDidQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type GetProfileByDidQuery = { node?: { isViewer: boolean, profile?: { id: string, name: string, description?: string | null, createdAt: any, did: { id: string }, links?: Array<{ href: any, label?: string | null } | null> | null, background?: { alternatives?: Array<{ src: any, width: number, height: number } | null> | null, default: { src: any, width: number, height: number } } | null, avatar?: { default: { src: any, width: number, height: number }, alternatives?: Array<{ src: any, width: number, height: number } | null> | null } | null, followers: { pageInfo: { startCursor?: string | null, endCursor?: string | null, hasPreviousPage: boolean, hasNextPage: boolean } } } | null } | {} | null };

export type GetProfilesQueryVariables = Types.Exact<{
  after?: Types.InputMaybe<Types.Scalars['String']>;
  before?: Types.InputMaybe<Types.Scalars['String']>;
  first?: Types.InputMaybe<Types.Scalars['Int']>;
  last?: Types.InputMaybe<Types.Scalars['Int']>;
}>;


export type GetProfilesQuery = { profileIndex?: { edges?: Array<{ node?: { id: string, name: string, description?: string | null, createdAt: any, did: { id: string }, links?: Array<{ href: any, label?: string | null } | null> | null, background?: { alternatives?: Array<{ src: any, width: number, height: number } | null> | null, default: { src: any, width: number, height: number } } | null, avatar?: { default: { src: any, width: number, height: number }, alternatives?: Array<{ src: any, width: number, height: number } | null> | null } | null, followers: { pageInfo: { startCursor?: string | null, endCursor?: string | null, hasPreviousPage: boolean, hasNextPage: boolean } } } | null } | null> | null, pageInfo: { startCursor?: string | null, endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean } } | null };

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


export type GetInterestsByDidQuery = { node?: { isViewer: boolean, interests?: { id: string, topics: Array<{ value: string, labelType: string }>, did: { id: string } } | null } | {} | null };

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


export type GetFollowingListByDidQuery = { node?: { isViewer: boolean, followList?: { edges?: Array<{ node?: { id: string, isFollowing: boolean, profile?: { id: string, name: string, description?: string | null, createdAt: any, did: { id: string }, links?: Array<{ href: any, label?: string | null } | null> | null, background?: { alternatives?: Array<{ src: any, width: number, height: number } | null> | null, default: { src: any, width: number, height: number } } | null, avatar?: { default: { src: any, width: number, height: number }, alternatives?: Array<{ src: any, width: number, height: number } | null> | null } | null, followers: { pageInfo: { startCursor?: string | null, endCursor?: string | null, hasPreviousPage: boolean, hasNextPage: boolean } } } | null } | null } | null> | null, pageInfo: { startCursor?: string | null, endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean } } | null } | {} | null };

export type GetFollowersListByDidQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
  after?: Types.InputMaybe<Types.Scalars['String']>;
  before?: Types.InputMaybe<Types.Scalars['String']>;
  first?: Types.InputMaybe<Types.Scalars['Int']>;
  last?: Types.InputMaybe<Types.Scalars['Int']>;
}>;


export type GetFollowersListByDidQuery = { node?: { isViewer: boolean, profile?: { followers: { edges?: Array<{ node?: { id: string, isFollowing: boolean, profile?: { id: string, name: string, description?: string | null, createdAt: any, did: { id: string }, links?: Array<{ href: any, label?: string | null } | null> | null, background?: { alternatives?: Array<{ src: any, width: number, height: number } | null> | null, default: { src: any, width: number, height: number } } | null, avatar?: { default: { src: any, width: number, height: number }, alternatives?: Array<{ src: any, width: number, height: number } | null> | null } | null, followers: { pageInfo: { startCursor?: string | null, endCursor?: string | null, hasPreviousPage: boolean, hasNextPage: boolean } } } | null } | null } | null> | null, pageInfo: { startCursor?: string | null, endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean } } } | null } | {} | null };

export type GetMyProfileQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetMyProfileQuery = { viewer?: { profile?: { id: string, name: string, description?: string | null, createdAt: any, did: { id: string }, links?: Array<{ href: any, label?: string | null } | null> | null, background?: { alternatives?: Array<{ src: any, width: number, height: number } | null> | null, default: { src: any, width: number, height: number } } | null, avatar?: { default: { src: any, width: number, height: number }, alternatives?: Array<{ src: any, width: number, height: number } | null> | null } | null, followers: { pageInfo: { startCursor?: string | null, endCursor?: string | null, hasPreviousPage: boolean, hasNextPage: boolean } } } | null } | null };

export type CreateProfileMutationVariables = Types.Exact<{
  i: Types.CreateProfileInput;
}>;


export type CreateProfileMutation = { createProfile?: { clientMutationId?: string | null, document: { id: string, name: string, description?: string | null, createdAt: any, did: { id: string }, links?: Array<{ href: any, label?: string | null } | null> | null, background?: { alternatives?: Array<{ src: any, width: number, height: number } | null> | null, default: { src: any, width: number, height: number } } | null, avatar?: { default: { src: any, width: number, height: number }, alternatives?: Array<{ src: any, width: number, height: number } | null> | null } | null, followers: { pageInfo: { startCursor?: string | null, endCursor?: string | null, hasPreviousPage: boolean, hasNextPage: boolean } } } } | null };

export type UpdateProfileMutationVariables = Types.Exact<{
  i: Types.UpdateProfileInput;
}>;


export type UpdateProfileMutation = { updateProfile?: { clientMutationId?: string | null, document: { id: string, name: string, description?: string | null, createdAt: any, did: { id: string }, links?: Array<{ href: any, label?: string | null } | null> | null, background?: { alternatives?: Array<{ src: any, width: number, height: number } | null> | null, default: { src: any, width: number, height: number } } | null, avatar?: { default: { src: any, width: number, height: number }, alternatives?: Array<{ src: any, width: number, height: number } | null> | null } | null, followers: { pageInfo: { startCursor?: string | null, endCursor?: string | null, hasPreviousPage: boolean, hasNextPage: boolean } } } } | null };

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


export type CreateFollowMutation = { createFollow?: { document: { isFollowing: boolean, id: string, profile?: { id: string, name: string, description?: string | null, createdAt: any, did: { id: string }, links?: Array<{ href: any, label?: string | null } | null> | null, background?: { alternatives?: Array<{ src: any, width: number, height: number } | null> | null, default: { src: any, width: number, height: number } } | null, avatar?: { default: { src: any, width: number, height: number }, alternatives?: Array<{ src: any, width: number, height: number } | null> | null } | null, followers: { pageInfo: { startCursor?: string | null, endCursor?: string | null, hasPreviousPage: boolean, hasNextPage: boolean } } } | null, did: { id: string } } } | null };

export type UpdateFollowMutationVariables = Types.Exact<{
  i: Types.UpdateFollowInput;
}>;


export type UpdateFollowMutation = { updateFollow?: { document: { isFollowing: boolean, id: string, profile?: { id: string, name: string, description?: string | null, createdAt: any, did: { id: string }, links?: Array<{ href: any, label?: string | null } | null> | null, background?: { alternatives?: Array<{ src: any, width: number, height: number } | null> | null, default: { src: any, width: number, height: number } } | null, avatar?: { default: { src: any, width: number, height: number }, alternatives?: Array<{ src: any, width: number, height: number } | null> | null } | null, followers: { pageInfo: { startCursor?: string | null, endCursor?: string | null, hasPreviousPage: boolean, hasNextPage: boolean } } } | null, did: { id: string } } } | null };

export type AkashaAppFragmentFragment = { id: string, applicationType?: Types.AkashaAppApplicationType | null, description: string, licence: string, name: string, displayName: string, keywords?: Array<string | null> | null, releasessCount: number, releases: { edges?: Array<{ node?: { id: string, createdAt: any, source: any, version: string } | null } | null> | null }, author: { id: string, isViewer: boolean, profile?: { id: string, name: string, description?: string | null, createdAt: any, did: { id: string }, links?: Array<{ href: any, label?: string | null } | null> | null, background?: { alternatives?: Array<{ src: any, width: number, height: number } | null> | null, default: { src: any, width: number, height: number } } | null, avatar?: { default: { src: any, width: number, height: number }, alternatives?: Array<{ src: any, width: number, height: number } | null> | null } | null, followers: { pageInfo: { startCursor?: string | null, endCursor?: string | null, hasPreviousPage: boolean, hasNextPage: boolean } } } | null }, contributors?: Array<{ id: string, isViewer: boolean, profile?: { id: string, name: string, description?: string | null, createdAt: any, did: { id: string }, links?: Array<{ href: any, label?: string | null } | null> | null, background?: { alternatives?: Array<{ src: any, width: number, height: number } | null> | null, default: { src: any, width: number, height: number } } | null, avatar?: { default: { src: any, width: number, height: number }, alternatives?: Array<{ src: any, width: number, height: number } | null> | null } | null, followers: { pageInfo: { startCursor?: string | null, endCursor?: string | null, hasPreviousPage: boolean, hasNextPage: boolean } } } | null } | null> | null };

export type AppReleaseFragmentFragment = { applicationID: any, id: string, source: any, version: string, createdAt: any, application?: { id: string, applicationType?: Types.AkashaAppApplicationType | null, description: string, licence: string, name: string, displayName: string, keywords?: Array<string | null> | null, releasessCount: number, releases: { edges?: Array<{ node?: { id: string, createdAt: any, source: any, version: string } | null } | null> | null }, author: { id: string, isViewer: boolean, profile?: { id: string, name: string, description?: string | null, createdAt: any, did: { id: string }, links?: Array<{ href: any, label?: string | null } | null> | null, background?: { alternatives?: Array<{ src: any, width: number, height: number } | null> | null, default: { src: any, width: number, height: number } } | null, avatar?: { default: { src: any, width: number, height: number }, alternatives?: Array<{ src: any, width: number, height: number } | null> | null } | null, followers: { pageInfo: { startCursor?: string | null, endCursor?: string | null, hasPreviousPage: boolean, hasNextPage: boolean } } } | null }, contributors?: Array<{ id: string, isViewer: boolean, profile?: { id: string, name: string, description?: string | null, createdAt: any, did: { id: string }, links?: Array<{ href: any, label?: string | null } | null> | null, background?: { alternatives?: Array<{ src: any, width: number, height: number } | null> | null, default: { src: any, width: number, height: number } } | null, avatar?: { default: { src: any, width: number, height: number }, alternatives?: Array<{ src: any, width: number, height: number } | null> | null } | null, followers: { pageInfo: { startCursor?: string | null, endCursor?: string | null, hasPreviousPage: boolean, hasNextPage: boolean } } } | null } | null> | null } | null };

export type CreateAppMutationVariables = Types.Exact<{
  i: Types.CreateAkashaAppInput;
}>;


export type CreateAppMutation = { createAkashaApp?: { clientMutationId?: string | null, document: { id: string, applicationType?: Types.AkashaAppApplicationType | null, description: string, licence: string, name: string, displayName: string, keywords?: Array<string | null> | null, releasessCount: number, releases: { edges?: Array<{ node?: { id: string, createdAt: any, source: any, version: string } | null } | null> | null }, author: { id: string, isViewer: boolean, profile?: { id: string, name: string, description?: string | null, createdAt: any, did: { id: string }, links?: Array<{ href: any, label?: string | null } | null> | null, background?: { alternatives?: Array<{ src: any, width: number, height: number } | null> | null, default: { src: any, width: number, height: number } } | null, avatar?: { default: { src: any, width: number, height: number }, alternatives?: Array<{ src: any, width: number, height: number } | null> | null } | null, followers: { pageInfo: { startCursor?: string | null, endCursor?: string | null, hasPreviousPage: boolean, hasNextPage: boolean } } } | null }, contributors?: Array<{ id: string, isViewer: boolean, profile?: { id: string, name: string, description?: string | null, createdAt: any, did: { id: string }, links?: Array<{ href: any, label?: string | null } | null> | null, background?: { alternatives?: Array<{ src: any, width: number, height: number } | null> | null, default: { src: any, width: number, height: number } } | null, avatar?: { default: { src: any, width: number, height: number }, alternatives?: Array<{ src: any, width: number, height: number } | null> | null } | null, followers: { pageInfo: { startCursor?: string | null, endCursor?: string | null, hasPreviousPage: boolean, hasNextPage: boolean } } } | null } | null> | null } } | null };

export type UpdateAppMutationVariables = Types.Exact<{
  i: Types.UpdateAkashaAppInput;
}>;


export type UpdateAppMutation = { updateAkashaApp?: { clientMutationId?: string | null, document: { id: string, applicationType?: Types.AkashaAppApplicationType | null, description: string, licence: string, name: string, displayName: string, keywords?: Array<string | null> | null, releasessCount: number, releases: { edges?: Array<{ node?: { id: string, createdAt: any, source: any, version: string } | null } | null> | null }, author: { id: string, isViewer: boolean, profile?: { id: string, name: string, description?: string | null, createdAt: any, did: { id: string }, links?: Array<{ href: any, label?: string | null } | null> | null, background?: { alternatives?: Array<{ src: any, width: number, height: number } | null> | null, default: { src: any, width: number, height: number } } | null, avatar?: { default: { src: any, width: number, height: number }, alternatives?: Array<{ src: any, width: number, height: number } | null> | null } | null, followers: { pageInfo: { startCursor?: string | null, endCursor?: string | null, hasPreviousPage: boolean, hasNextPage: boolean } } } | null }, contributors?: Array<{ id: string, isViewer: boolean, profile?: { id: string, name: string, description?: string | null, createdAt: any, did: { id: string }, links?: Array<{ href: any, label?: string | null } | null> | null, background?: { alternatives?: Array<{ src: any, width: number, height: number } | null> | null, default: { src: any, width: number, height: number } } | null, avatar?: { default: { src: any, width: number, height: number }, alternatives?: Array<{ src: any, width: number, height: number } | null> | null } | null, followers: { pageInfo: { startCursor?: string | null, endCursor?: string | null, hasPreviousPage: boolean, hasNextPage: boolean } } } | null } | null> | null } } | null };

export type GetAppsQueryVariables = Types.Exact<{
  after?: Types.InputMaybe<Types.Scalars['String']>;
  before?: Types.InputMaybe<Types.Scalars['String']>;
  first?: Types.InputMaybe<Types.Scalars['Int']>;
  last?: Types.InputMaybe<Types.Scalars['Int']>;
}>;


export type GetAppsQuery = { akashaAppIndex?: { edges?: Array<{ node?: { id: string, applicationType?: Types.AkashaAppApplicationType | null, description: string, licence: string, name: string, displayName: string, keywords?: Array<string | null> | null, releasessCount: number, releases: { edges?: Array<{ node?: { id: string, createdAt: any, source: any, version: string } | null } | null> | null }, author: { id: string, isViewer: boolean, profile?: { id: string, name: string, description?: string | null, createdAt: any, did: { id: string }, links?: Array<{ href: any, label?: string | null } | null> | null, background?: { alternatives?: Array<{ src: any, width: number, height: number } | null> | null, default: { src: any, width: number, height: number } } | null, avatar?: { default: { src: any, width: number, height: number }, alternatives?: Array<{ src: any, width: number, height: number } | null> | null } | null, followers: { pageInfo: { startCursor?: string | null, endCursor?: string | null, hasPreviousPage: boolean, hasNextPage: boolean } } } | null }, contributors?: Array<{ id: string, isViewer: boolean, profile?: { id: string, name: string, description?: string | null, createdAt: any, did: { id: string }, links?: Array<{ href: any, label?: string | null } | null> | null, background?: { alternatives?: Array<{ src: any, width: number, height: number } | null> | null, default: { src: any, width: number, height: number } } | null, avatar?: { default: { src: any, width: number, height: number }, alternatives?: Array<{ src: any, width: number, height: number } | null> | null } | null, followers: { pageInfo: { startCursor?: string | null, endCursor?: string | null, hasPreviousPage: boolean, hasNextPage: boolean } } } | null } | null> | null } | null } | null> | null, pageInfo: { startCursor?: string | null, endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean } } | null };

export type GetAppsByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type GetAppsByIdQuery = { node?: { id: string, applicationType?: Types.AkashaAppApplicationType | null, description: string, licence: string, name: string, displayName: string, keywords?: Array<string | null> | null, releasessCount: number, releases: { edges?: Array<{ node?: { id: string, createdAt: any, source: any, version: string } | null } | null> | null }, author: { id: string, isViewer: boolean, profile?: { id: string, name: string, description?: string | null, createdAt: any, did: { id: string }, links?: Array<{ href: any, label?: string | null } | null> | null, background?: { alternatives?: Array<{ src: any, width: number, height: number } | null> | null, default: { src: any, width: number, height: number } } | null, avatar?: { default: { src: any, width: number, height: number }, alternatives?: Array<{ src: any, width: number, height: number } | null> | null } | null, followers: { pageInfo: { startCursor?: string | null, endCursor?: string | null, hasPreviousPage: boolean, hasNextPage: boolean } } } | null }, contributors?: Array<{ id: string, isViewer: boolean, profile?: { id: string, name: string, description?: string | null, createdAt: any, did: { id: string }, links?: Array<{ href: any, label?: string | null } | null> | null, background?: { alternatives?: Array<{ src: any, width: number, height: number } | null> | null, default: { src: any, width: number, height: number } } | null, avatar?: { default: { src: any, width: number, height: number }, alternatives?: Array<{ src: any, width: number, height: number } | null> | null } | null, followers: { pageInfo: { startCursor?: string | null, endCursor?: string | null, hasPreviousPage: boolean, hasNextPage: boolean } } } | null } | null> | null } | {} | null };

export type CreateAppReleaseMutationVariables = Types.Exact<{
  i: Types.CreateAppReleaseInput;
}>;


export type CreateAppReleaseMutation = { createAppRelease?: { clientMutationId?: string | null, document: { applicationID: any, id: string, source: any, version: string, createdAt: any, application?: { id: string, applicationType?: Types.AkashaAppApplicationType | null, description: string, licence: string, name: string, displayName: string, keywords?: Array<string | null> | null, releasessCount: number, releases: { edges?: Array<{ node?: { id: string, createdAt: any, source: any, version: string } | null } | null> | null }, author: { id: string, isViewer: boolean, profile?: { id: string, name: string, description?: string | null, createdAt: any, did: { id: string }, links?: Array<{ href: any, label?: string | null } | null> | null, background?: { alternatives?: Array<{ src: any, width: number, height: number } | null> | null, default: { src: any, width: number, height: number } } | null, avatar?: { default: { src: any, width: number, height: number }, alternatives?: Array<{ src: any, width: number, height: number } | null> | null } | null, followers: { pageInfo: { startCursor?: string | null, endCursor?: string | null, hasPreviousPage: boolean, hasNextPage: boolean } } } | null }, contributors?: Array<{ id: string, isViewer: boolean, profile?: { id: string, name: string, description?: string | null, createdAt: any, did: { id: string }, links?: Array<{ href: any, label?: string | null } | null> | null, background?: { alternatives?: Array<{ src: any, width: number, height: number } | null> | null, default: { src: any, width: number, height: number } } | null, avatar?: { default: { src: any, width: number, height: number }, alternatives?: Array<{ src: any, width: number, height: number } | null> | null } | null, followers: { pageInfo: { startCursor?: string | null, endCursor?: string | null, hasPreviousPage: boolean, hasNextPage: boolean } } } | null } | null> | null } | null } } | null };

export type UpdateAppReleaseMutationVariables = Types.Exact<{
  i: Types.UpdateAppReleaseInput;
}>;


export type UpdateAppReleaseMutation = { updateAppRelease?: { clientMutationId?: string | null, document: { applicationID: any, id: string, source: any, version: string, createdAt: any, application?: { id: string, applicationType?: Types.AkashaAppApplicationType | null, description: string, licence: string, name: string, displayName: string, keywords?: Array<string | null> | null, releasessCount: number, releases: { edges?: Array<{ node?: { id: string, createdAt: any, source: any, version: string } | null } | null> | null }, author: { id: string, isViewer: boolean, profile?: { id: string, name: string, description?: string | null, createdAt: any, did: { id: string }, links?: Array<{ href: any, label?: string | null } | null> | null, background?: { alternatives?: Array<{ src: any, width: number, height: number } | null> | null, default: { src: any, width: number, height: number } } | null, avatar?: { default: { src: any, width: number, height: number }, alternatives?: Array<{ src: any, width: number, height: number } | null> | null } | null, followers: { pageInfo: { startCursor?: string | null, endCursor?: string | null, hasPreviousPage: boolean, hasNextPage: boolean } } } | null }, contributors?: Array<{ id: string, isViewer: boolean, profile?: { id: string, name: string, description?: string | null, createdAt: any, did: { id: string }, links?: Array<{ href: any, label?: string | null } | null> | null, background?: { alternatives?: Array<{ src: any, width: number, height: number } | null> | null, default: { src: any, width: number, height: number } } | null, avatar?: { default: { src: any, width: number, height: number }, alternatives?: Array<{ src: any, width: number, height: number } | null> | null } | null, followers: { pageInfo: { startCursor?: string | null, endCursor?: string | null, hasPreviousPage: boolean, hasNextPage: boolean } } } | null } | null> | null } | null } } | null };

export type GetAppsReleasesQueryVariables = Types.Exact<{
  after?: Types.InputMaybe<Types.Scalars['String']>;
  before?: Types.InputMaybe<Types.Scalars['String']>;
  first?: Types.InputMaybe<Types.Scalars['Int']>;
  last?: Types.InputMaybe<Types.Scalars['Int']>;
}>;


export type GetAppsReleasesQuery = { appReleaseIndex?: { edges?: Array<{ node?: { applicationID: any, id: string, source: any, version: string, createdAt: any, application?: { id: string, applicationType?: Types.AkashaAppApplicationType | null, description: string, licence: string, name: string, displayName: string, keywords?: Array<string | null> | null, releasessCount: number, releases: { edges?: Array<{ node?: { id: string, createdAt: any, source: any, version: string } | null } | null> | null }, author: { id: string, isViewer: boolean, profile?: { id: string, name: string, description?: string | null, createdAt: any, did: { id: string }, links?: Array<{ href: any, label?: string | null } | null> | null, background?: { alternatives?: Array<{ src: any, width: number, height: number } | null> | null, default: { src: any, width: number, height: number } } | null, avatar?: { default: { src: any, width: number, height: number }, alternatives?: Array<{ src: any, width: number, height: number } | null> | null } | null, followers: { pageInfo: { startCursor?: string | null, endCursor?: string | null, hasPreviousPage: boolean, hasNextPage: boolean } } } | null }, contributors?: Array<{ id: string, isViewer: boolean, profile?: { id: string, name: string, description?: string | null, createdAt: any, did: { id: string }, links?: Array<{ href: any, label?: string | null } | null> | null, background?: { alternatives?: Array<{ src: any, width: number, height: number } | null> | null, default: { src: any, width: number, height: number } } | null, avatar?: { default: { src: any, width: number, height: number }, alternatives?: Array<{ src: any, width: number, height: number } | null> | null } | null, followers: { pageInfo: { startCursor?: string | null, endCursor?: string | null, hasPreviousPage: boolean, hasNextPage: boolean } } } | null } | null> | null } | null } | null } | null> | null, pageInfo: { startCursor?: string | null, endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean } } | null };

export type GetAppReleaseByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type GetAppReleaseByIdQuery = { node?: { applicationID: any, id: string, source: any, version: string, createdAt: any, application?: { id: string, applicationType?: Types.AkashaAppApplicationType | null, description: string, licence: string, name: string, displayName: string, keywords?: Array<string | null> | null, releasessCount: number, releases: { edges?: Array<{ node?: { id: string, createdAt: any, source: any, version: string } | null } | null> | null }, author: { id: string, isViewer: boolean, profile?: { id: string, name: string, description?: string | null, createdAt: any, did: { id: string }, links?: Array<{ href: any, label?: string | null } | null> | null, background?: { alternatives?: Array<{ src: any, width: number, height: number } | null> | null, default: { src: any, width: number, height: number } } | null, avatar?: { default: { src: any, width: number, height: number }, alternatives?: Array<{ src: any, width: number, height: number } | null> | null } | null, followers: { pageInfo: { startCursor?: string | null, endCursor?: string | null, hasPreviousPage: boolean, hasNextPage: boolean } } } | null }, contributors?: Array<{ id: string, isViewer: boolean, profile?: { id: string, name: string, description?: string | null, createdAt: any, did: { id: string }, links?: Array<{ href: any, label?: string | null } | null> | null, background?: { alternatives?: Array<{ src: any, width: number, height: number } | null> | null, default: { src: any, width: number, height: number } } | null, avatar?: { default: { src: any, width: number, height: number }, alternatives?: Array<{ src: any, width: number, height: number } | null> | null } | null, followers: { pageInfo: { startCursor?: string | null, endCursor?: string | null, hasPreviousPage: boolean, hasNextPage: boolean } } } | null } | null> | null } | null } | {} | null };
