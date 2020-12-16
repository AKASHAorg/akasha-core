import { AkashaService } from '@akashaproject/sdk-core/lib/IAkashaModule';
import { COMMENT_SERVICE } from './constants';
import { runGQL } from '@akashaproject/sdk-runtime/lib/gql.network.client';
import authServices, { AUTH_SERVICE } from '@akashaproject/sdk-auth/lib/constants';

interface DataProviderInput {
  provider: string;
  property: string;
  value: string;
}
const service: AkashaService = (invoke, log) => {
  const getComment = async (opt: { commentID: string }) => {
    const query = `
  query GetComment($commentID: String!) {
    getComment(commentID:$commentID){
       content{
          provider
          property
          value
        }
        author{
          pubKey
          userName
          name
          avatar
          coverImage
        }
        creationDate
        _id
    }
  }`;
    const result = await runGQL({
      query: query,
      variables: { commentID: opt.commentID },
      operationName: 'GetComment',
    });
    return result.data;
  };

  const getComments = async (opt: { offset?: string; limit: number; postID: string }) => {
    const query = `
  query GetComments($offset: String, $limit: Int, $postID: String) {
    getComments(postID:$postID, offset: $offset, limit: $limit){
      total
      nextIndex
      results{
        content{
          provider
          property
          value
        }
        author{
          pubKey
          userName
          name
          avatar
          coverImage
        }
        creationDate
        _id
      }
    }
  }`;
    const result = await runGQL({
      query: query,
      variables: { offset: opt.offset, limit: opt.limit, postID: opt.postID },
      operationName: 'GetComments',
    });
    return result.data;
  };

  const addComment = async (opt: {
    data: DataProviderInput;
    comment: { postID: string; replyTo?: string; tags?: string[]; mentions?: string[] };
  }) => {
    const token = await invoke(authServices[AUTH_SERVICE]).getToken();
    const mutation = `
  mutation AddComment($content: [DataProviderInput!], $comment: CommentData) {
       addComment(content: $content, comment: $comment)
  }`;
    const result = await runGQL({
      query: mutation,
      variables: { content: opt.data, comment: opt.comment },
      operationName: 'AddComment',
      context: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });
    return result.data;
  };
  return { getComment, getComments, addComment };
};

export default { service, name: COMMENT_SERVICE };
