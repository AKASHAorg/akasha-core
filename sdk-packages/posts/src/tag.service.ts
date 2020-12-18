import { AkashaService } from '@akashaproject/sdk-core/lib/IAkashaModule';
import { TAG_SERVICE } from './constants';
import { runGQL } from '@akashaproject/sdk-runtime/lib/gql.network.client';
import authServices, { AUTH_SERVICE } from '@akashaproject/sdk-auth/lib/constants';

const service: AkashaService = (invoke, log) => {
  const getTag = async (opt: { fields: string[]; tagName: string }) => {
    const query = `
  query GetTag($name: String!) {
       getTag(name: $name) {
         ${opt.fields.join(' ')}
       }
      }`;
    const result = await runGQL({
      query: query,
      variables: { name: opt.tagName },
      operationName: 'GetTag',
    });
    return result.data;
  };

  const tags = async (opt: { offset?: string; limit: number; fields: string[] }) => {
    const query = `
  query GetTags($offset: String, $limit: Int) {
       tags(offset: $offset, limit: $limit) {
        results{
        ${opt.fields.join(' ')}
        }
        nextIndex
        total
       }
      }`;
    const result = await runGQL({
      query: query,
      variables: { offset: opt.offset || '', limit: opt.limit || 5 },
      operationName: 'GetTags',
    });
    return result.data;
  };

  const searchTags = async (opt: { tagName: string }) => {
    const query = `
    query SearchTags($name: String!) {
         searchTags(name: $name)
       }`;
    const result = await runGQL({
      query: query,
      variables: { name: opt.tagName },
      operationName: 'SearchTags',
    });
    return result.data;
  };
  const createTag = async (tagName: string) => {
    const token = await invoke(authServices[AUTH_SERVICE]).getToken();
    const mutation = `
  mutation CreateTag($name: String!) {
       createTag(name: $name)
      }`;
    const result = await runGQL({
      query: mutation,
      variables: { name: tagName },
      operationName: 'CreateTag',
      context: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });
    return result.data;
  };

  const getTrending = async () => {
    return searchTags({ tagName: '' });
  };

  return { getTag, tags, createTag, searchTags, getTrending };
};

export default { service, name: TAG_SERVICE };
