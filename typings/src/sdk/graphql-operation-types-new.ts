import type * as Types from './graphql-types-new';

export type BeamFragmentFragment = { id: string, reflectionsCount: number, active: boolean, tags?: Array<string | null> | null, version: any, createdAt: any, nsfw?: boolean | null, embeddedBeam?: { label: string, embeddedID: any } | null, author: { id: string, isViewer: boolean }, content: Array<{ blockID: any, order: number }> };

export type ContentBlockFragmentFragment = { active: boolean, appVersionID: any, createdAt: any, kind?: Types.AkashaContentBlockBlockDef | null, version: any, nsfw?: boolean | null, content: Array<{ propertyType: string, value: string, label: string }>, appVersion?: { applicationID: any, id: string, version: string, application?: { name: string, displayName: string, id: string } | null } | null, author: { id: string, isViewer: boolean } };

export type BlockStorageFragmentFragment = { appVersionID: any, createdAt: any, active: boolean, version: any, blockID: any, appVersion?: { applicationID: any, id: string, version: string, application?: { name: string, displayName: string, id: string } | null } | null, content: Array<{ propertyType: string, label: string, value: string }>, author: { id: string, isViewer: boolean }, block?: { id: string, active: boolean, author: { id: string, isViewer: boolean } } | null };

export type GetBeamsQueryVariables = Types.Exact<{
  after?: Types.InputMaybe<Types.Scalars['String']>;
  before?: Types.InputMaybe<Types.Scalars['String']>;
  first?: Types.InputMaybe<Types.Scalars['Int']>;
  last?: Types.InputMaybe<Types.Scalars['Int']>;
  filters?: Types.InputMaybe<Types.AkashaBeamFiltersInput>;
  sorting?: Types.InputMaybe<Types.AkashaBeamSortingInput>;
}>;


export type GetBeamsQuery = { akashaBeamIndex?: { edges?: Array<{ node?: { id: string, reflectionsCount: number, active: boolean, tags?: Array<string | null> | null, version: any, createdAt: any, nsfw?: boolean | null, embeddedBeam?: { label: string, embeddedID: any } | null, author: { id: string, isViewer: boolean }, content: Array<{ blockID: any, order: number }> } | null } | null> | null, pageInfo: { startCursor?: string | null, endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean } } | null };

export type GetBeamsByAuthorDidQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
  after?: Types.InputMaybe<Types.Scalars['String']>;
  before?: Types.InputMaybe<Types.Scalars['String']>;
  first?: Types.InputMaybe<Types.Scalars['Int']>;
  last?: Types.InputMaybe<Types.Scalars['Int']>;
  filters?: Types.InputMaybe<Types.AkashaBeamFiltersInput>;
  sorting?: Types.InputMaybe<Types.AkashaBeamSortingInput>;
}>;


export type GetBeamsByAuthorDidQuery = { node?: { isViewer: boolean, akashaBeamList?: { edges?: Array<{ node?: { id: string, reflectionsCount: number, active: boolean, tags?: Array<string | null> | null, version: any, createdAt: any, nsfw?: boolean | null, embeddedBeam?: { label: string, embeddedID: any } | null, author: { id: string, isViewer: boolean }, content: Array<{ blockID: any, order: number }> } | null } | null> | null, pageInfo: { startCursor?: string | null, endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean } } | null } | {} | null };

export type GetBeamByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type GetBeamByIdQuery = { node?: { id: string, reflectionsCount: number, active: boolean, tags?: Array<string | null> | null, version: any, createdAt: any, nsfw?: boolean | null, embeddedBeam?: { label: string, embeddedID: any } | null, author: { id: string, isViewer: boolean }, content: Array<{ blockID: any, order: number }> } | {} | null };

export type GetContentBlockByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type GetContentBlockByIdQuery = { node?: { active: boolean, appVersionID: any, createdAt: any, kind?: Types.AkashaContentBlockBlockDef | null, version: any, nsfw?: boolean | null, content: Array<{ propertyType: string, value: string, label: string }>, appVersion?: { applicationID: any, id: string, version: string, application?: { name: string, displayName: string, id: string } | null } | null, author: { id: string, isViewer: boolean } } | {} | null };

export type GetBlockStorageByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type GetBlockStorageByIdQuery = { node?: { appVersionID: any, createdAt: any, active: boolean, version: any, blockID: any, appVersion?: { applicationID: any, id: string, version: string, application?: { name: string, displayName: string, id: string } | null } | null, content: Array<{ propertyType: string, label: string, value: string }>, author: { id: string, isViewer: boolean }, block?: { id: string, active: boolean, author: { id: string, isViewer: boolean } } | null } | {} | null };

export type CreateBeamMutationVariables = Types.Exact<{
  i: Types.CreateAkashaBeamInput;
}>;


export type CreateBeamMutation = { createAkashaBeam?: { clientMutationId?: string | null, document: { id: string, reflectionsCount: number, active: boolean, tags?: Array<string | null> | null, version: any, createdAt: any, nsfw?: boolean | null, embeddedBeam?: { label: string, embeddedID: any } | null, author: { id: string, isViewer: boolean }, content: Array<{ blockID: any, order: number }> } } | null };

export type UpdateBeamMutationVariables = Types.Exact<{
  i: Types.UpdateAkashaBeamInput;
}>;


