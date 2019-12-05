import { useProfile } from '../../state/profiles';
import { FeedList } from './feed-list';
import * as React from 'react';
import DS from '@akashaproject/design-system';

const { IconButton, Icon } = DS;

export interface IProfilePageFeed {
  profileId: string;
}

export const ProfilePageFeed = (props: IProfilePageFeed) => {
  const [profileState, profileActions] = useProfile();
  const [state, setState] = React.useState<{
    prevItemIdx: string | null;
    limit: number;
    showLoadingSpinner: boolean;
  }>({
    prevItemIdx: null,
    limit: 3,
    showLoadingSpinner: false,
  });
  profileActions.getProfileFeed({
    profileId: props.profileId,
    startIdx: state.prevItemIdx,
    limit: state.limit,
  });

  const feed = profileState.feeds.find(feed => feed.profileId === props.profileId);

  React.useEffect(() => {
    if (state.showLoadingSpinner) {
      setState(prevState => ({ ...prevState, showLoadingSpinner: false }));
    }
  }, [feed?.items.length]);

  if (!feed) {
    return null;
  }

  const loadMoreItems = () => {
    setState({
      prevItemIdx: feed.items[feed.items.length - 1].id,
      limit: state.limit,
      showLoadingSpinner: true,
    });
  };
  return (
    <div>
      <FeedList feed={feed} />
      {state.showLoadingSpinner && <div>Wait! We are searching for more entries...</div>}
      {!state.showLoadingSpinner && (
        <IconButton onClick={loadMoreItems} label="Load more" icon={<Icon type="moreDark" />} />
      )}
    </div>
  );
};
