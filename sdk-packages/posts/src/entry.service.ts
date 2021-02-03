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
  query GetEntry($id: String!) {
       getPost(id: $id) {
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
    const result = await runGQL({
      query: query,
      variables: { id: opt.entryId },
      operationName: 'GetEntry',
    });
    return result.data;
  };

  const entries = async (opt: { offset?: string; limit: number }) => {
    const query = `
  query GetEntries($offset: String, $limit: Int) {
       posts(offset: $offset, limit: $limit) {
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
    const result = await runGQL({
      query: query,
      variables: { offset: opt.offset, limit: opt.limit },
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
  query GetPostsByAuthor($author: String!, $offset: Int, $limit: Int) {
       getPostsByAuthor(author: $author, offset: $offset, limit: $limit) {
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
    const result = await runGQL({
      query: query,
      variables: { author: opt.pubKey, offset: opt.offset, limit: opt.limit },
      operationName: 'GetPostsByAuthor',
    });
    return result.data;
  };

  const entriesByTag = async (opt: { name: string; offset?: string; limit: number }) => {
    const query = `
  query GetPostsByTag($tag: String!, $offset: Int, $limit: Int) {
       getPostsByTag(tag: $tag, offset: $offset, limit: $limit) {
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
    const result = await runGQL({
      query: query,
      variables: { tag: opt.name, offset: opt.offset, limit: opt.limit },
      operationName: 'GetPostsByTag',
    });
    return result.data;
  };
  return { getEntry, entries, postEntry, entriesByAuthor, entriesByTag };
};

export default { service, name: ENTRY_SERVICE };