export type UpdateBeamMutation = { updateAkashaBeam?: { clientMutationId?: string | null, document: { id: string, reflectionsCount: number, active: boolean, tags?: Array<string | null> | null, version: any, createdAt: any, nsfw?: boolean | null, embeddedBeam?: { label: string, embeddedID: any } | null, author: { id: string, isViewer: boolean }, content: Array<{ blockID: any, order: number }> } } | null };

export type CreateContentBlockMutationVariables = Types.Exact<{
  i: Types.CreateAkashaContentBlockInput;
}>;


export type CreateContentBlockMutation = { createAkashaContentBlock?: { clientMutationId?: string | null, document: { active: boolean, appVersionID: any, createdAt: any, kind?: Types.AkashaContentBlockBlockDef | null, version: any, nsfw?: boolean | null, content: Array<{ propertyType: string, value: string, label: string }>, appVersion?: { applicationID: any, id: string, version: string, application?: { name: string, displayName: string, id: string } | null } | null, author: { id: string, isViewer: boolean } } } | null };

export type UpdateContentBlockMutationVariables = Types.Exact<{
  i: Types.UpdateAkashaContentBlockInput;
}>;


export type UpdateContentBlockMutation = { updateAkashaContentBlock?: { clientMutationId?: string | null, document: { active: boolean, appVersionID: any, createdAt: any, kind?: Types.AkashaContentBlockBlockDef | null, version: any, nsfw?: boolean | null, content: Array<{ propertyType: string, value: string, label: string }>, appVersion?: { applicationID: any, id: string, version: string, application?: { name: string, displayName: string, id: string } | null } | null, author: { id: string, isViewer: boolean } } } | null };

export type ReflectFragmentFragment = { version: any, active: boolean, isReply: boolean, reflection?: any | null, nsfw?: boolean | null, author: { id: string, isViewer: boolean }, content: Array<{ label: string, propertyType: string, value: string }>, beam?: { id: string, author: { id: string, isViewer: boolean } } | null };

export type GetReflectionsFromBeamQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
  after?: Types.InputMaybe<Types.Scalars['String']>;
  before?: Types.InputMaybe<Types.Scalars['String']>;
  first?: Types.InputMaybe<Types.Scalars['Int']>;
  last?: Types.InputMaybe<Types.Scalars['Int']>;
}>;


export type GetReflectionsFromBeamQuery = { node?: { reflections: { edges?: Array<{ node?: { version: any, active: boolean, isReply: boolean, reflection?: any | null, nsfw?: boolean | null, author: { id: string, isViewer: boolean }, content: Array<{ label: string, propertyType: string, value: string }>, beam?: { id: string, author: { id: string, isViewer: boolean } } | null } | null } | null> | null, pageInfo: { startCursor?: string | null, endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean } } } | {} | null };

export type GetReflectionsByAuthorDidQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
  after?: Types.InputMaybe<Types.Scalars['String']>;
  before?: Types.InputMaybe<Types.Scalars['String']>;
  first?: Types.InputMaybe<Types.Scalars['Int']>;
  last?: Types.InputMaybe<Types.Scalars['Int']>;
}>;


export type GetReflectionsByAuthorDidQuery = { node?: { isViewer: boolean, akashaReflectList?: { edges?: Array<{ node?: { version: any, active: boolean, isReply: boolean, reflection?: any | null, nsfw?: boolean | null, author: { id: string, isViewer: boolean }, content: Array<{ label: string, propertyType: string, value: string }>, beam?: { id: string, author: { id: string, isViewer: boolean } } | null } | null } | null> | null, pageInfo: { startCursor?: string | null, endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean } } | null } | {} | null };

export type GetReflectReflectionsQueryVariables = Types.Exact<{
  id: Types.Scalars['String'];
  after?: Types.InputMaybe<Types.Scalars['String']>;
  before?: Types.InputMaybe<Types.Scalars['String']>;
  first?: Types.InputMaybe<Types.Scalars['Int']>;
  last?: Types.InputMaybe<Types.Scalars['Int']>;
  sorting?: Types.InputMaybe<Types.AkashaReflectSortingInput>;
}>;


export type GetReflectReflectionsQuery = { akashaReflectIndex?: { edges?: Array<{ node?: { version: any, active: boolean, isReply: boolean, reflection?: any | null, nsfw?: boolean | null, author: { id: string, isViewer: boolean }, content: Array<{ label: string, propertyType: string, value: string }>, beam?: { id: string, author: { id: string, isViewer: boolean } } | null } | null } | null> | null, pageInfo: { startCursor?: string | null, endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean } } | null };

export type CreateReflectMutationVariables = Types.Exact<{
  i: Types.CreateAkashaReflectInput;
}>;


export type CreateReflectMutation = { createAkashaReflect?: { clientMutationId?: string | null, document: { version: any, active: boolean, isReply: boolean, reflection?: any | null, nsfw?: boolean | null, author: { id: string, isViewer: boolean }, content: Array<{ label: string, propertyType: string, value: string }>, beam?: { id: string, author: { id: string, isViewer: boolean } } | null } } | null };

export type UpdateAkashaReflectMutationVariables = Types.Exact<{
  i: Types.UpdateAkashaReflectInput;
}>;


export type UpdateAkashaReflectMutation = { updateAkashaReflect?: { clientMutationId?: string | null, document: { version: any, active: boolean, isReply: boolean, reflection?: any | null, nsfw?: boolean | null, author: { id: string, isViewer: boolean }, content: Array<{ label: string, propertyType: string, value: string }>, beam?: { id: string, author: { id: string, isViewer: boolean } } | null } } | null };

