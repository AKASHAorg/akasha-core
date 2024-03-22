import * as React from 'react';
import { useGetFollowingListByDidQuery } from './generated/apollo';
import { hasOwn } from './utils/has-own';

/**
 * Hook to get a list of users a person can mention by checking the person's following
 * list and search for the names that match the keyword entered after the @ symbol.
 * Note: Users cannot mention people they don't already follow.
 * @example useMentions hook
 * ```typescript
 *   const { setMentionQuery, mentions } = useMentions(authenticatedDID);
 *
 * // set the handler to start searching after a user enter the @ symbol and then a keyword:
 *   const handleGetMentions = (query: string) => {
        setMentionQuery(query);
     };
 * ```
 * The list of possible mentions is returned through the `mentions` variable.
 */
const useMentions = (authenticatedDID: string) => {
  const [mentionQuery, setMentionQuery] = React.useState('');

  const followingReq = useGetFollowingListByDidQuery({
    fetchPolicy: 'cache-and-network',
    variables: {
      id: authenticatedDID,
      last: 500,
    },
    skip: !authenticatedDID,
  });

  const followingList = React.useMemo(() => {
    const edges =
      followingReq?.data?.node && hasOwn(followingReq?.data?.node, 'akashaFollowList')
        ? followingReq?.data?.node.akashaFollowList?.edges
        : [];
    const profiles = edges.map(edge => edge?.node?.profile);
    return profiles || [];
  }, [followingReq]);

  const mentions = followingList.filter(
    profile => profile.name?.toLowerCase().startsWith(mentionQuery),
  );

  return { setMentionQuery, mentions };
};

export { useMentions };
