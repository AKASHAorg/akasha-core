import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { /* Link,*/ match } from 'react-router-dom';
import { useFeed } from '../../state/feed';
import FeedItem from '../FeedItem/feed-item';


export interface IFeedHomePageProps {
  rootPath: string;
  match: match<any> | null;
}

const FeedHomePage: React.FC<IFeedHomePageProps> = () => {
  const { t } = useTranslation();
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
    <div>
      {t('Articles List')}
      {feedState.items.map(item => (
        <div key={item.entryId}>
          <React.Suspense fallback={<div>Loading entry</div>}>
            <div style={{ marginBottom: 8 }}>
              <FeedItem entryId={item.entryId} />
            </div>
          </React.Suspense>
        </div>
      ))}
      <button onClick={fetchMoreArticles}>Get more</button>
    </div>
  );
};

export default FeedHomePage;