export type UserProfileFragmentFragment = { id: string, name: string, description?: string | null, createdAt: any, nsfw?: boolean | null, did: { id: string, isViewer: boolean }, links?: Array<{ href: any, label?: string | null } | null> | null, background?: { alternatives?: Array<{ src: any, width: number, height: number } | null> | null, default: { src: any, width: number, height: number } } | null, avatar?: { default: { src: any, width: number, height: number }, alternatives?: Array<{ src: any, width: number, height: number } | null> | null } | null, followers: { pageInfo: { startCursor?: string | null, endCursor?: string | null, hasPreviousPage: boolean, hasNextPage: boolean } } };

export type GetProfileByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type GetProfileByIdQuery = { node?: { id: string, name: string, description?: string | null, createdAt: any, nsfw?: boolean | null, did: { id: string, isViewer: boolean }, links?: Array<{ href: any, label?: string | null } | null> | null, background?: { alternatives?: Array<{ src: any, width: number, height: number } | null> | null, default: { src: any, width: number, height: number } } | null, avatar?: { default: { src: any, width: number, height: number }, alternatives?: Array<{ src: any, width: number, height: number } | null> | null } | null, followers: { pageInfo: { startCursor?: string | null, endCursor?: string | null, hasPreviousPage: boolean, hasNextPage: boolean } } } | {} | null };

export type GetProfileByDidQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type GetProfileByDidQuery = { node?: { isViewer: boolean, akashaProfile?: { id: string, name: string, description?: string | null, createdAt: any, nsfw?: boolean | null, did: { id: string, isViewer: boolean }, links?: Array<{ href: any, label?: string | null } | null> | null, background?: { alternatives?: Array<{ src: any, width: number, height: number } | null> | null, default: { src: any, width: number, height: number } } | null, avatar?: { default: { src: any, width: number, height: number }, alternatives?: Array<{ src: any, width: number, height: number } | null> | null } | null, followers: { pageInfo: { startCursor?: string | null, endCursor?: string | null, hasPreviousPage: boolean, hasNextPage: boolean } } } | null } | {} | null };

export type GetProfilesQueryVariables = Types.Exact<{
  after?: Types.InputMaybe<Types.Scalars['String']>;
  before?: Types.InputMaybe<Types.Scalars['String']>;
  first?: Types.InputMaybe<Types.Scalars['Int']>;
  last?: Types.InputMaybe<Types.Scalars['Int']>;
  filters?: Types.InputMaybe<Types.AkashaProfileFiltersInput>;
  sorting?: Types.InputMaybe<Types.AkashaProfileSortingInput>;
}>;


export type GetProfilesQuery = { akashaProfileIndex?: { edges?: Array<{ node?: { id: string, name: string, description?: string | null, createdAt: any, nsfw?: boolean | null, did: { id: string, isViewer: boolean }, links?: Array<{ href: any, label?: string | null } | null> | null, background?: { alternatives?: Array<{ src: any, width: number, height: number } | null> | null, default: { src: any, width: number, height: number } } | null, avatar?: { default: { src: any, width: number, height: number }, alternatives?: Array<{ src: any, width: number, height: number } | null> | null } | null, followers: { pageInfo: { startCursor?: string | null, endCursor?: string | null, hasPreviousPage: boolean, hasNextPage: boolean } } } | null } | null> | null, pageInfo: { startCursor?: string | null, endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean } } | null };

export type GetInterestsQueryVariables = Types.Exact<{
  after?: Types.InputMaybe<Types.Scalars['String']>;
  before?: Types.InputMaybe<Types.Scalars['String']>;
  first?: Types.InputMaybe<Types.Scalars['Int']>;
  last?: Types.InputMaybe<Types.Scalars['Int']>;
}>;


export type GetInterestsQuery = { akashaProfileInterestsIndex?: { edges?: Array<{ node?: { id: string, topics: Array<{ value: string, labelType: string }>, did: { id: string } } | null } | null> | null, pageInfo: { startCursor?: string | null, endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean } } | null };

export type GetInterestsByDidQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type GetInterestsByDidQuery = { node?: { isViewer: boolean, akashaProfileInterests?: { id: string, topics: Array<{ value: string, labelType: string }>, did: { id: string } } | null } | {} | null };

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
  sorting?: Types.InputMaybe<Types.AkashaFollowSortingInput>;
}>;


export type GetFollowingListByDidQuery = { node?: { isViewer: boolean, akashaFollowList?: { edges?: Array<{ node?: { id: string, isFollowing: boolean, profileID: any, profile?: { id: string, name: string, description?: string | null, createdAt: any, nsfw?: boolean | null, did: { id: string, isViewer: boolean }, links?: Array<{ href: any, label?: string | null } | null> | null, background?: { alternatives?: Array<{ src: any, width: number, height: number } | null> | null, default: { src: any, width: number, height: number } } | null, avatar?: { default: { src: any, width: number, height: number }, alternatives?: Array<{ src: any, width: number, height: number } | null> | null } | null, followers: { pageInfo: { startCursor?: string | null, endCursor?: string | null, hasPreviousPage: boolean, hasNextPage: boolean } } } | null } | null } | null> | null, pageInfo: { startCursor?: string | null, endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean } } | null } | {} | null };

export type GetFollowersListByDidQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
  after?: Types.InputMaybe<Types.Scalars['String']>;
  before?: Types.InputMaybe<Types.Scalars['String']>;
  first?: Types.InputMaybe<Types.Scalars['Int']>;
  last?: Types.InputMaybe<Types.Scalars['Int']>;
  sorting?: Types.InputMaybe<Types.AkashaFollowSortingInput>;
}>;


