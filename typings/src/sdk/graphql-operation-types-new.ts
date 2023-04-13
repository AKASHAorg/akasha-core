import type * as Types from './graphql-types-new';

export type UserProfileFragmentFragment = { id: string, name: string, description?: string | null, createdAt: any, did: { id: string }, links?: Array<{ href: any, label?: string | null } | null> | null, background?: { alternatives?: Array<{ src: any, width: number, height: number } | null> | null, default: { src: any, width: number, height: number } } | null, avatar?: { default: { src: any, width: number, height: number }, alternatives?: Array<{ src: any, width: number, height: number } | null> | null } | null };

export type GetProfileByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type GetProfileByIdQuery = { node?: { id: string, name: string, description?: string | null, createdAt: any, did: { id: string }, links?: Array<{ href: any, label?: string | null } | null> | null, background?: { alternatives?: Array<{ src: any, width: number, height: number } | null> | null, default: { src: any, width: number, height: number } } | null, avatar?: { default: { src: any, width: number, height: number }, alternatives?: Array<{ src: any, width: number, height: number } | null> | null } | null } | {} | null };

export type GetProfileByDidQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type GetProfileByDidQuery = { node?: { profile?: { id: string, name: string, description?: string | null, createdAt: any, did: { id: string }, links?: Array<{ href: any, label?: string | null } | null> | null, background?: { alternatives?: Array<{ src: any, width: number, height: number } | null> | null, default: { src: any, width: number, height: number } } | null, avatar?: { default: { src: any, width: number, height: number }, alternatives?: Array<{ src: any, width: number, height: number } | null> | null } | null } | null } | {} | null };
