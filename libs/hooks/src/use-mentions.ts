import * as React from 'react';
import { useGetFollowingListByDidQuery } from './generated/apollo';
import { hasOwn } from './utils/has-own';

/**
 * Hook to retrieve and set the mentions associated with a profile.
 * @param authenticatedDID - string
 * @returns { setMentionQuery, mentions  } - Object containing the mentions associated
 * with the authenticatedDID and a setMentionQuery method to control the querying
 * of mention data.
 * @example useMentions hook
 * ```typescript
 * const { setMentionQuery, mentions } = useMentions('an authenticated DID');
 * ```
 **/
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

  const mentions = followingList.filter(profile =>
    profile.name?.toLowerCase().startsWith(mentionQuery),
  );

  return { setMentionQuery, mentions };
};

export { useMentions };