export type GetFollowersListByDidQuery = { node?: { isViewer: boolean, akashaProfile?: { followers: { edges?: Array<{ node?: { id: string, isFollowing: boolean, profileID: any, profile?: { id: string, name: string, description?: string | null, createdAt: any, nsfw?: boolean | null, did: { id: string, isViewer: boolean }, links?: Array<{ href: any, label?: string | null } | null> | null, background?: { alternatives?: Array<{ src: any, width: number, height: number } | null> | null, default: { src: any, width: number, height: number } } | null, avatar?: { default: { src: any, width: number, height: number }, alternatives?: Array<{ src: any, width: number, height: number } | null> | null } | null, followers: { pageInfo: { startCursor?: string | null, endCursor?: string | null, hasPreviousPage: boolean, hasNextPage: boolean } } } | null, did: { akashaProfile?: { id: string, name: string, description?: string | null, createdAt: any, nsfw?: boolean | null, did: { id: string, isViewer: boolean }, links?: Array<{ href: any, label?: string | null } | null> | null, background?: { alternatives?: Array<{ src: any, width: number, height: number } | null> | null, default: { src: any, width: number, height: number } } | null, avatar?: { default: { src: any, width: number, height: number }, alternatives?: Array<{ src: any, width: number, height: number } | null> | null } | null, followers: { pageInfo: { startCursor?: string | null, endCursor?: string | null, hasPreviousPage: boolean, hasNextPage: boolean } } } | null } } | null } | null> | null, pageInfo: { startCursor?: string | null, endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean } } } | null } | {} | null };

export type GetMyProfileQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetMyProfileQuery = { viewer?: { akashaProfile?: { id: string, name: string, description?: string | null, createdAt: any, nsfw?: boolean | null, did: { id: string, isViewer: boolean }, links?: Array<{ href: any, label?: string | null } | null> | null, background?: { alternatives?: Array<{ src: any, width: number, height: number } | null> | null, default: { src: any, width: number, height: number } } | null, avatar?: { default: { src: any, width: number, height: number }, alternatives?: Array<{ src: any, width: number, height: number } | null> | null } | null, followers: { pageInfo: { startCursor?: string | null, endCursor?: string | null, hasPreviousPage: boolean, hasNextPage: boolean } } } | null } | null };

export type GetFollowDocumentQueryVariables = Types.Exact<{
  follower: Types.Scalars['ID'];
  following: Types.Scalars['String'];
}>;


export type GetFollowDocumentQuery = { node?: { isViewer: boolean, akashaProfile?: { followers: { edges?: Array<{ node?: { id: string, isFollowing: boolean, profileID: any, profile?: { id: string, name: string, description?: string | null, createdAt: any, nsfw?: boolean | null, did: { id: string, isViewer: boolean }, links?: Array<{ href: any, label?: string | null } | null> | null, background?: { alternatives?: Array<{ src: any, width: number, height: number } | null> | null, default: { src: any, width: number, height: number } } | null, avatar?: { default: { src: any, width: number, height: number }, alternatives?: Array<{ src: any, width: number, height: number } | null> | null } | null, followers: { pageInfo: { startCursor?: string | null, endCursor?: string | null, hasPreviousPage: boolean, hasNextPage: boolean } } } | null } | null } | null> | null, pageInfo: { startCursor?: string | null, endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean } } } | null } | {} | null };

export type CreateProfileMutationVariables = Types.Exact<{
  i: Types.CreateAkashaProfileInput;
}>;


export type CreateProfileMutation = { createAkashaProfile?: { clientMutationId?: string | null, document: { id: string, name: string, description?: string | null, createdAt: any, nsfw?: boolean | null, did: { id: string, isViewer: boolean }, links?: Array<{ href: any, label?: string | null } | null> | null, background?: { alternatives?: Array<{ src: any, width: number, height: number } | null> | null, default: { src: any, width: number, height: number } } | null, avatar?: { default: { src: any, width: number, height: number }, alternatives?: Array<{ src: any, width: number, height: number } | null> | null } | null, followers: { pageInfo: { startCursor?: string | null, endCursor?: string | null, hasPreviousPage: boolean, hasNextPage: boolean } } } } | null };

export type UpdateProfileMutationVariables = Types.Exact<{
  i: Types.UpdateAkashaProfileInput;
}>;


export type UpdateProfileMutation = { updateAkashaProfile?: { clientMutationId?: string | null, document: { id: string, name: string, description?: string | null, createdAt: any, nsfw?: boolean | null, did: { id: string, isViewer: boolean }, links?: Array<{ href: any, label?: string | null } | null> | null, background?: { alternatives?: Array<{ src: any, width: number, height: number } | null> | null, default: { src: any, width: number, height: number } } | null, avatar?: { default: { src: any, width: number, height: number }, alternatives?: Array<{ src: any, width: number, height: number } | null> | null } | null, followers: { pageInfo: { startCursor?: string | null, endCursor?: string | null, hasPreviousPage: boolean, hasNextPage: boolean } } } } | null };

export type CreateInterestsMutationVariables = Types.Exact<{
  i: Types.CreateAkashaProfileInterestsInput;
}>;


export type CreateInterestsMutation = { createAkashaProfileInterests?: { clientMutationId?: string | null, document: { id: string, topics: Array<{ value: string, labelType: string }>, did: { id: string } } } | null };

