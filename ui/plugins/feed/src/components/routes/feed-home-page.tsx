import DS from '@akashaproject/design-system';
import * as React from 'react';
// import { useTranslation } from 'react-i18next';
import { /* Link,*/ match } from 'react-router-dom';
import { useFeed } from '../../state/feed';
import FeedItem from '../FeedItem/feed-item';

const { Box, styled } = DS;

export interface IFeedHomePageProps {
  rootPath: string;
  match: match<any> | null;
}

const EntryCard = styled(FeedItem)`
  margin-bottom: 0.5em;
  height: auto;
`;

const FeedHomePage: React.FC<IFeedHomePageProps> = () => {
  // const { t } = useTranslation();
  const [feedState, feedActions] = useFeed();

  const [state, setState] = React.useState<{
    prevItemIdx: string | null;
    limit: number;
    showLoadingSpinner: boolean;
  }>({
    prevItemIdx: null,
    limit: 3,
    showLoadingSpinner: false,
  });

  feedActions.getFeedItems({
    limit: state.limit,
    start: state.prevItemIdx,
  });

  React.useEffect(() => {
    if (state.showLoadingSpinner) {
      setState(prevState => ({ ...prevState, showLoadingSpinner: false }));
    }
  }, [feedState.items.length]);

  const fetchMoreArticles = (ev: React.SyntheticEvent) => {
    setState({
      prevItemIdx: feedState.items[feedState.items.length - 1].entryId,
      limit: state.limit,
      showLoadingSpinner: true,
    });
    ev.preventDefault();
  };

  return (
    <Box>
      <React.Suspense fallback={<div>Loading feed</div>}>
        {feedState.items.map(item => (
          <div key={item.entryId}>
            <React.Suspense fallback={<div>Loading entry</div>}>
              <EntryCard entryId={item.entryId} />
            </React.Suspense>
          </div>
        ))}
        <button onClick={fetchMoreArticles}>Get more</button>
      </React.Suspense>
    </Box>
  );
};

export default FeedHomePage;
