import routes, { POST, REPLY } from '../routes';

export const redirectToPost = (
  navigateToUrl: (path: string) => void,
  callback?: () => void,
) => (details: {
  authorEthAddress: string;
  entryId: string;
  replyTo: {
    authorEthAddress: string;
    entryId: string;
  } | null;
}) => {
  const { entryId, replyTo } = details;
  let url = `${routes[POST]}/${entryId}`;
  if (replyTo) {
    // handle the reply
    url = `${routes[REPLY]}/${entryId}`;
  }
  if (callback && typeof callback === 'function') {
    callback();
  }
  navigateToUrl(url);
};