export type UpdateInterestsMutationVariables = Types.Exact<{
  i: Types.UpdateAkashaProfileInterestsInput;
}>;


export type UpdateInterestsMutation = { updateAkashaProfileInterests?: { clientMutationId?: string | null, document: { id: string, topics: Array<{ value: string, labelType: string }>, did: { id: string } } } | null };

export type CreateFollowMutationVariables = Types.Exact<{
  i: Types.CreateAkashaFollowInput;
}>;


export type CreateFollowMutation = { createAkashaFollow?: { document: { isFollowing: boolean, id: string, profile?: { id: string, name: string, description?: string | null, createdAt: any, nsfw?: boolean | null, did: { id: string, isViewer: boolean }, links?: Array<{ href: any, label?: string | null } | null> | null, background?: { alternatives?: Array<{ src: any, width: number, height: number } | null> | null, default: { src: any, width: number, height: number } } | null, avatar?: { default: { src: any, width: number, height: number }, alternatives?: Array<{ src: any, width: number, height: number } | null> | null } | null, followers: { pageInfo: { startCursor?: string | null, endCursor?: string | null, hasPreviousPage: boolean, hasNextPage: boolean } } } | null, did: { id: string } } } | null };

export type UpdateFollowMutationVariables = Types.Exact<{
  i: Types.UpdateAkashaFollowInput;
}>;


export type UpdateFollowMutation = { updateAkashaFollow?: { document: { isFollowing: boolean, id: string, profile?: { id: string, name: string, description?: string | null, createdAt: any, nsfw?: boolean | null, did: { id: string, isViewer: boolean }, links?: Array<{ href: any, label?: string | null } | null> | null, background?: { alternatives?: Array<{ src: any, width: number, height: number } | null> | null, default: { src: any, width: number, height: number } } | null, avatar?: { default: { src: any, width: number, height: number }, alternatives?: Array<{ src: any, width: number, height: number } | null> | null } | null, followers: { pageInfo: { startCursor?: string | null, endCursor?: string | null, hasPreviousPage: boolean, hasNextPage: boolean } } } | null, did: { id: string } } } | null };

export type AkashaAppFragmentFragment = { id: string, applicationType?: Types.AkashaAppApplicationType | null, description: string, licence: string, name: string, displayName: string, keywords?: Array<string | null> | null, releasesCount: number, releases: { edges?: Array<{ node?: { id: string, createdAt: any, source: any, version: string } | null } | null> | null }, author: { id: string, isViewer: boolean, akashaProfile?: { id: string, name: string, description?: string | null, createdAt: any, nsfw?: boolean | null, did: { id: string, isViewer: boolean }, links?: Array<{ href: any, label?: string | null } | null> | null, background?: { alternatives?: Array<{ src: any, width: number, height: number } | null> | null, default: { src: any, width: number, height: number } } | null, avatar?: { default: { src: any, width: number, height: number }, alternatives?: Array<{ src: any, width: number, height: number } | null> | null } | null, followers: { pageInfo: { startCursor?: string | null, endCursor?: string | null, hasPreviousPage: boolean, hasNextPage: boolean } } } | null }, contributors?: Array<{ id: string, isViewer: boolean, akashaProfile?: { id: string, name: string, description?: string | null, createdAt: any, nsfw?: boolean | null, did: { id: string, isViewer: boolean }, links?: Array<{ href: any, label?: string | null } | null> | null, background?: { alternatives?: Array<{ src: any, width: number, height: number } | null> | null, default: { src: any, width: number, height: number } } | null, avatar?: { default: { src: any, width: number, height: number }, alternatives?: Array<{ src: any, width: number, height: number } | null> | null } | null, followers: { pageInfo: { startCursor?: string | null, endCursor?: string | null, hasPreviousPage: boolean, hasNextPage: boolean } } } | null } | null> | null };

export type AppReleaseFragmentFragment = { applicationID: any, id: string, source: any, version: string, createdAt: any, application?: { id: string, applicationType?: Types.AkashaAppApplicationType | null, description: string, licence: string, name: string, displayName: string, keywords?: Array<string | null> | null, releasesCount: number, releases: { edges?: Array<{ node?: { id: string, createdAt: any, source: any, version: string } | null } | null> | null }, author: { id: string, isViewer: boolean, akashaProfile?: { id: string, name: string, description?: string | null, createdAt: any, nsfw?: boolean | null, did: { id: string, isViewer: boolean }, links?: Array<{ href: any, label?: string | null } | null> | null, background?: { alternatives?: Array<{ src: any, width: number, height: number } | null> | null, default: { src: any, width: number, height: number } } | null, avatar?: { default: { src: any, width: number, height: number }, alternatives?: Array<{ src: any, width: number, height: number } | null> | null } | null, followers: { pageInfo: { startCursor?: string | null, endCursor?: string | null, hasPreviousPage: boolean, hasNextPage: boolean } } } | null }, contributors?: Array<{ id: string, isViewer: boolean, akashaProfile?: { id: string, name: string, description?: string | null, createdAt: any, nsfw?: boolean | null, did: { id: string, isViewer: boolean }, links?: Array<{ href: any, label?: string | null } | null> | null, background?: { alternatives?: Array<{ src: any, width: number, height: number } | null> | null, default: { src: any, width: number, height: number } } | null, avatar?: { default: { src: any, width: number, height: number }, alternatives?: Array<{ src: any, width: number, height: number } | null> | null } | null, followers: { pageInfo: { startCursor?: string | null, endCursor?: string | null, hasPreviousPage: boolean, hasNextPage: boolean } } } | null } | null> | null } | null };

