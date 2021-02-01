import routes, { POST } from '../routes';

export const redirectToPost = (navigateToUrl: (path: string) => void) => (details: {
  authorEthAddress: string;
  entryId: string;
  replyTo: {
    authorEthAddress: string;
    entryId: string;
  } | null;
}) => {
  const { entryId, replyTo } = details;
  const url = `${routes[POST]}/${entryId}`;
  if (replyTo) {
    // handle the reply
  }
  navigateToUrl(url);
};
