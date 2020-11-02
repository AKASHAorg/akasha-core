import routes, { POSTS } from '../routes';

export const redirectToPost = (navigateToUrl: (path: string) => void) => (details: {
  authorEthAddress: string;
  entryId: string;
  replyTo: {
    authorEthAddress: string;
    entryId: string;
  } | null;
}) => {
  const { authorEthAddress, entryId, replyTo } = details;
  const url = `${routes[POSTS]}/${authorEthAddress}/post/${entryId}`;
  if (replyTo) {
    // handle the reply
  }
  navigateToUrl(url);
};