export type CreateAppMutationVariables = Types.Exact<{
  i: Types.CreateAkashaAppInput;
}>;


export type CreateAppMutation = { createAkashaApp?: { clientMutationId?: string | null, document: { id: string, applicationType?: Types.AkashaAppApplicationType | null, description: string, licence: string, name: string, displayName: string, keywords?: Array<string | null> | null, releasesCount: number, releases: { edges?: Array<{ node?: { id: string, createdAt: any, source: any, version: string } | null } | null> | null }, author: { id: string, isViewer: boolean, akashaProfile?: { id: string, name: string, description?: string | null, createdAt: any, nsfw?: boolean | null, did: { id: string, isViewer: boolean }, links?: Array<{ href: any, label?: string | null } | null> | null, background?: { alternatives?: Array<{ src: any, width: number, height: number } | null> | null, default: { src: any, width: number, height: number } } | null, avatar?: { default: { src: any, width: number, height: number }, alternatives?: Array<{ src: any, width: number, height: number } | null> | null } | null, followers: { pageInfo: { startCursor?: string | null, endCursor?: string | null, hasPreviousPage: boolean, hasNextPage: boolean } } } | null }, contributors?: Array<{ id: string, isViewer: boolean, akashaProfile?: { id: string, name: string, description?: string | null, createdAt: any, nsfw?: boolean | null, did: { id: string, isViewer: boolean }, links?: Array<{ href: any, label?: string | null } | null> | null, background?: { alternatives?: Array<{ src: any, width: number, height: number } | null> | null, default: { src: any, width: number, height: number } } | null, avatar?: { default: { src: any, width: number, height: number }, alternatives?: Array<{ src: any, width: number, height: number } | null> | null } | null, followers: { pageInfo: { startCursor?: string | null, endCursor?: string | null, hasPreviousPage: boolean, hasNextPage: boolean } } } | null } | null> | null } } | null };

export type UpdateAppMutationVariables = Types.Exact<{
  i: Types.UpdateAkashaAppInput;
}>;


export type UpdateAppMutation = { updateAkashaApp?: { clientMutationId?: string | null, document: { id: string, applicationType?: Types.AkashaAppApplicationType | null, description: string, licence: string, name: string, displayName: string, keywords?: Array<string | null> | null, releasesCount: number, releases: { edges?: Array<{ node?: { id: string, createdAt: any, source: any, version: string } | null } | null> | null }, author: { id: string, isViewer: boolean, akashaProfile?: { id: string, name: string, description?: string | null, createdAt: any, nsfw?: boolean | null, did: { id: string, isViewer: boolean }, links?: Array<{ href: any, label?: string | null } | null> | null, background?: { alternatives?: Array<{ src: any, width: number, height: number } | null> | null, default: { src: any, width: number, height: number } } | null, avatar?: { default: { src: any, width: number, height: number }, alternatives?: Array<{ src: any, width: number, height: number } | null> | null } | null, followers: { pageInfo: { startCursor?: string | null, endCursor?: string | null, hasPreviousPage: boolean, hasNextPage: boolean } } } | null }, contributors?: Array<{ id: string, isViewer: boolean, akashaProfile?: { id: string, name: string, description?: string | null, createdAt: any, nsfw?: boolean | null, did: { id: string, isViewer: boolean }, links?: Array<{ href: any, label?: string | null } | null> | null, background?: { alternatives?: Array<{ src: any, width: number, height: number } | null> | null, default: { src: any, width: number, height: number } } | null, avatar?: { default: { src: any, width: number, height: number }, alternatives?: Array<{ src: any, width: number, height: number } | null> | null } | null, followers: { pageInfo: { startCursor?: string | null, endCursor?: string | null, hasPreviousPage: boolean, hasNextPage: boolean } } } | null } | null> | null } } | null };

export type GetAppsQueryVariables = Types.Exact<{
  after?: Types.InputMaybe<Types.Scalars['String']>;
  before?: Types.InputMaybe<Types.Scalars['String']>;
  first?: Types.InputMaybe<Types.Scalars['Int']>;
  last?: Types.InputMaybe<Types.Scalars['Int']>;
  filters?: Types.InputMaybe<Types.AkashaAppFiltersInput>;
  sorting?: Types.InputMaybe<Types.AkashaAppSortingInput>;
}>;


export type GetAppsQuery = { akashaAppIndex?: { edges?: Array<{ node?: { id: string, applicationType?: Types.AkashaAppApplicationType | null, description: string, licence: string, name: string, displayName: string, keywords?: Array<string | null> | null, releasesCount: number, releases: { edges?: Array<{ node?: { id: string, createdAt: any, source: any, version: string } | null } | null> | null }, author: { id: string, isViewer: boolean, akashaProfile?: { id: string, name: string, description?: string | null, createdAt: any, nsfw?: boolean | null, did: { id: string, isViewer: boolean }, links?: Array<{ href: any, label?: string | null } | null> | null, background?: { alternatives?: Array<{ src: any, width: number, height: number } | null> | null, default: { src: any, width: number, height: number } } | null, avatar?: { default: { src: any, width: number, height: number }, alternatives?: Array<{ src: any, width: number, height: number } | null> | null } | null, followers: { pageInfo: { startCursor?: string | null, endCursor?: string | null, hasPreviousPage: boolean, hasNextPage: boolean } } } | null }, contributors?: Array<{ id: string, isViewer: boolean, akashaProfile?: { id: string, name: string, description?: string | null, createdAt: any, nsfw?: boolean | null, did: { id: string, isViewer: boolean }, links?: Array<{ href: any, label?: string | null } | null> | null, background?: { alternatives?: Array<{ src: any, width: number, height: number } | null> | null, default: { src: any, width: number, height: number } } | null, avatar?: { default: { src: any, width: number, height: number }, alternatives?: Array<{ src: any, width: number, height: number } | null> | null } | null, followers: { pageInfo: { startCursor?: string | null, endCursor?: string | null, hasPreviousPage: boolean, hasNextPage: boolean } } } | null } | null> | null } | null } | null> | null, pageInfo: { startCursor?: string | null, endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean } } | null };

