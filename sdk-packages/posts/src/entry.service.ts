import { AkashaService } from '@akashaproject/sdk-core/lib/IAkashaModule';
import { ENTRY_SERVICE } from './constants';
import { runGQL } from '@akashaproject/sdk-runtime/lib/gql.network.client';
import authServices, { AUTH_SERVICE } from '@akashaproject/sdk-auth/lib/constants';

interface DataProviderInput {
  provider: string;
  property: string;
  value: string;
}
const service: AkashaService = (invoke, log) => {
  const getEntry = async (opt: { entryId: string }) => {
    const query = `
  query GetEntry($id: String!, $pubKey: String) {
       getPost(id: $id, pubKey:$pubKey) {
        content{
          provider
          property
          value
        }
        author {
          pubKey
          name
          userName
          avatar
          coverImage
          description
          ethAddress
          totalPosts
          totalFollowers
          totalFollowing
        }
        title
        type
        _id
        creationDate
        tags
        totalComments
        quotedBy
        quotedByAuthors{
          pubKey
          name
          userName
          avatar
          coverImage
          description
          ethAddress
          totalPosts
          totalFollowers
          totalFollowing
        }
        quotes{
            content{
              provider
              property
              value
            }
            author{
              pubKey
              name
              userName
              avatar
              coverImage
              ethAddress
              totalPosts
              totalFollowers
              totalFollowing
            }
            title
            type
            _id
            creationDate
            tags
          }
       }
      }`;
    const currentUser = await invoke(authServices[AUTH_SERVICE]).getCurrentUser();
    const result = await runGQL({
      query: query,
      variables: { id: opt.entryId, pubKey: currentUser?.pubKey },
      operationName: 'GetEntry',
    });
    return result.data;
  };

  const entries = async (opt: { offset?: string; limit: number }) => {
    const query = `
  query GetEntries($offset: String, $limit: Int, $pubKey: String) {
       posts(offset: $offset, limit: $limit, pubKey:$pubKey) {
        results{
          content{
            provider
            property
            value
          }
          author{
            pubKey
            name
            userName
            avatar
            coverImage
            description
            ethAddress
            totalPosts
            totalFollowers
            totalFollowing
          }
          title
          type
          _id
          creationDate
          tags
          totalComments
          quotedBy
          quotedByAuthors{
            pubKey
            name
            userName
            avatar
            coverImage
            description
            ethAddress
            totalPosts
            totalFollowers
            totalFollowing
        }
          quotes{
            content{
              provider
              property
              value
            }
            author{
              pubKey
              name
              userName
              avatar
              coverImage
              ethAddress
              totalPosts
              totalFollowers
              totalFollowing
            }
            title
            type
            _id
            creationDate
            tags
          }
        }
        nextIndex
        total
       }
      }`;
    const currentUser = await invoke(authServices[AUTH_SERVICE]).getCurrentUser();
    const result = await runGQL({
      query: query,
      variables: { offset: opt.offset, limit: opt.limit, pubKey: currentUser?.pubKey },
      operationName: 'GetEntries',
    });
    return result.data;
  };

  const postEntry = async (opt: {
    data: DataProviderInput;
    post: { title?: string; tags?: string[]; quotes?: string[] };
  }) => {
    const token = await invoke(authServices[AUTH_SERVICE]).getToken();
    const mutation = `
  mutation CreateEntry($content: [DataProviderInput!], $post: PostData) {
       createPost(content: $content, post: $post)
  }`;
    const result = await runGQL({
      query: mutation,
      variables: { content: opt.data, post: opt.post },
      operationName: 'CreateEntry',
      context: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });
    return result.data;
  };

  const entriesByAuthor = async (opt: { pubKey: string; offset?: number; limit: number }) => {
    const query = `
  query GetPostsByAuthor($author: String!, $offset: Int, $limit: Int, $pubKey: String) {
       getPostsByAuthor(author: $author, offset: $offset, limit: $limit, pubKey:$pubKey) {
        results{
          content{
            provider
            property
            value
          }
          author{
            pubKey
            name
            userName
            avatar
            coverImage
            description
            ethAddress
            totalPosts
            totalFollowers
            totalFollowing
          }
          title
          type
          _id
          creationDate
          tags
          totalComments
          quotedBy
          quotedByAuthors{
            pubKey
            name
            userName
            avatar
            coverImage
            description
            ethAddress
            totalPosts
            totalFollowers
            totalFollowing
          }
          quotes{
            content{
              provider
              property
              value
            }
            author{
              pubKey
              name
              userName
              avatar
              coverImage
              ethAddress
              totalPosts
              totalFollowers
              totalFollowing
            }
            title
            type
            _id
            creationDate
            tags
          }
        }
        nextIndex
        total
       }
      }`;
    const currentUser = await invoke(authServices[AUTH_SERVICE]).getCurrentUser();
    const result = await runGQL({
      query: query,
      variables: {
        author: opt.pubKey,
        offset: opt.offset,
        limit: opt.limit,
        pubKey: currentUser?.pubKey,
      },
      operationName: 'GetPostsByAuthor',
    });
    return result.data;
  };

  const entriesByTag = async (opt: { name: string; offset?: string; limit: number }) => {
    const query = `
  query GetPostsByTag($tag: String!, $offset: Int, $limit: Int, $pubKey: String) {
       getPostsByTag(tag: $tag, offset: $offset, limit: $limit, pubKey:$pubKey) {
        results{
          content{
            provider
            property
            value
          }
          author{
            pubKey
            name
            userName
            avatar
            coverImage
            description
            ethAddress
            totalPosts
            totalFollowers
            totalFollowing
          }
          title
          type
          _id
          creationDate
          tags
          totalComments
          quotedBy
          quotedByAuthors{
            pubKey
            name
            userName
            avatar
            coverImage
            description
            ethAddress
            totalPosts
            totalFollowers
            totalFollowing
          }
          quotes{
            content{
              provider
              property
              value
            }
            author{
              pubKey
              name
              userName
              avatar
              coverImage
              ethAddress
              totalPosts
              totalFollowers
              totalFollowing
            }
            title
            type
            _id
            creationDate
            tags
          }
        }
        nextIndex
        total
       }
      }`;
    const currentUser = await invoke(authServices[AUTH_SERVICE]).getCurrentUser();
    const result = await runGQL({
      query: query,
      variables: {
        tag: opt.name,
        offset: opt.offset,
        limit: opt.limit,
        pubKey: currentUser?.pubKey,
      },
      operationName: 'GetPostsByTag',
    });
    return result.data;
  };
  return { getEntry, entries, postEntry, entriesByAuthor, entriesByTag };
};

export default { service, name: ENTRY_SERVICE };
