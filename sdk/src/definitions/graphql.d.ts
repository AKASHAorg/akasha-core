declare module '*/profile.graphql' {
  import { DocumentNode, TypedQueryDocumentNode } from 'graphql';

  const AddProfileProvider: DocumentNode;
  const MakeDefaultProvider: DocumentNode;
  const RegisterUsername: DocumentNode;
  const ResolveProfile: TypedQueryDocumentNode;
  const GetProfile: TypedQueryDocumentNode;
  const Follow: DocumentNode;
  const UnFollow: DocumentNode;
  const IsFollowing: TypedQueryDocumentNode;
  const SaveMetaData: DocumentNode;
  const SearchProfiles: TypedQueryDocumentNode;
  const GlobalSearch: TypedQueryDocumentNode;

  export {
    AddProfileProvider,
    MakeDefaultProvider,
    RegisterUsername,
    ResolveProfile,
    GetProfile,
    Follow,
    UnFollow,
    IsFollowing,
    SaveMetaData,
    SearchProfiles,
    GlobalSearch,
  };
}

declare module '*/tag.graphql' {
  import { DocumentNode, FragmentSpreadNode, TypedQueryDocumentNode } from 'graphql';
  const TagFields: FragmentSpreadNode;
  const GetTag: TypedQueryDocumentNode;
  const GetTags: TypedQueryDocumentNode;
  const SearchTags: TypedQueryDocumentNode;
  const CreateTag: DocumentNode;

  export { TagFields, GetTag, GetTags, SearchTags, CreateTag };
}

declare module '*/entry.graphql' {
  import { DocumentNode, FragmentSpreadNode, TypedQueryDocumentNode } from 'graphql';
  const DataProviderFragment: FragmentSpreadNode;
  const UserProfileFragment: FragmentSpreadNode;
  const GetEntry: TypedQueryDocumentNode;
  const GetEntries: TypedQueryDocumentNode;
  const GetPostsByAuthor: TypedQueryDocumentNode;
  const GetPostsByTag: TypedQueryDocumentNode;
  const CreateEntry: DocumentNode;
  const EditEntry: DocumentNode;

  export {
    DataProviderFragment,
    UserProfileFragment,
    GetEntry,
    GetEntries,
    GetPostsByAuthor,
    GetPostsByTag,
    CreateEntry,
    EditEntry,
  };
}

declare module '*/comments.graphql' {
  import { DocumentNode, FragmentSpreadNode, TypedQueryDocumentNode } from 'graphql';
  const DataProviderFragment: FragmentSpreadNode;
  const UserProfileFragment: FragmentSpreadNode;
  const GetComment: TypedQueryDocumentNode;
  const GetComments: TypedQueryDocumentNode;
  const AddComment: DocumentNode;
  const EditComment: DocumentNode;

  export {
    GetComment,
    GetComments,
    AddComment,
    DataProviderFragment,
    UserProfileFragment,
    EditComment,
  };
}