export type GetAppsByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type GetAppsByIdQuery = { node?: { id: string, applicationType?: Types.AkashaAppApplicationType | null, description: string, licence: string, name: string, displayName: string, keywords?: Array<string | null> | null, releasesCount: number, releases: { edges?: Array<{ node?: { id: string, createdAt: any, source: any, version: string } | null } | null> | null }, author: { id: string, isViewer: boolean, akashaProfile?: { id: string, name: string, description?: string | null, createdAt: any, nsfw?: boolean | null, did: { id: string, isViewer: boolean }, links?: Array<{ href: any, label?: string | null } | null> | null, background?: { alternatives?: Array<{ src: any, width: number, height: number } | null> | null, default: { src: any, width: number, height: number } } | null, avatar?: { default: { src: any, width: number, height: number }, alternatives?: Array<{ src: any, width: number, height: number } | null> | null } | null, followers: { pageInfo: { startCursor?: string | null, endCursor?: string | null, hasPreviousPage: boolean, hasNextPage: boolean } } } | null }, contributors?: Array<{ id: string, isViewer: boolean, akashaProfile?: { id: string, name: string, description?: string | null, createdAt: any, nsfw?: boolean | null, did: { id: string, isViewer: boolean }, links?: Array<{ href: any, label?: string | null } | null> | null, background?: { alternatives?: Array<{ src: any, width: number, height: number } | null> | null, default: { src: any, width: number, height: number } } | null, avatar?: { default: { src: any, width: number, height: number }, alternatives?: Array<{ src: any, width: number, height: number } | null> | null } | null, followers: { pageInfo: { startCursor?: string | null, endCursor?: string | null, hasPreviousPage: boolean, hasNextPage: boolean } } } | null } | null> | null } | {} | null };

export type CreateAppReleaseMutationVariables = Types.Exact<{
  i: Types.CreateAkashaAppReleaseInput;
}>;


export type CreateAppReleaseMutation = { createAkashaAppRelease?: { clientMutationId?: string | null, document: { applicationID: any, id: string, source: any, version: string, createdAt: any, application?: { id: string, applicationType?: Types.AkashaAppApplicationType | null, description: string, licence: string, name: string, displayName: string, keywords?: Array<string | null> | null, releasesCount: number, releases: { edges?: Array<{ node?: { id: string, createdAt: any, source: any, version: string } | null } | null> | null }, author: { id: string, isViewer: boolean, akashaProfile?: { id: string, name: string, description?: string | null, createdAt: any, nsfw?: boolean | null, did: { id: string, isViewer: boolean }, links?: Array<{ href: any, label?: string | null } | null> | null, background?: { alternatives?: Array<{ src: any, width: number, height: number } | null> | null, default: { src: any, width: number, height: number } } | null, avatar?: { default: { src: any, width: number, height: number }, alternatives?: Array<{ src: any, width: number, height: number } | null> | null } | null, followers: { pageInfo: { startCursor?: string | null, endCursor?: string | null, hasPreviousPage: boolean, hasNextPage: boolean } } } | null }, contributors?: Array<{ id: string, isViewer: boolean, akashaProfile?: { id: string, name: string, description?: string | null, createdAt: any, nsfw?: boolean | null, did: { id: string, isViewer: boolean }, links?: Array<{ href: any, label?: string | null } | null> | null, background?: { alternatives?: Array<{ src: any, width: number, height: number } | null> | null, default: { src: any, width: number, height: number } } | null, avatar?: { default: { src: any, width: number, height: number }, alternatives?: Array<{ src: any, width: number, height: number } | null> | null } | null, followers: { pageInfo: { startCursor?: string | null, endCursor?: string | null, hasPreviousPage: boolean, hasNextPage: boolean } } } | null } | null> | null } | null } } | null };

export type UpdateAppReleaseMutationVariables = Types.Exact<{
  i: Types.UpdateAkashaAppReleaseInput;
}>;


