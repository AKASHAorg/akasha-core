import * as React from 'react';
import { useGetFollowingListByDidQuery } from './generated/apollo';
import { hasOwn } from './utils/has-own';

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