export type UpdateAppReleaseMutation = { updateAkashaAppRelease?: { clientMutationId?: string | null, document: { applicationID: any, id: string, source: any, version: string, createdAt: any, application?: { id: string, applicationType?: Types.AkashaAppApplicationType | null, description: string, licence: string, name: string, displayName: string, keywords?: Array<string | null> | null, releasesCount: number, releases: { edges?: Array<{ node?: { id: string, createdAt: any, source: any, version: string } | null } | null> | null }, author: { id: string, isViewer: boolean, akashaProfile?: { id: string, name: string, description?: string | null, createdAt: any, nsfw?: boolean | null, did: { id: string, isViewer: boolean }, links?: Array<{ href: any, label?: string | null } | null> | null, background?: { alternatives?: Array<{ src: any, width: number, height: number } | null> | null, default: { src: any, width: number, height: number } } | null, avatar?: { default: { src: any, width: number, height: number }, alternatives?: Array<{ src: any, width: number, height: number } | null> | null } | null, followers: { pageInfo: { startCursor?: string | null, endCursor?: string | null, hasPreviousPage: boolean, hasNextPage: boolean } } } | null }, contributors?: Array<{ id: string, isViewer: boolean, akashaProfile?: { id: string, name: string, description?: string | null, createdAt: any, nsfw?: boolean | null, did: { id: string, isViewer: boolean }, links?: Array<{ href: any, label?: string | null } | null> | null, background?: { alternatives?: Array<{ src: any, width: number, height: number } | null> | null, default: { src: any, width: number, height: number } } | null, avatar?: { default: { src: any, width: number, height: number }, alternatives?: Array<{ src: any, width: number, height: number } | null> | null } | null, followers: { pageInfo: { startCursor?: string | null, endCursor?: string | null, hasPreviousPage: boolean, hasNextPage: boolean } } } | null } | null> | null } | null } } | null };

export type GetAppsReleasesQueryVariables = Types.Exact<{
  after?: Types.InputMaybe<Types.Scalars['String']>;
  before?: Types.InputMaybe<Types.Scalars['String']>;
  first?: Types.InputMaybe<Types.Scalars['Int']>;
  last?: Types.InputMaybe<Types.Scalars['Int']>;
  filters?: Types.InputMaybe<Types.AkashaAppReleaseFiltersInput>;
  sorting?: Types.InputMaybe<Types.AkashaAppReleaseSortingInput>;
}>;


export type GetAppsReleasesQuery = { akashaAppReleaseIndex?: { edges?: Array<{ node?: { applicationID: any, id: string, source: any, version: string, createdAt: any, application?: { id: string, applicationType?: Types.AkashaAppApplicationType | null, description: string, licence: string, name: string, displayName: string, keywords?: Array<string | null> | null, releasesCount: number, releases: { edges?: Array<{ node?: { id: string, createdAt: any, source: any, version: string } | null } | null> | null }, author: { id: string, isViewer: boolean, akashaProfile?: { id: string, name: string, description?: string | null, createdAt: any, nsfw?: boolean | null, did: { id: string, isViewer: boolean }, links?: Array<{ href: any, label?: string | null } | null> | null, background?: { alternatives?: Array<{ src: any, width: number, height: number } | null> | null, default: { src: any, width: number, height: number } } | null, avatar?: { default: { src: any, width: number, height: number }, alternatives?: Array<{ src: any, width: number, height: number } | null> | null } | null, followers: { pageInfo: { startCursor?: string | null, endCursor?: string | null, hasPreviousPage: boolean, hasNextPage: boolean } } } | null }, contributors?: Array<{ id: string, isViewer: boolean, akashaProfile?: { id: string, name: string, description?: string | null, createdAt: any, nsfw?: boolean | null, did: { id: string, isViewer: boolean }, links?: Array<{ href: any, label?: string | null } | null> | null, background?: { alternatives?: Array<{ src: any, width: number, height: number } | null> | null, default: { src: any, width: number, height: number } } | null, avatar?: { default: { src: any, width: number, height: number }, alternatives?: Array<{ src: any, width: number, height: number } | null> | null } | null, followers: { pageInfo: { startCursor?: string | null, endCursor?: string | null, hasPreviousPage: boolean, hasNextPage: boolean } } } | null } | null> | null } | null } | null } | null> | null, pageInfo: { startCursor?: string | null, endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean } } | null };

export type GetAppReleaseByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type GetAppReleaseByIdQuery = { node?: { applicationID: any, id: string, source: any, version: string, createdAt: any, application?: { id: string, applicationType?: Types.AkashaAppApplicationType | null, description: string, licence: string, name: string, displayName: string, keywords?: Array<string | null> | null, releasesCount: number, releases: { edges?: Array<{ node?: { id: string, createdAt: any, source: any, version: string } | null } | null> | null }, author: { id: string, isViewer: boolean, akashaProfile?: { id: string, name: string, description?: string | null, createdAt: any, nsfw?: boolean | null, did: { id: string, isViewer: boolean }, links?: Array<{ href: any, label?: string | null } | null> | null, background?: { alternatives?: Array<{ src: any, width: number, height: number } | null> | null, default: { src: any, width: number, height: number } } | null, avatar?: { default: { src: any, width: number, height: number }, alternatives?: Array<{ src: any, width: number, height: number } | null> | null } | null, followers: { pageInfo: { startCursor?: string | null, endCursor?: string | null, hasPreviousPage: boolean, hasNextPage: boolean } } } | null }, contributors?: Array<{ id: string, isViewer: boolean, akashaProfile?: { id: string, name: string, description?: string | null, createdAt: any, nsfw?: boolean | null, did: { id: string, isViewer: boolean }, links?: Array<{ href: any, label?: string | null } | null> | null, background?: { alternatives?: Array<{ src: any, width: number, height: number } | null> | null, default: { src: any, width: number, height: number } } | null, avatar?: { default: { src: any, width: number, height: number }, alternatives?: Array<{ src: any, width: number, height: number } | null> | null } | null, followers: { pageInfo: { startCursor?: string | null, endCursor?: string | null, hasPreviousPage: boolean, hasNextPage: boolean } } } | null } | null> | null } | null } | {} | null };
